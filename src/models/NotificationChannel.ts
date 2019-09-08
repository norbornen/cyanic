import { Dictionary } from 'ramda';
import { prop } from 'typegoose';
import { CommonModel, CommonModelDTO } from './CommonModel';


enum NotificationChannelProvider {
    telegram = 'telegram'
}

class NotificationChannel extends CommonModel {
    @prop({ required: true })
    public name!: string;

    @prop({ enum: NotificationChannelProvider, required: true })
    public provider!: NotificationChannelProvider;

    @prop({ required: true })
    public connection!: Dictionary<any>;
}

type NotificationChannelDTO = CommonModelDTO<NotificationChannel>;

const NotificationChannelModel = NotificationChannel.getModelForClass<NotificationChannel>();


export default NotificationChannelModel;
export { NotificationChannelModel, NotificationChannel, NotificationChannelDTO, NotificationChannelProvider };
