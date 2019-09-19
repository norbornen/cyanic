import { prop, index } from '@hasezoey/typegoose';
import { Money } from '../../../tools/money';
import { ExtEntity, ExtEntityDTO } from '../ExtEntity';

@index({ ext_id: 1, source: 1 }, { unique: true })
@index({ __t: 1, is_active: 1, createdAt: 1 })
@index({ __t: 1, is_active: 1, ext_updated_at: 1 })
@index({ is_active: 1 })
abstract class Offer extends ExtEntity {

    @prop({ required: true })
    public price!: Money;

}

type OfferDTO<T extends Offer> = ExtEntityDTO<T>;
const OfferModel = Offer.getModelForClass<Offer>();

export default OfferModel;
export { OfferModel, Offer, OfferDTO, Money };
