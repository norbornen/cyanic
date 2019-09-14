import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtFlatOfferProvider } from './abstract';
import { FlatOfferDTO, Money } from '../../models/ext_entity/offer/FlatOffer';

interface ISearchFlatOffersResponse {
    data: {
        offersSerialized: Array<Dictionary<any>>
    };
}

export default class CianExtFlatOfferProvider extends AbstractExtFlatOfferProvider {
    // constructor(...args: CtorArgs) {
    //     super(...args);
    // }

    private static EXCLUDE_ADDRESS_ITEM_GEOTYPE: string[] = ['location', 'district', 'underground'];

    public async getExtFlatOffers(): Promise<FlatOfferDTO[]> {
        const offers: FlatOfferDTO[] = [];

        const { data: { data: { offersSerialized: extFlatOffers } } }: { data: ISearchFlatOffersResponse } =
            await this.agent.post('/search-offers/v2/search-offers-desktop/', { jsonQuery: this.connection.config });
        if (extFlatOffers && Array.isArray(extFlatOffers) && extFlatOffers.length > 0) {
            for (const extFlatOffer of extFlatOffers) {
                offers.push(this.FlatOfferFactory(extFlatOffer));
            }
        }

        console.log(`[cian] offers: ${offers.length}`);
        return offers;
    }

    public FlatOfferFactory(extFlatOffer: Dictionary<any>): FlatOfferDTO {
        //
        const amount = path<number>(['bargainTerms', 'price'], extFlatOffer);
        const currency = pathOr<string>(this.default_currency, ['bargainTerms', 'currency'], extFlatOffer).toLocaleUpperCase();
        const price: FlatOfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['geo', 'coordinates', 'lat'], extFlatOffer);
        const longitude = path<number>(['geo', 'coordinates', 'lng'], extFlatOffer);
        const addressShort = pathOr<Array<Dictionary<any>>>([], ['geo', 'address'], extFlatOffer)
            .filter((x) => x && CianExtFlatOfferProvider.EXCLUDE_ADDRESS_ITEM_GEOTYPE.indexOf(x.geoType) === -1)
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
            floor_number: path<number | string>(['floorNumber'], extFlatOffer),
            floors_total: path<number | string | null>(['building', 'floorsCount'], extFlatOffer)!,
            price, location
        };
        return offer;
    }
}

export { CianExtFlatOfferProvider };
