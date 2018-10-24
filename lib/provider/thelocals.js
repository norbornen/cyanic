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
axios.defaults.headers.common["content-type"] = "application/json";

module.exports = async () => {
    const db = await Db('avito');

    const urlGetIdx = 'https://thelocals.ru/api/frontend/rooms';
    const query = config.get('thelocals.query');


    const rawListRes = (await axios.post(urlGetIdx, query));
    const points = path(['data', 'ads'], rawListRes) || [];

    const offers = points.filter((x) => pathOr(0, ['rooms'], x) >= 2 
                                && db.data.indexOf(x.id) === -1
                                && geoFilter(x.address));

    console.log(`[thelocals] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        await queue.addAll(offers.map((x) => () => offerMessage(x)));
        db.data = db.data.concat(offers.map(({id}) => id));
        await db.save();
    }
};

async function offerMessage(offer) {
    let t = `
<a href="https://thelocals.ru${offer.path}">${offer.address}</a>
<b>${offer.rooms} комн., ${offer.price}₽</b>
${offer.title}
`;
    t = t.replace(/Россия, Москва, /, '').replace(/Москва, /, '');    
console.log(t);

    // await sendHtmlMessage(t);
}
