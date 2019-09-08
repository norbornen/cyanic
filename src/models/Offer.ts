// tslint:disable:max-classes-per-file
import { path } from 'ramda';
import { prop, Ref, index, pre } from 'typegoose';
import { Money } from '../tools/money';
import { CommonModel, CommonModelDTO } from './CommonModel';
import { ExtSource } from './ExtSource';

interface FlatOfferLocation {
    address: string;
    short_address?: string;
    full_address?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

@index({ source: 1, ext_id: 1 }, { unique: true })
abstract class Offer extends CommonModel {
    @prop({ required: true, ref: ExtSource })
    public source!: Ref<ExtSource>;

    @prop({ required: true, index: true })
    public ext_id!: string;

    @prop({ required: true, trim: true })
    public ext_full_url!: string;

    @prop({ required: true })
    public price!: Money;

    @prop({ select: false })
    public data?: object;

    @prop({ default: false })
    public is_notifications_send?: boolean;
}


@pre<FlatOffer>(/^findOneAndUpdate/, function() {
    const location = path<FlatOfferLocation>(['_update', 'location'], this);
    if (location && 'address' in location && location.address) {
        location.short_address = location.address.replace(/(Россия|Москва),\s*/g, '').replace(/,\s?,/g, ',');
    }
})
@index({ source: 1, ext_id: 1 }, { unique: true })
class FlatOffer extends Offer {

    @prop({ required: true })
    public rooms_count!: string | number;

    @prop()
    public floor_number?: string | number;

    @prop()
    public floors_total?: string | number;

    @prop({ required: true })
    public location!: FlatOfferLocation;

}

type FlatOfferDTO = Omit<CommonModelDTO<FlatOffer>, 'source'> & { source?: string };

// const OfferModel = Offer.getModelForClass<Offer>({ collection: 'offers', discriminatorKey: '_classname' });
// const FlatOfferModel = OfferModel.discriminator('FlatOfferModel', new FlatOffer().buildSchema<FlatOffer>(FlatOffer));
const FlatOfferModel = FlatOffer.getModelForClass<FlatOffer>({ collection: 'offers', discriminatorKey: '_classname' });

export default FlatOfferModel;
export { FlatOfferModel, FlatOffer, FlatOfferDTO, Money };
