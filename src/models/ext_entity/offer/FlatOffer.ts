import { path, Dictionary } from 'ramda';
import { prop, pre, DocumentType } from '@typegoose/typegoose';
import { models as typegooseModels } from '@typegoose/typegoose/lib/data';
import { OfferModel, OfferDTO, Offer, Money } from './Offer';

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

type FlatOfferDTO = OfferDTO<FlatOffer>;
const FlatOfferModel = OfferModel.discriminator<DocumentType<FlatOffer>>('FlatOffer', new FlatOffer().buildSchema(FlatOffer));

/**
 * hack: register model in the internal typegoose storage
 */
(typegooseModels as Dictionary<any>)['FlatOffer'] = FlatOfferModel;

export default FlatOfferModel;
export { FlatOfferModel, FlatOffer, FlatOfferDTO, Money };
