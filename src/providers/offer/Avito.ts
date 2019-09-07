import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import geo_filter from '../../tools/geo_filter';
import { AbstractExtOfferProvider } from './abstract';
import { OfferDTO, Money } from '../../models/Offer';

interface ISearchOffersResponse {
    items: Array<Dictionary<any>>;
}

export default class AvitoExtOfferProvider extends AbstractExtOfferProvider {

    public async getExtOffers(): Promise<OfferDTO[]> {
        const offers: OfferDTO[] = [];
        try {
            let { data: { items: extOffers } }: { data: ISearchOffersResponse } = await this.agent.get('/map/items', {params: this.connection.config});
            if (extOffers && Array.isArray(extOffers) && extOffers.length > 0) {
                extOffers = extOffers.filter((extOffer) => geo_filter(extOffer.address));
                for (let extOffer of extOffers) {
                    try {
                        const params = { id: extOffer.id, lat: path(['coords', 'lat'], extOffer), lng: path(['coords', 'lng'], extOffer) };
                        const { data: { items } }: { data: ISearchOffersResponse } = await this.agent.get('/js/catalog/items', { params });
                        if (extOffer.id in items) {
                            extOffer = Object.assign(extOffer, items[ extOffer.id ] || {});
                        }
                    } catch (err) {
                        console.error('AvitoExtOfferProvider::extendExtOffers', err);
                    }
                    offers.push(this.OfferFactory(extOffer));
                }
            }
        } catch (err) {
            console.error('AvitoExtOfferProvider::getExtOffers', err);
        }

        console.log(`[avito] offers: ${offers.length}`);
        return offers;
    }

    public OfferFactory(extOffer: Dictionary<any>): OfferDTO {
        //
        const amount = path<number>(['price'], extOffer);
        const currency = this.default_currency;
        const price: OfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['coords', 'lat'], extOffer);
        const longitude = path<number>(['coords', 'lng'], extOffer);
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
            ext_full_url: this.baseURL + path<string>(['url'], extOffer)!,
            rooms_count: pathOr<number | string>('-', ['ext', 'rooms'], extOffer)!,
            floor_number: pathOr<number | string>('-', ['ext', 'floor'], extOffer),
            floors_total: pathOr<number | string>('-', ['ext', 'floors_count'], extOffer)!,
            price, location
        };
        return offer;
    }
}

export { AvitoExtOfferProvider };
