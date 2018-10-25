const config = require('config');
const PQueue = require('p-queue');
const { path } = require('ramda');
const Ax = require('../ax');
const Db = require('../db');
const { Offer } = require('./offer');
const geoFilter = require('../geo_filter');

const queue = new PQueue({concurrency: 1});
const ax = Ax.create({'content-type': 'application/json'});

module.exports.getOffers = async () => {
    const db = await Db.create('yandex');

    const urlGetIdx = 'https://realty.yandex.ru/gate/map/offers-points-with-counter/';
    const urlGetItems = 'https://realty.yandex.ru/gate/map/offers-gen2/';
    const query = config.get('yandex.query');
    const listQuery = config.get('yandex.listQuery');

    const rawListRes = (await ax.get(urlGetIdx, {params: Object.assign({}, query, listQuery)}));
    let points = path(['data', 'response', 'points'], rawListRes) || [];
    points = points.filter(({id}) => db.data.indexOf(id) === -1);

    let offers = await queue.addAll(points.map((x) => () => {
        const lat = x.lat; const lon = x.lon; const pageSize = 100;
        return ax.get(urlGetItems, {params: Object.assign({lat, lon, pageSize}, query)});
    }));
    offers = offers.map((x) => path(['data', 'response', 'items', 'entities'], x) || []);
    offers = [].concat(...offers);
    offers = offers.filter((x) => x.roomsTotal >= 2 
                                    && db.data.indexOf(x.offerId) === -1
                                    && geoFilter(path(['location', 'geocoderAddress'], x))
                )
                .map((x) => new YandexOffer(x));

    console.log(`[yandex] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        db.data = db.data.concat(offers.map(({offerId}) => offerId));
        await db.save();
    }

    return offers;
};

class YandexOffer extends Offer {
    toHtml() {
        return `
<b>${this.location.geocoderAddress}</b>
${this.roomsTotal} комн., ${this.price.value}₽
https:${this.unsignedInternalUrl}`;
    }
}
