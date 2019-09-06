import { prop } from 'typegoose';
import { CommonModel } from './CommonModel';

interface ExtSourceConnection {
    endpoint: string;
    [index: string]: any;
}

class ExtSource extends CommonModel {
    @prop({ required: true })
    public alias: string;

    @prop({ required: true })
    public connection: ExtSourceConnection;
}

const ExtSourceModel = new ExtSource().getModelForClass(ExtSource);

export default ExtSourceModel;
export { ExtSource, ExtSourceModel };
