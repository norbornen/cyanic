#!/usr/bin/env node

const pSettle = require('p-settle');
const cian = require('./lib/provider/cian');
const yandex = require('./lib/provider/yandex');

run();

async function run() {
    return pSettle([
        Promise.all([Promise.resolve('cian'), cian()]),
        Promise.all([Promise.resolve('yandex'), yandex()])
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
