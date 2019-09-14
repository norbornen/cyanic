import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import geo_filter from '../../tools/geo_filter';
import { AbstractExtFlatOfferProvider } from './abstract';
import { FlatOfferDTO, Money } from '../../models/ext_entity/offer/FlatOffer';

interface ISearchFlatOffersResponse {
    ads: Array<Dictionary<any>>;
}

export default class LocalsExtFlatOfferProvider extends AbstractExtFlatOfferProvider {

    public async getExtFlatOffers(): Promise<FlatOfferDTO[]> {
        const offers: FlatOfferDTO[] = [];

        let { data: { ads: extFlatOffers } }: { data: ISearchFlatOffersResponse } =
            await this.agent.post('/api/frontend/rooms', { ...this.connection.config });
        if (extFlatOffers && Array.isArray(extFlatOffers) && extFlatOffers.length > 0) {
            extFlatOffers = extFlatOffers.filter((extFlatOffer) => geo_filter(extFlatOffer.address));
            for (const extFlatOffer of extFlatOffers) {
                offers.push(this.FlatOfferFactory(extFlatOffer));
            }
        }

        console.log(`[thelocals] offers: ${offers.length}`);
        return offers;
    }

    public FlatOfferFactory(extFlatOffer: Dictionary<any>): FlatOfferDTO {
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
        return offer;
    }
}

export { LocalsExtFlatOfferProvider };
