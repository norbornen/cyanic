import { Typegoose, prop, staticMethod } from 'typegoose';

export default abstract class CommonModel extends Typegoose {
    @prop()
    public createdAt: Date;

    @prop()
    public updatedAt: Date;

    @prop({ default: true })
    public is_active: boolean;

    @staticMethod
    public static getModelForClass() {
        return Object.create(this.prototype).getModelForClass(this, {schemaOptions: {timestamps: true}});
    }
}

export { CommonModel };
