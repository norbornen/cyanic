import { prop, index } from 'typegoose';
import { Money } from '../../../tools/money';
import { ExtEntity } from '../ExtEntity';

@index({ source: 1, ext_id: 1 }, { unique: true })
@index({ is_active: 1, createdAt: 1 })
abstract class Offer extends ExtEntity {
    @prop({ required: true })
    public price!: Money;

    @prop({ default: true })
    public is_notifications_send?: boolean;
}

// const OfferModel = Offer.getModelForClass<Offer>({ collection: 'offers', discriminatorKey: '_classname' });
// export default OfferModel;
export { Offer, Money };
