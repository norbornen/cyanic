import { InstanceType } from '@typegoose/typegoose';
import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtEntityFactory } from '../../abstract';
import { FlatOfferModel, FlatOffer, FlatOfferDTO, Money } from '../../../models/ext_entity/offer/FlatOffer';

export default class AvitoExtEntityFactory extends AbstractExtEntityFactory {
    public baseURL: string = 'https://www.avito.ru';

    public async makeInstanse(extFlatOffer: Dictionary<any>): Promise<InstanceType<FlatOffer>> {
        //
        const amount = path<number>(['price'], extFlatOffer);
        const currency = this.default_currency;
        const price: FlatOfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['coords', 'lat'], extFlatOffer);
        const longitude = path<number>(['coords', 'lng'], extFlatOffer);
        const addressShort = path<string>(['address'], extFlatOffer);
        const location: FlatOfferDTO['location'] = {
            address: addressShort!,
            full_address: addressShort
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }
        //
        const rooms_count = pathOr<number | string>('-', ['ext', 'rooms'], extFlatOffer);
        const floor_number = pathOr<number | string>('-', ['ext', 'floor'], extFlatOffer);
        const floors_total = pathOr<number | string>('-', ['ext', 'floors_count'], extFlatOffer);

        //
        const offer: FlatOfferDTO = {
            ext_data: extFlatOffer,
            ext_id: path<string>(['id'], extFlatOffer)!,
            ext_full_url: this.baseURL + path<string>(['url'], extFlatOffer)!,
            rooms_count: rooms_count && /^\d+$/.test(rooms_count + '') ? Number(rooms_count) : rooms_count,
            floor_number: floor_number && /^\d+$/.test(floor_number + '') ? Number(floor_number) : floor_number,
            floors_total: floors_total && /^\d+$/.test(floors_total + '') ? Number(floors_total) : floors_total,
            price, location,
        };
        if ('time' in extFlatOffer && /^\d+$/.test(`${extFlatOffer.time}`)) {
            const ext_updated_at = new Date(Number(String(extFlatOffer.time).padEnd(13, '0')));
            if (ext_updated_at && !isNaN(ext_updated_at.getTime())) {
                offer.ext_updated_at = ext_updated_at;
            }
        }

        return new FlatOfferModel(offer);
    }
}

export { AvitoExtEntityFactory };
