import { prop, arrayProp, Ref, index, getModelForClass } from '@typegoose/typegoose';
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
@index({ alias: 1 })
class ExtSource extends CommonModel {
    // название для показа
    @prop({ required: true, trim: true })
    public name!: string;

    // название для программного использования
    @prop({ trim: true })
    public alias?: string;

    // транспорт
    @prop({ enum: ExtSourceTransport, type: String, required: true })
    public transport!: ExtSourceTransport;

    // параметры соединения и запросов
    @prop({ required: true })
    public connection!: ExtSourceConnection;

    // фильтры сырых данных
    @prop()
    public pipes_before?: string[];

    // фабрика объектов (наследников ExtEntity)
    @prop({ required: true })
    public factory!: string;

    // частота запроса обновлений
    @prop({ required: false })
    public frequency?: string;

    // каналы по которым нужно высылать уведомления о новых записях
    @arrayProp({ itemsRef: NotificationChannel })
    public notification_channels?: Ref<NotificationChannel>[];
}

type ExtSourceDTO = CommonModelDTO<ExtSource>;
const ExtSourceModel = getModelForClass(ExtSource);

export default ExtSourceModel;
export { ExtSourceModel, ExtSource, ExtSourceDTO, ExtSourceTransport, ExtSourceConnection };
