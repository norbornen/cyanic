import { prop, arrayProp, Ref, index } from '@hasezoey/typegoose';
import { CommonModel, CommonModelDTO } from './CommonModel';
import { NotificationChannel } from './NotificationChannel';

interface ExtSourceConnection {
    [index: string]: any;
}

enum ExtSourceTransport {
    cian = 'cian',
    realty_yandex = 'realty_yandex',
    avito = 'avito',
    thelocals = 'thelocals'
}

@index({ is_active: 1 })
class ExtSource extends CommonModel {
    @prop({ required: true })
    public name!: string;

    @prop()
    public alias?: string;

    @prop({ enum: ExtSourceTransport, required: true })
    public transport!: ExtSourceTransport;

    @prop({ required: true })
    public connection!: ExtSourceConnection;

    @prop()
    public pipes_before?: string[];

    @prop({ required: true })
    public factory!: string;

    @prop({ required: false })
    public frequency?: string;

    @arrayProp({ itemsRef: NotificationChannel })
    public notification_channels?: Array<Ref<NotificationChannel>>;
}

type ExtSourceDTO = CommonModelDTO<ExtSource>;
const ExtSourceModel = ExtSource.getModelForClass<ExtSource>();
// const ExtSourceModel = new ExtSource().getModelForClass(ExtSource);

export default ExtSourceModel;
export { ExtSourceModel, ExtSource, ExtSourceDTO, ExtSourceTransport, ExtSourceConnection };
