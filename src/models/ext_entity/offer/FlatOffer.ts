import { path } from 'ramda';
import { prop, index, pre } from 'typegoose';
import { CommonModelDTO } from '../../CommonModel';
import { Offer, Money } from './Offer';
import { ExtSource } from '../../ExtSource';

interface FlatOfferLocation {
    address: string;
    short_address?: string;
    full_address?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

const oddAddressPartRegexp = /(Россия|г\.?\s?Москва|Москва),\s*/g;
@pre<FlatOffer>(/^findOneAndUpdate/, function() {
    const location = path<FlatOfferLocation>(['_update', 'location'], this);
    if (location && 'address' in location && location.address) {
        location.short_address = location.address.replace(oddAddressPartRegexp, '').replace(/,\s?,/g, ',');
    }
})
@index({ source: 1, ext_id: 1 }, { unique: true })
@index({ is_active: 1, createdAt: 1 })
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
