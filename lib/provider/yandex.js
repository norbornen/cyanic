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

    const urlGetIdx = 'https://realty.yandex.ru/gate/map/offers-points-with-counter/';
    const urlGetItems = 'https://realty.yandex.ru/gate/map/offers-gen2/';
    const query = config.get('yandex.query');
    const listQuery = config.get('yandex.listQuery');

    const rawListRes = (await axios.get(urlGetIdx, {params: Object.assign({}, query, listQuery)}));
    let points = path(['data', 'response', 'points'], rawListRes) || [];
    points = points.filter(({id}) => db.data.indexOf(id) === -1);

    let offers = await queue.addAll(points.map((x) => () => {
        const lat = x.lat; const lon = x.lon; const pageSize = 100;
        return axios.get(urlGetItems, {params: Object.assign({lat, lon, pageSize}, query)});
    }));
    offers = offers.map((x) => path(['data', 'response', 'items', 'entities'], x) || []);
    offers = [].concat(...offers);
    offers = offers.filter((x) => x.roomsTotal >= 2 
                                    && db.data.indexOf(x.offerId) === -1
                                    && geoFilter(path(['location', 'geocoderAddress'], x)));

    console.log(`[yandex] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        await queue.addAll(offers.map((x) => () => offerMessage(x)));
        db.data = db.data.concat(offers.map(({offerId}) => offerId));
        await db.save();
    }
};

async function offerMessage(offer) {
    let t = `
<a href="https://${offer.unsignedInternalUrl}">${offer.location.geocoderAddress}</a>
<b>${offer.roomsTotal} комн., ${offer.price.value}₽</b>
`;
    t = t.replace(/Россия, Москва, /, '');    
    await sendHtmlMessage(t);
}
