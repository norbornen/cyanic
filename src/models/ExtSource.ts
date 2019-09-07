import { prop } from 'typegoose';
import { CommonModel, CommonModelDTO } from './CommonModel';

interface ExtSourceConnection {
    endpoint: string;
    [index: string]: any;
}

enum ExtSourceProvider {
    cian = 'cian',
    yandex = 'yandex',
    avito = 'avito',
    thelocals = 'thelocals'
}

class ExtSource extends CommonModel {
    @prop({ required: true })
    public name: string;

    @prop({ enum: ExtSourceProvider, required: true })
    public provider: ExtSourceProvider;

    @prop({ required: true })
    public connection: ExtSourceConnection;
}

type ExtSourceDTO = CommonModelDTO<ExtSource>;

const ExtSourceModel = ExtSource.getModelForClass<ExtSource>();

export default ExtSourceModel;
export { ExtSourceModel, ExtSource, ExtSourceDTO, ExtSourceProvider };
