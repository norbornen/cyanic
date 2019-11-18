import { DocumentType } from '@typegoose/typegoose';
import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtEntityFactory } from '../../abstract';
import { FlatOfferModel, FlatOffer, FlatOfferDTO, Money } from '../../../models/ext_entity/offer/FlatOffer';

export default class CianExtEntityFactory extends AbstractExtEntityFactory {

    private static EXCLUDE_ADDRESS_ITEM_GEOTYPE: string[] = ['location', 'district', 'underground'];

    public async makeInstanse(extFlatOffer: Dictionary<any>): Promise<DocumentType<FlatOffer>> {
        //
        const amount = path<number>(['bargainTerms', 'price'], extFlatOffer);
        const currency = pathOr<string>(this.default_currency, ['bargainTerms', 'currency'], extFlatOffer).toLocaleUpperCase();
        const price: FlatOfferDTO['price'] = new Money(amount!, currency);
        //
        const photos = ((extFlatOffer.photos || []) as Array<Dictionary<any>>).map((x): string => x.fullUrl);
        //
        const latitude = path<number>(['geo', 'coordinates', 'lat'], extFlatOffer);
        const longitude = path<number>(['geo', 'coordinates', 'lng'], extFlatOffer);
        const addressShort = pathOr<Array<Dictionary<any>>>([], ['geo', 'address'], extFlatOffer)
            .filter((x) => x && CianExtEntityFactory.EXCLUDE_ADDRESS_ITEM_GEOTYPE.indexOf(x.geoType) === -1)
            .map((x) => path<string>(['fullName'], x) || path<string>(['name'], x))
            .filter((name) => !(isNil(name) || isEmpty(name)))
            .join(', ')
            || path<string>(['geo', 'userInput'], extFlatOffer);
        const addressFull = pathOr<Array<Dictionary<any>>>([], ['geo', 'address'], extFlatOffer)
            .map((x) => path<string>(['fullName'], x) || path<string>(['name'], x))
            .filter((name) => !(isNil(name) || isEmpty(name)))
            .join(', ');

        const location: FlatOfferDTO['location'] = {
            address: addressShort || addressFull,
            full_address: addressFull
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }

        //
        const offer: FlatOfferDTO = {
            ext_data: extFlatOffer,
            ext_id: (path<string>(['cianId'], extFlatOffer) || path<string>(['id'], extFlatOffer))!,
            ext_full_url: path<string>(['fullUrl'], extFlatOffer)!,
            rooms_count: path<number | string>(['roomsCount'], extFlatOffer)!,
            total_area: path<number | string>(['totalArea'], extFlatOffer)!,
            floor_number: path<number | string>(['floorNumber'], extFlatOffer),
            floors_total: path<number | string | null>(['building', 'floorsCount'], extFlatOffer)!,
            photos,
            price, location
        };
        let ext_updated_at: Date | undefined;
        if ('creationDate' in extFlatOffer && !isNil(extFlatOffer.creationDate) && !isEmpty(extFlatOffer.creationDate)) {
            ext_updated_at = new Date(extFlatOffer.creationDate);
        }
        if ((!ext_updated_at || isNaN(ext_updated_at.getTime())) && 'addedTimestamp' in extFlatOffer && !isNil(extFlatOffer.addedTimestamp) && /^\d+$/.test(`${extFlatOffer.addedTimestamp}`)) {
            ext_updated_at = new Date(Number(String(extFlatOffer.addedTimestamp).padEnd(13, '0')));
        }
        if (ext_updated_at && !isNaN(ext_updated_at.getTime())) {
            offer.ext_updated_at = ext_updated_at;
        }

        return new FlatOfferModel(offer);
    }
}

export { CianExtEntityFactory };
