// tslint:disable:prefer-const
import createConnection, { disconnect } from '../src/mongooseConnect';
import { InstanceType } from '@typegoose/typegoose';
import { ExtSourceModel, ExtSource, ExtSourceTransport } from '../src/models/ExtSource';

createConnection({db: 'mongodb://localhost/cyanic'})
.then(async () => {
    await run();
    await disconnect();
    process.exit(0);
})
.catch(async (err) => {
    console.error(err);
    await disconnect();
    process.exit(1);
});

async function run() {
    const extSources = await ExtSourceModel.find();

    for (const extSource of extSources) {
        switch (extSource.transport) {
            case ExtSourceTransport.cian:
                extSource.alias = 'cian_flat_offer_np';
                break;
            case ExtSourceTransport.realty_yandex:
                extSource.alias = 'yandex_flat_offer_np_realty';
                break;
            case ExtSourceTransport.avito:
                extSource.alias = 'avito_flat_offer_np';
                break;
            case ExtSourceTransport.thelocals:
                extSource.alias = 'thelocals_flat_offer_np';
                break;
            default:
                throw new Error('UNKNOWN_TRANSPORT');
        }
        await extSource.save();
    }

    console.log(extSources.length);
}
