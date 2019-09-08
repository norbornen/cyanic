import pSettle from 'p-settle';
import NotificationChannelModel from '../models/NotificationChannel';
// import { notificationProviderFactory } from '../providers/notification';
import FlatOfferModel, { FlatOffer } from '../models/Offer';


export class NotificationUsecase {
    public async sendNotifications(): Promise<any> {
        // взять офферы и если они есть
        // взять активные конфиги
        // const offers = await FlatOfferModel.find({ is_notifications_send: { $ne: true }, is_active: true }, null, { sort: { updatedAt: 1 } });
    }
}
