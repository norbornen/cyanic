import { ExtSource, ExtSourceProvider } from '../../models/ExtSource';
import { AbstractExtOfferProvider } from './abstract';
import { CianExtOfferProvider } from './Cian';
import { AvitoExtOfferProvider } from './Avito';
import { YandexExtOfferProvider } from './Yandex';
import { LocalsExtOfferProvider } from './TheLocals';

const extOfferProviders: Partial<Record<keyof typeof ExtSourceProvider, typeof CianExtOfferProvider | typeof AvitoExtOfferProvider | typeof YandexExtOfferProvider | typeof LocalsExtOfferProvider>> = {
    cian: CianExtOfferProvider,
    avito: AvitoExtOfferProvider,
    yandex: YandexExtOfferProvider,
    thelocals: LocalsExtOfferProvider,
} as const;

function extOfferProviderFactory(extSource: ExtSource): AbstractExtOfferProvider {
    const provider_alias = extSource.provider;
    if (provider_alias in extOfferProviders) {
        const ctor = extOfferProviders[provider_alias]!;
        const provider = new ctor(extSource.connection);
        return provider;
    } else {
        throw new Error(`Not found extOfferProvider by alias "${provider_alias}"`);
    }
}

export { extOfferProviderFactory, extOfferProviders };
