import { prop, Ref, index } from 'typegoose';
import { Money } from '../tools/money';
import { CommonModel, CommonModelDTO } from './CommonModel';
import { ExtSource } from './ExtSource';

interface OfferLocation {
    address: string;
    full_address?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

@index({ source: 1, ext_id: 1 }, { unique: true })
class Offer extends CommonModel {
    @prop({ required: true, ref: ExtSource })
    public source!: Ref<ExtSource>;

    @prop({ required: true, index: true })
    public ext_id!: string;

    @prop({ required: true, trim: true })
    public ext_full_url: string;

    @prop({ required: true })
    public rooms_count: string | number;

    @prop()
    public floor_number?: string | number;

    @prop()
    public floors_total?: string | number;

    @prop({ required: true })
    public price: Money;

    @prop({ required: true })
    public location: OfferLocation;

    @prop()
    public with_children?: boolean;

    @prop()
    public data?: object;

    @prop({ default: false })
    public is_telegram_notification_send?: boolean;
}

type OfferDTO = Omit<CommonModelDTO<Offer>, 'source'> & { source?: string };

const OfferModel = Offer.getModelForClass<Offer>();

export default OfferModel;
export { OfferModel, Offer, OfferDTO, Money };
