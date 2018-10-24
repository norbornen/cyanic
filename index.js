#!/usr/bin/env node

const pSettle = require('p-settle');
const cian = require('./lib/provider/cian');
const yandex = require('./lib/provider/yandex');
const avito = require('./lib/provider/avito');
// const thelocals = require('./lib/provider/thelocals');

run();

async function run() {
    return pSettle([
        Promise.all([Promise.resolve('cian'), cian()]),
        Promise.all([Promise.resolve('yandex'), yandex()]),
        Promise.all([Promise.resolve('avito'), avito()]),
        // Promise.all([Promise.resolve('thelocals'), thelocals()]),
    ]).then((result) => {
        console.info(new Date().toString());
        result.forEach((x) => {
            if (x.isFulfilled) {
                console.log(`OK: ${x.value[0]}`);
            }
            if (x.isRejected) {
                console.log('FAIL');
                console.trace(x.reason);
            }
        });
    });
}
