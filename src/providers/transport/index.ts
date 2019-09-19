import { ExtSource, ExtSourceTransport } from '../../models/ExtSource';
import { AbstractTransportProvider } from './abstract';
import { CianTransportProvider } from './cian';
import { AvitoTransportProvider } from './avito';
import { RealtyYandexTransportProvider } from './realty_yandex';
import { LocalsTransportProvider } from './the_locals';

const transportProviders: Partial<Record<keyof typeof ExtSourceTransport, typeof CianTransportProvider | typeof AvitoTransportProvider | typeof RealtyYandexTransportProvider | typeof LocalsTransportProvider>> = {
    cian: CianTransportProvider,
    avito: AvitoTransportProvider,
    realty_yandex: RealtyYandexTransportProvider,
    thelocals: LocalsTransportProvider,
} as const;

function transportProviderFactory(extSource: ExtSource): AbstractTransportProvider {
    const transport_alias = extSource.transport;
    if (transport_alias in transportProviders) {
        const ctor = transportProviders[transport_alias]!;
        const provider = new ctor(extSource.connection);
        return provider;
    } else {
        throw new Error(`Not found transportProvider by alias "${transport_alias}"`);
    }
}

export { transportProviderFactory, transportProviders };
