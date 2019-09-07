import { Typegoose, prop, staticMethod } from 'typegoose';


type CommonModelDTO<T> = Omit<T, 'createdAt' | 'updatedAt' | 'is_active' | 'getModelForClass' | 'setModelForClass' | 'buildSchema'> &
                            { createdAt?: Date, updatedAt?: Date, is_active?: boolean };


export default class CommonModel extends Typegoose {
    @prop()
    public createdAt: Date;

    @prop()
    public updatedAt: Date;

    @prop({ default: true })
    public is_active: boolean;

    @staticMethod
    public static makeInstanse<T>(data?: CommonModelDTO<T>): T {
        const x = Object.create(this.prototype);
        if (data) {
            Object.entries(data).forEach(([k, v]) => x[k] = v);
        }
        return x;
    }

    @staticMethod
    public static getModelForClass<T extends CommonModel>() {
        return this.makeInstanse<T>().getModelForClass(this, {schemaOptions: {timestamps: true}});
    }
}

export { CommonModel, CommonModelDTO };
