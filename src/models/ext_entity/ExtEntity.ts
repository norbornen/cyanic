import { prop, Ref, index } from '@hasezoey/typegoose';
import { CommonModel, CommonModelDTO } from '../CommonModel';
import { ExtSource } from '../ExtSource';

// @index({ source: 1, ext_id: 1 }, { unique: true })
abstract class ExtEntity extends CommonModel {
    @prop({ required: true, ref: ExtSource })
    public source!: Ref<ExtSource>;

    @prop({ required: true, index: true })
    public ext_id!: string;

    @prop({ required: true, trim: true })
    public ext_full_url!: string;

    @prop({ select: false })
    public ext_data?: object;

    @prop({ default: false })
    public is_notifications_send?: boolean;
}

type ExtEntityDTO<T extends ExtEntity> = Omit<CommonModelDTO<T>, 'source'> & { source?: string };

export { ExtEntity, ExtEntityDTO };
