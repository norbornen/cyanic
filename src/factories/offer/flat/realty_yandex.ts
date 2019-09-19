import { InstanceType } from '@hasezoey/typegoose';
import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtEntityFactory } from '../../abstract';
import { FlatOfferModel, FlatOffer, FlatOfferDTO, Money } from '../../../models/ext_entity/offer/FlatOffer';

export default class YandexExtEntityFactory extends AbstractExtEntityFactory {

    public async makeInstanse(extFlatOffer: Dictionary<any>): Promise<InstanceType<FlatOffer>> {
        //
        const amount = path<number>(['price', 'value'], extFlatOffer);
        const currency = pathOr<string>(this.default_currency, ['price', 'currency'], extFlatOffer).toLocaleUpperCase();
        const price: FlatOfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['location', 'point', 'latitude'], extFlatOffer);
        const longitude = path<number>(['location', 'point', 'longitude'], extFlatOffer);
        const addressShort = path<string>(['location', 'address'], extFlatOffer);
        const addressFull = path<string>(['location', 'geocoderAddress'], extFlatOffer);
        const location: FlatOfferDTO['location'] = {
            address: (addressShort || addressFull)!,
            full_address: addressFull
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }

        //
        const floor_number = ([] as number[]).concat(extFlatOffer.floorsOffered || [], extFlatOffer.floorsFlatOffered || []).find((x) => !isNil(x));

        //
        const offer: FlatOfferDTO = {
            ext_data: extFlatOffer,
            ext_id: path<string>(['offerId'], extFlatOffer)!,
            ext_full_url: 'https:' + path<string>(['unsignedInternalUrl'], extFlatOffer)!,
            rooms_count: path<number | string>(['roomsTotal'], extFlatOffer)!,
            floor_number,
            floors_total: path<number | string | null>(['floorsTotal'], extFlatOffer)!,
            price, location
        };
        return new FlatOfferModel(offer);
    }
}

export { YandexExtEntityFactory };
