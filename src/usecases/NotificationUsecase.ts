import pSettle from 'p-settle';
import { notificationChannelProviderFactory } from '../providers/notification';
import NotificationChannelModel from '../models/NotificationChannel';
import FlatOfferModel from '../models/Offer';

export class NotificationUsecase {

    public async sendNotifications(): Promise<any> {
        const [notificationChannels, flatOffers] = await Promise.all([
            NotificationChannelModel.find({ is_active: true }),
            FlatOfferModel.find({ is_notifications_send: { $ne: true }, is_active: true }, null, { sort: { updatedAt: 1 } })
        ]);
        if (notificationChannels && notificationChannels.length > 0) {
            for (const offer of flatOffers) {
                const notificationResults = await pSettle(
                    notificationChannels.map((nc) => {
                        const provider = notificationChannelProviderFactory(nc);
                        return provider.send(offer);
                    })
                );
                const hasFail = notificationResults.reduce((acc, x) => {
                    let ok = false;
                    if (x.isFulfilled) {
                        ok = x.value;
                    }
                    if (x.isRejected && 'reason' in x && x.reason) {
                        console.error(x.reason);
                    }
                    acc.push(ok || false);
                    return acc;
                }, [] as boolean[])
                .some((x) => x === false);

                if (!hasFail) {
                    offer.is_notifications_send = true;
                    await offer.save();
                }
            }
        }

        console.info('[notify] qty=' + flatOffers.filter(({is_notifications_send}) => is_notifications_send === true).length);
    }

}
