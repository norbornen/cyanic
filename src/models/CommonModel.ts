import { Typegoose, GetModelForClassOptions, prop, staticMethod } from '@hasezoey/typegoose';


type CommonModelDTO<T> = Omit<T, 'createdAt' | 'updatedAt' | 'is_active' | 'getModelForClass' | 'setModelForClass' | 'buildSchema'> &
                            { createdAt?: Date, updatedAt?: Date, is_active?: boolean };

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
