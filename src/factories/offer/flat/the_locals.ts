import { InstanceType } from '@hasezoey/typegoose';
import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtEntityFactory } from '../../abstract';
import { FlatOfferModel, FlatOffer, FlatOfferDTO, Money } from '../../../models/ext_entity/offer/FlatOffer';

export default class LocalsExtEntityFactory extends AbstractExtEntityFactory {
    public baseURL: string = 'https://thelocals.ru';

    public async makeInstanse(extFlatOffer: Dictionary<any>): Promise<InstanceType<FlatOffer>> {
        //
        const amount = Number(String(pathOr<string>('', ['price'], extFlatOffer)).replace(/[^\d]/g, ''));
        const currency = pathOr<string>(this.default_currency, ['price_currency_code'], extFlatOffer).toLocaleUpperCase();
        const price: FlatOfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['lat'], extFlatOffer);
        const longitude = path<number>(['lng'], extFlatOffer);
        const addressShort = path<string>(['address'], extFlatOffer);
        const location: FlatOfferDTO['location'] = {
            address: addressShort!,
            full_address: addressShort
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }

        //
        const offer: FlatOfferDTO = {
            ext_data: extFlatOffer,
            ext_id: path<string>(['id'], extFlatOffer)!,
            ext_full_url: this.baseURL + path<string>(['path'], extFlatOffer)!,
            rooms_count: path<number | string>(['rooms'], extFlatOffer)!,
            price, location
        };
        return new FlatOfferModel(offer);
    }
}

export { LocalsExtEntityFactory };
