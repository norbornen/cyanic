import { prop, index, getModelForClass } from '@typegoose/typegoose';
import { Money } from '../../../tools/money';
import { ExtEntity, ExtEntityDTO } from '../ExtEntity';

@index({ source: 1, ext_id: 1 }, { unique: true })
@index({ __t: 1, is_active: 1, createdAt: 1 })
@index({ is_active: 1 })
class Offer extends ExtEntity {

    @prop({ required: true })
    public price!: Money;

}

type OfferDTO<T extends Offer> = ExtEntityDTO<T>;
const OfferModel = getModelForClass(Offer);

export default OfferModel;
export { OfferModel, Offer, OfferDTO, Money };
