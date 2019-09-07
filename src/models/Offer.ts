import { prop, Ref, index } from 'typegoose';
import { CommonModel, CommonModelDTO } from './CommonModel';
import { ExtSource } from './ExtSource';

@index({ source: 1, ext_id: 1 }, { unique: true })
class Offer extends CommonModel {
    @prop({ required: true, index: true })
    public ext_id: string;

    @prop({ required: true, ref: ExtSource })
    public source: Ref<ExtSource>;
}

type OfferDTO = CommonModelDTO<Offer>;

const OfferModel = Offer.getModelForClass<Offer>();

export default OfferModel;
export { OfferModel, Offer, OfferDTO };
