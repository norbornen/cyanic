import { Dictionary, path, pathOr, isNil } from 'ramda';
import { AbstractExtOfferProvider } from './abstract';
import { OfferDTO, Money } from '../../models/Offer';

interface ISearchOffersResponse {
    response: {
        search: {
            offers: {
                entities: Array<Dictionary<any>>
            }
        }
    };
}

export default class YandexExtOfferProvider extends AbstractExtOfferProvider {

    public async getExtOffers(): Promise<OfferDTO[]> {
        const offers: OfferDTO[] = [];

        const { data: { response: { search: { offers: { entities: extOffers } } } } }: { data: ISearchOffersResponse } =
            await this.agent.get('/gate/react-page/get/', { params: this.connection.config });
        if (extOffers && Array.isArray(extOffers) && extOffers.length > 0) {
            for (const extOffer of extOffers) {
                offers.push(this.OfferFactory(extOffer));
            }
        }

        console.log(`[yandex] offers: ${offers.length}`);
        return offers;
    }

    public OfferFactory(extOffer: Dictionary<any>): OfferDTO {
        //
        const amount = path<number>(['price', 'value'], extOffer);
        const currency = pathOr<string>(this.default_currency, ['price', 'currency'], extOffer).toLocaleUpperCase();
        const price: OfferDTO['price'] = new Money(amount!, currency);
        //
        const latitude = path<number>(['location', 'point', 'latitude'], extOffer);
        const longitude = path<number>(['location', 'point', 'longitude'], extOffer);
        const addressShort = path<string>(['location', 'address'], extOffer);
        const addressFull = path<string>(['location', 'geocoderAddress'], extOffer);
        const location: OfferDTO['location'] = {
            address: (addressShort || addressFull)!,
            full_address: addressFull
        };
        if (latitude && longitude) {
            location.coordinates = { latitude, longitude };
        }

        //
        const floor_number = pathOr<number[]>([], ['floorsOffered'], extOffer).find((x) => !isNil(x));

        //
        const offer: OfferDTO = {
            data: extOffer,
            ext_id: path<string>(['offerId'], extOffer)!,
            ext_full_url: 'https:' + path<string>(['unsignedInternalUrl'], extOffer)!,
            rooms_count: path<number | string>(['roomsTotal'], extOffer)!,
            floor_number, floors_total: path<number | string | null>(['floorsTotal'], extOffer)!,
            price, location
        };
        return offer;
    }
}

export { YandexExtOfferProvider };
