import pSettle from 'p-settle';
import { isNil, isEmpty } from 'ramda';
import ExtSourceModel from '../models/ExtSource';
import { extOfferProviderFactory } from '../providers/offer';
import OfferModel, { Offer, OfferDTO } from '../models/Offer';


export class ImportUsecase {
    public async getExtOffers(): Promise<OfferDTO[]> {
        const extSources = await ExtSourceModel.find({ is_active: true });

        const importResults = await pSettle(
            extSources.map(async (extSource): Promise<OfferDTO[]> => {
                const provider = extOfferProviderFactory(extSource);
                const offers = await provider.getExtOffers();
                offers.forEach((offer) => offer.source = extSource.id);
                return offers;
            })
        );

        const extOffers = importResults
            .reduce((acc, x) => {
                if (x.isRejected) {
                    console.error(x.reason);
                }
                if (x.isFulfilled && x.value && Array.isArray(x.value) && x.value.length > 0) {
                    acc = acc.concat(x.value);
                }
                return acc;
            }, [] as OfferDTO[])
            .filter((extOffer) => !(isNil(extOffer) || isEmpty(extOffer)));

        return extOffers;
    }

    public async updateExtOffers(extOffers: OfferDTO[]): Promise<Offer[]> {
        const offers: Offer[] = [];
        if (extOffers && extOffers.length > 0) {
            for (const extOffer of extOffers) {
                const offer = await OfferModel.findOneAndUpdate(
                    { ext_id: extOffer.ext_id, source: extOffer.source },
                    extOffer,
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                offers.push(offer!);
            }
        }
        return offers;
    }

    public async getAndUpdateExtOffers(): Promise<Offer[]> {
        const extOffers = await this.getExtOffers();
        return this.updateExtOffers(extOffers);
    }

}
