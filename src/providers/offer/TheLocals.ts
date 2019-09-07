import { AbstractExtOfferProvider, CtorArgs } from './abstract';
import { Offer } from '../../models/Offer';

export default class LocalsExtOfferProvider extends AbstractExtOfferProvider {
    constructor(...args: CtorArgs) {
        super(...args);
        console.log('ctor C');
    }

    public async getExtOffers(): Promise<Offer[]> {
        return [] as Offer[];
    }
}

export { LocalsExtOfferProvider };
