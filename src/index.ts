import createConnection, { disconnect } from './connect';
import { ImportUsecase } from './usecases/ImportUsecase';

createConnection({db: 'mongodb://localhost/cyanic'})
.then(async () => {
    console.info(new Date().toString());

    const usecase = new ImportUsecase();
    await usecase.getAndUpdateExtOffers();

    await disconnect();
    process.exit(0);
})
.catch(async (err) => {
    console.error(err);
    await disconnect();
    process.exit(1);
});


// const pRetry = require('p-retry');
// const PQueue = require('p-queue');
// const { sendHtmlMessage } = require('./lib/bot');
// const queue = new PQueue({concurrency: 1});
// async function run() {
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
