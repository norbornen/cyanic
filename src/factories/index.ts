import { Dictionary } from 'ramda';
import { ExtSource } from '../models/ExtSource';
import { AbstractExtEntityFactory } from './abstract';

const factories = new Map<string, typeof AbstractExtEntityFactory>();

async function extEntityFactoryProvider(extSource: ExtSource): Promise<AbstractExtEntityFactory> {
    let ctor: typeof AbstractExtEntityFactory;
    const factory_alias = extSource.factory;

    if (factories.has(factory_alias)) {
        ctor = factories.get(factory_alias)!;
    } else {
        const factory_path = `./${factory_alias}`;
        const module: { default: typeof AbstractExtEntityFactory } = await import(factory_path);
        factories.set(factory_alias, ctor = module.default);
    }
    return new ctor();
}

export { extEntityFactoryProvider };
