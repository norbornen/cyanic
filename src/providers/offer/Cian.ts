import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtOfferProvider } from './abstract';
import { OfferDTO, Money } from '../../models/Offer';

interface ISearchOffersDesktopResponse {
    data: {
        offersSerialized: Array<Dictionary<any>>
    };
}

export default class CianExtOfferProvider extends AbstractExtOfferProvider {
    // constructor(...args: CtorArgs) {
    //     super(...args);
    // }

    public async getExtOffers(): Promise<OfferDTO[]> {
        const offers: OfferDTO[] = [];
        try {
            const { data: { data: { offersSerialized: extOffers } } }: { data: ISearchOffersDesktopResponse } =
                await this.agent.post('/search-offers/v2/search-offers-desktop/', { jsonQuery: this.connection.config });
            if (extOffers && Array.isArray(extOffers) && extOffers.length > 0) {
                for (const extOffer of extOffers) {
                    offers.push(this.OfferFactory(extOffer));
                }
            }
        } catch (err) {
            console.error('CianExtOfferProvider::getExtOffers', err);
        }

        console.log(`[cian] offers: ${offers.length}`);
        return offers;
    }

    public OfferFactory(extOffer: Dictionary<any>): OfferDTO {
        //
        const amount = path<number>(['bargainTerms', 'price'], extOffer);
        const currency = pathOr<string>(this.default_currency, ['bargainTerms', 'currency'], extOffer).toLocaleUpperCase();
        const price: OfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['geo', 'coordinates', 'lat'], extOffer);
        const longitude = path<number>(['geo', 'coordinates', 'lng'], extOffer);
        const addressShort = path<string>(['geo', 'userInput'], extOffer);
        const addressFull = pathOr<[]>([], ['geo', 'address'], extOffer)
                                .map((x) => path<string>(['name'], x)).filter((name) => !(isNil(name) || isEmpty(name)))
                                .join(', ');
        const location: OfferDTO['location'] = {
            address: addressShort || addressFull,
            full_address: addressFull
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }

        //
        const offer: OfferDTO = {
            data: extOffer,
            ext_id: (path<string>(['cianId'], extOffer) || path<string>(['id'], extOffer))!,
            ext_full_url: path<string>(['fullUrl'], extOffer)!,
            rooms_count: path<number | string>(['roomsCount'], extOffer)!,
            flow_number: path<number | string>(['floorNumber'], extOffer),
            flow_total: path<number | string | null>(['building', 'floorsCount'], extOffer)!,
            price, location
        };
        return offer;
    }
}

export { CianExtOfferProvider };
