import { ExtSource, ExtSourceProvider } from '../../models/ExtSource';
import { AbstractExtFlatOfferProvider } from './abstract';
import { CianExtFlatOfferProvider } from './Cian';
import { AvitoExtFlatOfferProvider } from './Avito';
import { YandexExtFlatOfferProvider } from './Yandex';
import { LocalsExtFlatOfferProvider } from './TheLocals';

const extFlatOfferProviders: Partial<Record<keyof typeof ExtSourceProvider, typeof CianExtFlatOfferProvider | typeof AvitoExtFlatOfferProvider | typeof YandexExtFlatOfferProvider | typeof LocalsExtFlatOfferProvider>> = {
    cian: CianExtFlatOfferProvider,
    avito: AvitoExtFlatOfferProvider,
    yandex: YandexExtFlatOfferProvider,
    thelocals: LocalsExtFlatOfferProvider,
} as const;

function extFlatOfferProviderFactory(extSource: ExtSource): AbstractExtFlatOfferProvider {
    const provider_alias = extSource.provider;
    if (provider_alias in extFlatOfferProviders) {
        const ctor = extFlatOfferProviders[provider_alias]!;
        const provider = new ctor(extSource.connection);
        return provider;
    } else {
        throw new Error(`Not found extFlatOfferProvider by alias "${provider_alias}"`);
    }
}

export { extFlatOfferProviderFactory, extFlatOfferProviders };
