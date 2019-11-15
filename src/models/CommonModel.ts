import { prop, pre, modelOptions, DocumentType,  } from '@typegoose/typegoose';
import { Query } from 'mongoose';

type CommonModelDTO<T> = Omit<T, 'createdAt' | 'updatedAt' | 'is_active' | 'getModelForClass' | 'setModelForClass' | 'buildSchema'> &
                            { createdAt?: Date, updatedAt?: Date, is_active?: boolean };


@pre<DocumentType<CommonModel>>('save', function(next) {
    try {
        this.increment();
    } catch (err) {
        console.error('CommonModel::preSave ', err);
    }
    return next();
})
// @pre<Query<DocumentType<CommonModel>>>(/[uU]pdate/, async function() {
// })
@modelOptions({
    schemaOptions: { timestamps: true }
})
export default abstract class CommonModel {
    @prop()
    public createdAt!: Date;

    @prop()
    public updatedAt!: Date;

    @prop({ default: true })
    public is_active!: boolean;
}

export { CommonModel, CommonModelDTO };
