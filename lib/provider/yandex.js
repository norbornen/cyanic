const config = require('config');
const PQueue = require('p-queue');
const { path, isNil } = require('ramda');
const Db = require('../db');
const geoFilter = require('../geo_filter');
const { sendHtmlMessage } = require('../bot');

const queue = new PQueue({concurrency: 1});
const axios = require('axios').create();
axios.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Windows NT 5.1; rv:44.0) Gecko/20100101 Firefox/44.0";
axios.defaults.headers.common["accept"] = "application/json, text/plain, */*";

module.exports = async () => {
    const db = await Db('yandex');
    return Promise.resolve(1);
};

/*
https://realty.yandex.ru/gate/map/offers-points-with-counter/?count=50&subLocality=193359&priceMax=52000&rgid=587795&type=RENT&category=APARTMENT&roomsTotal=2&roomsTotal=3&leftLongitude=37.313769&bottomLatitude=55.637843&rightLongitude=37.390329&topLatitude=55.651386
https://realty.yandex.ru/gate/map/offers-gen2/?subLocality=193359&priceMax=52000&rgid=587795&type=RENT&category=APARTMENT&roomsTotal=2&roomsTotal=3&lat=55.645878&lon=37.336678&pageSize=100

1)
subLocality=193359&priceMax=52000&rgid=587795&type=RENT&category=APARTMENT&roomsTotal=2&roomsTotal=3
&count=50&leftLongitude=37.313769&bottomLatitude=55.637843&rightLongitude=37.390329&topLatitude=55.651386

2)
subLocality=193359&priceMax=52000&rgid=587795&type=RENT&category=APARTMENT&roomsTotal=2&roomsTotal=3
&lat=55.645878&lon=37.336678&pageSize=100

*/
