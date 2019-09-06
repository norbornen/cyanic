import createConnection, { disconnect } from './connect';
import ExtSourceModel, { ExtSource } from './models/ExtSource';

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

    console.log(ExtSourceModel);
    console.log(ExtSource);

    const q = new ExtSource();
    q.alias = `${Math.random()} ${new Date().toString()}`;
    q.connection = {endpoint: 'a'};
    await ExtSourceModel.create(q);

    await ExtSourceModel.create({alias: 'aaaaaaaaaaaaaaaaa', connection: {}} as ExtSource);

    const zz = await ExtSourceModel.find();
    const z = zz.shift()!;

    z.alias += ` ${Math.random()}`;
    await z.save();

    // z.c

    console.log(zz);
    console.log(z);
}

// const pSettle = require('p-settle');
// const pRetry = require('p-retry');
// const PQueue = require('p-queue');
// const { sendHtmlMessage } = require('./lib/bot');
// const cian = require('./lib/provider/cian');
// const yandex = require('./lib/provider/yandex');
// const avito = require('./lib/provider/avito');
// const thelocals = require('./lib/provider/thelocals');

// const queue = new PQueue({concurrency: 1});

// console.info(new Date().toString());
// run().catch((err) => {
//     console.error('ROOT_CATCH');
//     console.error(err);
//     console.trace(err);
// });

// async function run() {
//     const result = await pSettle([
//         Promise.all([Promise.resolve('cian'), cian.getOffers()]),
//         Promise.all([Promise.resolve('yandex'), yandex.getOffers()]),
//         Promise.all([Promise.resolve('avito'), avito.getOffers()]),
//         Promise.all([Promise.resolve('thelocals'), thelocals.getOffers()])
//     ]);
//     const offers = result.reduce((acc, x) => {
//         if (x.isRejected === true) {
//             console.error(x.reason || 'FAIL WITHOUT REASON');
//         } else {
//             const [name, list] = x.value;
//             if (list && list.length > 0) {
//                 acc = acc.concat(list);
//             }
//             console.info(`OK: ${name}`);
//         }
//         return acc;
//     }, []);

//     offers.forEach((x, idx) => queue.add(() => {
//         const t = x.toHtml().replace(/(Россия|Москва),\s*/g, '');
//         return pRetry(() => sendHtmlMessage(t),
//                     {retries: 10, onFailedAttempt: (err) => console.warn(`idx: ${idx}, err: ${err.toString()}`)})
//                     .catch((err) => {
//                         console.log(err);
//                         console.log(t);
//                     });
//     }));
// }