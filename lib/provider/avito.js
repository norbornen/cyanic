const config = require('config');
const PQueue = require('p-queue');
const { path, pathOr, isNil } = require('ramda');
const Db = require('../db');
const geoFilter = require('../geo_filter');
const { sendHtmlMessage } = require('../bot');

const queue = new PQueue({concurrency: 1});
const axios = require('axios').create();
axios.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Windows NT 5.1; rv:44.0) Gecko/20100101 Firefox/44.0";
axios.defaults.headers.common["accept"] = "application/json, text/plain, */*";

module.exports = async () => {
    const db = await Db('avito');

    const urlGetIdx = 'https://www.avito.ru/js/catalog/coords';
    const urlGetItems = 'https://www.avito.ru/js/catalog/items';
    const query = config.get('avito.query');


    const rawListRes = (await axios.get(urlGetIdx, {params: query}));
    let points = path(['data', 'coords'], rawListRes) || {};
    points = Object.entries(points).map(([k, v]) => Object.assign({id: k, lng: v.lon}, v))
                .filter(({id}) => db.data.indexOf(id) === -1);
    
    let offers = await queue.addAll(points.map((x) => () => {
        return axios.get(urlGetItems, {params: x});
    }));
    offers = offers.map((x) => path(['data', 'items'], x) || []);
    offers = Object.assign({}, ...offers);
    offers = Object.entries(offers).map(([k, v]) => Object.assign({id: k}, v))
                .filter((x) => pathOr(0, ['ext', 'rooms'], x) >= 2 
                                && db.data.indexOf(x.id) === -1
                                && geoFilter(path(['ext', 'address'], x))
                );

    console.log(`[avito] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        await queue.addAll(offers.map((x) => () => offerMessage(x)));
        db.data = db.data.concat(offers.map(({id}) => id));
        await db.save();
    }
};

async function offerMessage(offer) {
    let t = `
<a href="https://www.avito.ru${offer.url}">${offer.ext.address}</a>
<b>${offer.ext.rooms} комн., ${offer.price}₽</b>
${offer.title}
`;
    t = t.replace(/Россия, Москва, /, '').replace(/Москва, /, '');    
    await sendHtmlMessage(t);
}
