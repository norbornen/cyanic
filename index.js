#!/usr/bin/env node
'use strict';

const pSettle = require('p-settle');
const pRetry = require('p-retry');
const PQueue = require('p-queue');
const { sendHtmlMessage } = require('./lib/bot');
const cian = require('./lib/provider/cian');
const yandex = require('./lib/provider/yandex');
const avito = require('./lib/provider/avito');
const thelocals = require('./lib/provider/thelocals');

const queue = new PQueue({concurrency: 1});

console.info(new Date().toString());
run().catch((err) => {
    console.error('ROOT_CATCH');
    console.error(err);
    console.trace(err);
});

async function run() {
    const result = await pSettle([
        Promise.all([Promise.resolve('cian'), cian.getOffers()]),
        Promise.all([Promise.resolve('yandex'), yandex.getOffers()]),
        Promise.all([Promise.resolve('avito'), avito.getOffers()]),
        Promise.all([Promise.resolve('thelocals'), thelocals.getOffers()])
    ]);
    const offers = result.reduce((acc, x) => {
        if (x.isRejected === true) {
            console.error(x.reason || 'FAIL WITHOUT REASON');
        } else {
            const [name, list] = x.value;
            if (list && list.length > 0) {
                acc = acc.concat(list);
            }
            console.info(`OK: ${name}`);
        }
        return acc;
    }, []);

    offers.forEach((x, idx) => queue.add(() => {
        const t = x.toHtml().replace(/(Россия|Москва),\s*/g, '');
        return pRetry(() => sendHtmlMessage(t),
                    {retries: 10, onFailedAttempt: (err) => console.warn(`idx: ${idx}, err: ${err.toString()}`)})
                    .catch((err) => {
                        console.log(err);
                        console.log(t);
                    });
    }));
}
