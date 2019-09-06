import { Typegoose, prop, staticMethod, InstanceType, ModelType } from 'typegoose';
import mongoose, { Document } from 'mongoose';

export default abstract class CommonModel extends Typegoose {
    @prop()
    public createdAt: Date;

    @prop()
    public updatedAt: Date;

    @prop({ default: true })
    public is_active: boolean;

    // @staticMethod
    // public static getModelForClass<T>(t: T): mongoose.Model<ModelType<T & Document>, {}> & T {
    //     // mongoose.Model<InstanceType<this>, {}> & this & T;
    //     // Model<InstanceType<ExtSource>, {}> & ExtSource & typeof ExtSource
    //     // const z: mongoose.Model<InstanceType<this>, {}> & this & T
    //     return Object.create(this.prototype).getModelForClass(this, {schemaOptions: {timestamps: true}});
    // }
}

export { CommonModel };
