import { isNil } from 'ramda';
import { prop, Ref, DocumentType, getModelForClass, getClassForDocument } from '@typegoose/typegoose';
import { Model } from 'mongoose';
import { CommonModel, CommonModelDTO } from '../CommonModel';
import { ExtSource } from '../ExtSource';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

abstract class ExtEntity extends CommonModel {
    // внешний источник
    @prop({ required: true, ref: ExtSource })
    public source!: Ref<ExtSource>;

    // идентификатор во внешнем источнике
    @prop({ required: true, index: true })
    public ext_id!: string;

    // адрес web-страницы на сайте внешнего источника
    @prop({ required: true, trim: true })
    public ext_full_url!: string;

    // хранилище необработанных данных полученных из внешнего источника
    @prop({ select: false })
    public ext_data?: object;

    // дата последнего обновления записи во внешнем источнике
    @prop()
    public ext_updated_at?: Date;

    // были ли разосланы уведомления
    @prop({ default: false })
    public is_notifications_send?: boolean;

    public async upsert(): Promise<this> {
        const is_instanceof_model = this instanceof Model;
        const ctor = getClassForDocument(this as DocumentType<this>)! as AnyParamConstructor<this>;
        const model = getModelForClass(ctor);

        const data = (this as DocumentType<this>).toObject();
        ['_id', '__v', 'is_notifications_send', 'is_active'].forEach((key) => delete data[key]);


        const item = await model.findOneAndUpdate(
            { ext_id: data.ext_id, source: data.source },
            data,
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        );
        if (!('ext_updated_at' in item) || isNil(item.ext_updated_at)) {
            item.ext_updated_at = new Date();
            await item.save();
        }
        Object.assign(this, item);

        return this;
    }

}

type ExtEntityDTO<T extends ExtEntity> = Omit<CommonModelDTO<T>, 'source' | 'upsert'> & { source?: string };

export { ExtEntity, ExtEntityDTO };
