import PQueue from 'p-queue';
import pSettle from 'p-settle';
import { notificationChannelProviderFactory } from '../providers/notification';
import NotificationChannelModel from '../models/NotificationChannel';
import FlatOfferModel, { FlatOffer } from '../models/Offer';

export class NotificationUsecase {
    private readonly queue = new PQueue({ concurrency: 1 });

    public async sendNotifications(): Promise<any> {
        const [notificationChannels, flatOffers] = await Promise.all([
            NotificationChannelModel.find({ is_active: true }),
            FlatOfferModel.find({ is_notifications_send: { $ne: true }, is_active: true }, null, { sort: { updatedAt: 1 } })
        ]);
        if (notificationChannels && notificationChannels.length > 0) {
            for (const offer of flatOffers) {
                for (const channel of notificationChannels) {
                    try {
                        const provider = notificationChannelProviderFactory(channel);
                        await provider.send(offer);
                    } catch (err) {
                        console.log(err);
                    }
                    // queue.add(() => {};
                }
            }
        }
    }
}
