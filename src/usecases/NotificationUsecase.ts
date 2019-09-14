import pSettle from 'p-settle';
import { pathOr } from 'ramda';
import { notificationChannelProviderFactory } from '../providers/notification';
import { NotificationChannel } from '../models/NotificationChannel';
import OfferModel from '../models/ext_entity/offer/Offer';

export class NotificationUsecase {

    public async sendNotifications(): Promise<any> {

        const offers = await OfferModel.find({
            is_notifications_send: { $ne: true },
            is_active: true
        })
        .sort({ updatedAt: 1 })
        .populate({
            path: 'source',
            select: '_id',
            populate: {
                path: 'notification_channels',
                match: { is_active: true }
            }
        });


        for (const offer of offers) {
            const notificationChannels = pathOr<NotificationChannel[]>([], ['source', 'notification_channels'], offer);
            const notificationResults = await pSettle(
                notificationChannels.map((nc): Promise<boolean> => {
                    const provider = notificationChannelProviderFactory(nc);
                    return provider.send(offer.toObject());
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

        console.info('[notify] qty=' + offers.filter(({is_notifications_send}) => is_notifications_send === true).length);
    }

}
