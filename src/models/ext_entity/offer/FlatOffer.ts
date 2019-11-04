import { path, Dictionary } from 'ramda';
import { prop, pre, getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { OfferModel, Offer, OfferDTO, Money } from './Offer';

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
const FlatOfferModel = getDiscriminatorModelForClass(OfferModel, FlatOffer);

export default FlatOfferModel;
export { FlatOfferModel, FlatOffer, FlatOfferDTO, Money };
