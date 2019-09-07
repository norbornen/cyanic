import ExtSourceModel from '../models/ExtSource';
import { extOfferProviderFactory } from '../providers/offer';
import OfferModel, { Offer } from '../models/Offer';


export class ImportUsecase {
    public async getExtOffers(): Promise<Offer[]> {

        const extSources = await ExtSourceModel.find({ is_active: true });
        const ext_offers = (await Promise.all(
            extSources.map((extSource): Promise<Offer[]> => {
                const provider = extOfferProviderFactory(extSource);
                return provider.getExtOffers();
            })
        )).flat();

        console.log('EXT_OFFERS', ext_offers);
        return ext_offers;
    }
}
