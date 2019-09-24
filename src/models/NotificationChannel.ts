import { Dictionary } from 'ramda';
import { prop } from '@hasezoey/typegoose';
import { CommonModel, CommonModelDTO } from './CommonModel';


enum NotificationChannelProvider {
    telegram = 'telegram'
}

interface NotificationChannelConnectionDummy {
    dummy: never;
}

interface NotificationChannelConnectionTelegram {
    chatId: string;
    token: string;
    proxy?: string;
}

class NotificationChannel extends CommonModel {
    // название для показа
    @prop()
    public name?: string;

    // провайдер
    @prop({ enum: NotificationChannelProvider, required: true })
    public provider!: NotificationChannelProvider;

    // настройки соединения
    @prop({ required: true })
    public connection!: NotificationChannelConnectionDummy | NotificationChannelConnectionTelegram;

    // шаблон сообщения
    @prop()
    public template?: Dictionary<any>;
}

type NotificationChannelDTO = CommonModelDTO<NotificationChannel>;
const NotificationChannelModel = NotificationChannel.getModelForClass<NotificationChannel>();


export default NotificationChannelModel;
export {
    NotificationChannelModel,
    NotificationChannel,
    NotificationChannelDTO,
    NotificationChannelProvider,
    NotificationChannelConnectionTelegram
};
