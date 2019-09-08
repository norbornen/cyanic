import pSettle from 'p-settle';
import { isNil, isEmpty } from 'ramda';
import ExtSourceModel from '../models/ExtSource';
import { extFlatOfferProviderFactory } from '../providers/flat_offer';
import FlatOfferModel, { FlatOffer, FlatOfferDTO } from '../models/Offer';


export class ImportUsecase {

    public async getExtFlatOffers(): Promise<FlatOfferDTO[]> {
        const extSources = await ExtSourceModel.find({ is_active: true });

        const importResults = await pSettle(
            extSources.map(async (extSource): Promise<FlatOfferDTO[]> => {
                const provider = extFlatOfferProviderFactory(extSource);
                const offers = await provider.getExtFlatOffers();
                offers.forEach((offer) => offer.source = extSource.id);
                return offers;
            })
        );

        const extFlatOffers = importResults
            .reduce((acc, x) => {
                if (x.isRejected) {
                    console.error(x.reason);
                }
                if (x.isFulfilled && x.value && Array.isArray(x.value) && x.value.length > 0) {
                    acc = acc.concat(x.value);
                }
                return acc;
            }, [] as FlatOfferDTO[])
            .filter((extFlatOffer) => !(isNil(extFlatOffer) || isEmpty(extFlatOffer)));

        return extFlatOffers;
    }

    public async updateExtFlatOffers(extFlatOffers: FlatOfferDTO[]): Promise<FlatOffer[]> {
        const offers: FlatOffer[] = [];
        if (extFlatOffers && extFlatOffers.length > 0) {
            for (const extFlatOffer of extFlatOffers) {
                const offer = await FlatOfferModel.findOneAndUpdate(
                    { ext_id: extFlatOffer.ext_id, source: extFlatOffer.source },
                    extFlatOffer,
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                offers.push(offer!);
            }
        }
        return offers;
    }

    public async getAndUpdateExtFlatOffers(): Promise<FlatOffer[]> {
        const extFlatOffers = await this.getExtFlatOffers();
        return this.updateExtFlatOffers(extFlatOffers);
    }

}
