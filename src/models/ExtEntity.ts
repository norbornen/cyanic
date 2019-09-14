import { prop, Ref, index } from 'typegoose';
import { CommonModel } from './CommonModel';
import { ExtSource } from './ExtSource';

@index({ source: 1, ext_id: 1 }, { unique: true })
abstract class ExtEntity extends CommonModel {
    @prop({ required: true, ref: ExtSource })
    public source!: Ref<ExtSource>;

    @prop({ required: true, index: true })
    public ext_id!: string;

    @prop({ required: true, trim: true })
    public ext_full_url!: string;
}


export { ExtEntity };
