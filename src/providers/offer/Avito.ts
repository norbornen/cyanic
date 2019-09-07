import { Dictionary, path, pathOr, isNil, isEmpty } from 'ramda';
import { AbstractExtOfferProvider } from './abstract';
import { OfferDTO } from '../../models/Offer';
import { Money } from 'ts-money';

export default class AvitoExtOfferProvider extends AbstractExtOfferProvider {
    public async getExtOffers(): Promise<OfferDTO[]> {
        return [] as OfferDTO[];
    }

    public OfferFactory(extOffer: Dictionary<any>): OfferDTO {
        return {} as never as OfferDTO;
    }
}

export { AvitoExtOfferProvider };
