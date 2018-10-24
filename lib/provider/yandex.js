const config = require('config');
const axios = require('axios');
const Db = require('./db');
const { sendHtmlMessage } = require('./bot');

module.exports = async () => {
    const db = Db('yandex');
    return Promise.resolve(1);
};

// https://realty.yandex.ru/gate/map/offers-points-with-counter/?count=50&subLocality=193359&priceMax=52000&rgid=587795&type=RENT&category=APARTMENT&roomsTotal=2&roomsTotal=3&leftLongitude=37.313769&bottomLatitude=55.637843&rightLongitude=37.390329&topLatitude=55.651386
// https://realty.yandex.ru/gate/map/offers-gen2/?subLocality=193359&priceMax=52000&rgid=587795&type=RENT&category=APARTMENT&roomsTotal=2&roomsTotal=3&lat=55.645878&lon=37.336678&pageSize=100
