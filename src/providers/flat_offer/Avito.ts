import { Dictionary, path, pathOr } from 'ramda';
import geo_filter from '../../tools/geo_filter';
import { AbstractExtFlatOfferProvider } from './abstract';
import { FlatOfferDTO, Money } from '../../models/Offer';

interface ISearchFlatOffersResponse {
    items: Array<Dictionary<any>>;
}

export default class AvitoExtFlatOfferProvider extends AbstractExtFlatOfferProvider {

    public async getExtFlatOffers(): Promise<FlatOfferDTO[]> {
        const offers: FlatOfferDTO[] = [];

        let { data: { items: extFlatOffers } }: { data: ISearchFlatOffersResponse } = await this.agent.get('/map/items', {params: this.connection.config});
        if (extFlatOffers && Array.isArray(extFlatOffers) && extFlatOffers.length > 0) {
            extFlatOffers = extFlatOffers.filter((extFlatOffer) => geo_filter(extFlatOffer.address));
            for (let extFlatOffer of extFlatOffers) {
                try {
                    const params = { id: extFlatOffer.id, lat: path(['coords', 'lat'], extFlatOffer), lng: path(['coords', 'lng'], extFlatOffer) };
                    const { data: { items } }: { data: ISearchFlatOffersResponse } = await this.agent.get('/js/catalog/items', { params });
                    if (extFlatOffer.id in items) {
                        extFlatOffer = Object.assign(extFlatOffer, items[ extFlatOffer.id ] || {});
                    }
                } catch (err) {
                    console.error('AvitoExtFlatOfferProvider::extendExtFlatOffers', err);
                }
                offers.push(this.FlatOfferFactory(extFlatOffer));
            }
        }

        console.log(`[avito] offers: ${offers.length}`);
        return offers;
    }

    public FlatOfferFactory(extFlatOffer: Dictionary<any>): FlatOfferDTO {
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
        const offer: FlatOfferDTO = {
            data: extFlatOffer,
            ext_id: path<string>(['id'], extFlatOffer)!,
            ext_full_url: this.baseURL + path<string>(['url'], extFlatOffer)!,
            rooms_count: pathOr<number | string>('-', ['ext', 'rooms'], extFlatOffer)!,
            floor_number: pathOr<number | string>('-', ['ext', 'floor'], extFlatOffer),
            floors_total: pathOr<number | string>('-', ['ext', 'floors_count'], extFlatOffer)!,
            price, location
        };
        return offer;
    }
}

export { AvitoExtFlatOfferProvider };
