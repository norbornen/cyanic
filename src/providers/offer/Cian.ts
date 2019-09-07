import { AbstractExtOfferProvider, CtorArgs } from './abstract';
import { Offer } from '../../models/Offer';

export default class CianExtOfferProvider extends AbstractExtOfferProvider {
    // constructor(...args: CtorArgs) {
    //     super(...args);
    // }

    public async getExtOffers(): Promise<Offer[]> {
        return [] as Offer[];
    }
}

export { CianExtOfferProvider };
