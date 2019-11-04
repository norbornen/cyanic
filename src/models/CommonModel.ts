import { Typegoose, prop, staticMethod, pre, GetModelForClassOptions, InstanceType } from '@typegoose/typegoose';


type CommonModelDTO<T> = Omit<T, 'createdAt' | 'updatedAt' | 'is_active' | 'getModelForClass' | 'setModelForClass' | 'buildSchema'> &
                            { createdAt?: Date, updatedAt?: Date, is_active?: boolean };


@pre<CommonModel>('save', function(next) {
    try {
        (this as InstanceType<CommonModel>).increment();
    } catch (err) {
        console.error('CommonModel::preSave ', err);
    }
    return next();
})
export default abstract class CommonModel extends Typegoose {
    @prop()
    public createdAt!: Date;

    @prop()
    public updatedAt!: Date;

    @prop({ default: true })
    public is_active!: boolean;

    @staticMethod
    public static getModelForClass<T extends CommonModel>(schemaOptions?: GetModelForClassOptions['schemaOptions']) {
        const x = Reflect.construct(this, []) as T;
        schemaOptions = Object.assign({timestamps: true}, schemaOptions || {});
        return x.getModelForClass(this, { schemaOptions });
    }
}

export { CommonModel, CommonModelDTO };
