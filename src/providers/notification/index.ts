import { NotificationChannel, NotificationChannelProvider } from '../../models/NotificationChannel';
import { AbstractNotifcationProvider } from './abstract';
import { TelegramNotifcationProvider } from './Telegram';


const notificationChannelProviders: Partial<Record<keyof typeof NotificationChannelProvider, typeof TelegramNotifcationProvider>> = {
    telegram: TelegramNotifcationProvider
} as const;

function notificationChannelProviderFactory(nc: NotificationChannel): AbstractNotifcationProvider {
    const provider_alias = nc.provider;
    if (provider_alias in notificationChannelProviders) {
        const ctor = notificationChannelProviders[provider_alias]!;
        const provider = new ctor(nc.connection, nc.template);
        return provider;
    } else {
        throw new Error(`Not found notificationChannelProvider by alias "${provider_alias}"`);
    }
}

export { notificationChannelProviderFactory, notificationChannelProviders };
