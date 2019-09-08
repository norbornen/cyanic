import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import geo_filter from '../../tools/geo_filter';
import { AbstractExtOfferProvider } from './abstract';
import { OfferDTO, Money } from '../../models/Offer';

interface ISearchOffersResponse {
    ads: Array<Dictionary<any>>;
}

export default class LocalsExtOfferProvider extends AbstractExtOfferProvider {

    public async getExtOffers(): Promise<OfferDTO[]> {
        const offers: OfferDTO[] = [];
        try {
            let { data: { ads: extOffers } }: { data: ISearchOffersResponse } =
                await this.agent.post('/api/frontend/rooms', { ...this.connection.config });
            if (extOffers && Array.isArray(extOffers) && extOffers.length > 0) {
                extOffers = extOffers.filter((extOffer) => geo_filter(extOffer.address));
                for (const extOffer of extOffers) {
                    offers.push(this.OfferFactory(extOffer));
                }
            }
        } catch (err) {
            console.error('LocalsExtOfferProvider::getExtOffers', err);
        }

        console.log(`[thelocals] offers: ${offers.length}`);
        return offers;
    }

    public OfferFactory(extOffer: Dictionary<any>): OfferDTO {
        //
        const amount = Number(String(pathOr<string>('', ['price'], extOffer)).replace(/[^\d]/g, ''));
        const currency = pathOr<string>(this.default_currency, ['price_currency_code'], extOffer).toLocaleUpperCase();
        const price: OfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['lat'], extOffer);
        const longitude = path<number>(['lng'], extOffer);
        const addressShort = path<string>(['address'], extOffer);
        const location: OfferDTO['location'] = {
            address: addressShort!,
            full_address: addressShort
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }

        //
        const offer: OfferDTO = {
            data: extOffer,
            ext_id: path<string>(['id'], extOffer)!,
            ext_full_url: this.baseURL + path<string>(['path'], extOffer)!,
            rooms_count: path<number | string>(['rooms'], extOffer)!,
            price, location
        };
        return offer;
    }
}

export { LocalsExtOfferProvider };
