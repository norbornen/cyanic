import { prop, pre, modelOptions, DocumentType } from '@typegoose/typegoose';

type CommonModelDTO<T> = Omit<T, 'createdAt' | 'updatedAt' | 'is_active' | 'getModelForClass' | 'setModelForClass' | 'buildSchema'> &
                            { createdAt?: Date, updatedAt?: Date, is_active?: boolean };


@pre<CommonModel>('save', function(next) {
    try {
        (this as DocumentType<CommonModel>).increment();
    } catch (err) {
        console.error('CommonModel::preSave ', err);
    }
    return next();
})
@pre<CommonModel>(/^[uU]pdate/, async function() {
    this.update({}, { $inc: { __v: 1 } });
})
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

    // @staticMethod
    // // public static getModelForClass<T extends CommonModel>(schemaOptions?: GetModelForClassOptions['schemaOptions']) {
    // public static getModelForClass<T extends CommonModel>(schemaOptions?: IModelOptions) {
    //     const x = Reflect.construct(this, []) as T;
    //     schemaOptions = Object.assign({timestamps: true}, schemaOptions || {});
    //     return x.getModelForClass(this, { schemaOptions });
    // }
}

export { CommonModel, CommonModelDTO };
