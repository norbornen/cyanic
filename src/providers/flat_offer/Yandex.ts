import { Dictionary, path, pathOr, isNil } from 'ramda';
import { AbstractExtFlatOfferProvider } from './abstract';
import { FlatOfferDTO, Money } from '../../models/Offer';

interface ISearchFlatOffersResponse {
    response: {
        search: {
            offers: {
                entities: Array<Dictionary<any>>
            }
        }
    };
}

export default class YandexExtFlatOfferProvider extends AbstractExtFlatOfferProvider {

    public async getExtFlatOffers(): Promise<FlatOfferDTO[]> {
        const offers: FlatOfferDTO[] = [];

        const { data: { response: { search: { offers: { entities: extFlatOffers } } } } }: { data: ISearchFlatOffersResponse } =
            await this.agent.get('/gate/react-page/get/', { params: this.connection.config });
        if (extFlatOffers && Array.isArray(extFlatOffers) && extFlatOffers.length > 0) {
            for (const extFlatOffer of extFlatOffers) {
                offers.push(this.FlatOfferFactory(extFlatOffer));
            }
        }

        console.log(`[yandex] offers: ${offers.length}`);
        return offers;
    }

    public FlatOfferFactory(extFlatOffer: Dictionary<any>): FlatOfferDTO {
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
        const floor_number = pathOr<number[]>([], ['floorsFlatOffered'], extFlatOffer).find((x) => !isNil(x));

        //
        const offer: FlatOfferDTO = {
            data: extFlatOffer,
            ext_id: path<string>(['offerId'], extFlatOffer)!,
            ext_full_url: 'https:' + path<string>(['unsignedInternalUrl'], extFlatOffer)!,
            rooms_count: path<number | string>(['roomsTotal'], extFlatOffer)!,
            floor_number, floors_total: path<number | string | null>(['floorsTotal'], extFlatOffer)!,
            price, location
        };
        return offer;
    }
}

export { YandexExtFlatOfferProvider };
