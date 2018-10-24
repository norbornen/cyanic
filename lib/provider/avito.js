const config = require('config');
const { path, pathOr } = require('ramda');
const PQueue = require('p-queue');
const Ax = require('../ax');
const Db = require('../db');
const { Offer } = require('./offer');
const geoFilter = require('../geo_filter');

const ax = Ax.create();
const queue = new PQueue({concurrency: 1});

module.exports = async () => {
    const db = await Db.create('avito');

    const urlGetIdx = 'https://www.avito.ru/js/catalog/coords';
    const urlGetItems = 'https://www.avito.ru/js/catalog/items';
    const query = config.get('avito.query');

    const rawListRes = (await ax.get(urlGetIdx, {params: query}));
    let points = path(['data', 'coords'], rawListRes) || {};
    points = Object.entries(points).map(([k, v]) => Object.assign({id: k, lng: v.lon}, v))
                .filter(({id}) => db.data.indexOf(id) === -1);
    
    let offers = await queue.addAll(points.map((x) => () => {
        return ax.get(urlGetItems, {params: x});
    }));
    offers = offers.map((x) => path(['data', 'items'], x) || []);
    offers = Object.assign({}, ...offers);
    offers = Object.entries(offers).map(([k, v]) => Object.assign({id: k}, v))
                .filter((x) => pathOr(0, ['ext', 'rooms'], x) >= 2 
                                && db.data.indexOf(x.id) === -1
                                && geoFilter(path(['ext', 'address'], x))
                )
                .map((x) => new AvitoOffer(x));

    console.log(`[avito] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        db.data = db.data.concat(offers.map(({id}) => id));
        await db.save();
    }

    return offers;
};

class AvitoOffer extends Offer {
    toHtml() {
        return `
<i>avito</i>
<a href="https://www.avito.ru${this.url}">${this.ext.address}</a>
<b>${this.ext.rooms} комн., ${this.price}₽</b>`;
    }
}
