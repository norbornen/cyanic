import pSettle from 'p-settle';
import { path, isNil, isEmpty, Dictionary } from 'ramda';
import { InstanceType } from '@typegoose/typegoose';
import ExtSourceModel, { ExtSource } from '../models/ExtSource';
import { ExtEntity } from '../models/ext_entity/ExtEntity';
import { transportProviderFactory } from '../providers/transport';
import { extEntityFactoryProvider } from '../factories';
import { pipesFactory } from '../pipes';

export class ImportUsecase {

    public async getExtEntitiesByExtSource(extSource: InstanceType<ExtSource>): Promise<Array<InstanceType<ExtEntity>>> {
        const provider = transportProviderFactory(extSource);

        const raw_entities: Array<Dictionary<any> | null> = await provider.getExtEntities();

        // apply pipes_before
        if ('pipes_before' in extSource && extSource.pipes_before) {
            for (const [idx, raw_entity] of raw_entities.entries()) {
                if (raw_entity) {
                    try {
                        const pipesResult = (await pSettle(
                                    extSource.pipes_before.map((pipe) => pipesFactory(pipe).then((p) => p.apply(raw_entity)))
                                )).reduce((acc, x) => {
                                    if (x.isFulfilled && !isNil(x.value) && !isEmpty(x.value)) {
                                        acc = acc && x.value;
                                    }
                                    if (x.isRejected) {
                                        console.error(x.reason);
                                    }
                                    return acc;
                                }, true);
                        if (pipesResult === false) {
                            raw_entities[idx] = null;
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }

        const extEntities: Array<InstanceType<ExtEntity>> = [];
        const factory = await extEntityFactoryProvider(extSource);
        for (const raw_entity of raw_entities) {
            if (!(isNil(raw_entity) || isEmpty(raw_entity))) {
                try {
                    const entity = await factory.makeInstanse(raw_entity!);
                    entity.source = extSource._id;
                    extEntities.push(entity);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        console.log(`[${extSource.name}]    entities: ${extEntities.length}`);
        return extEntities;
    }

    public async getExtEntities(): Promise<Array<InstanceType<ExtEntity>>> {
        const extSources = await ExtSourceModel.find({ is_active: true });

        const importResults = await pSettle(
            extSources.map((extSource) => this.getExtEntitiesByExtSource(extSource))
        );

        const extEntities = importResults
            .reduce((acc, x) => {
                if (x.isRejected) {
                    console.error(x.reason);
                }
                if (x.isFulfilled && x.value && Array.isArray(x.value) && x.value.length > 0) {
                    acc = acc.concat(x.value);
                }
                return acc;
            }, [] as Array<InstanceType<ExtEntity>>)
            .filter((entity) => !(isNil(entity) || isEmpty(entity)));

        return extEntities;
    }

    public async updateExtEntities(extEntities: Array<InstanceType<ExtEntity>>): Promise<Array<InstanceType<ExtEntity>>> {
        const entities = [];
        for (const entity of extEntities) {
            try {
                const item = await entity.upsert();
                entities.push(item);
            } catch (err) {
                console.error(err);
            }
        }
        return entities;
    }

    public async getAndUpdateExtEntities(): Promise<Array<InstanceType<ExtEntity>>> {
        const extEntities = await this.getExtEntities();
        return this.updateExtEntities(extEntities);
    }

}
