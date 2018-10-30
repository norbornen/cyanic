'use strict';

const config = require('config');
const { path } = require('ramda');
const Ax = require('../ax');
const Db = require('../db');
const { Offer } = require('./offer');
const geoFilter = require('../geo_filter');

const ax = Ax.create();

module.exports.getOffers = async () => {
    const db = await Db.create('cian');

    const urlGetIdx = 'https://api.cian.ru/search-offers/v2/search-offers-desktop/';
    const jsonQuery = config.get('cian.jsonQuery');

    const rawListRes = (await ax.post(urlGetIdx, {jsonQuery}));

    const points = path(['data', 'data', 'offersSerialized'], rawListRes) || [];
    const offers = points.filter((x) => x.roomsCount >= 2
                            && x.childrenAllowed !== false
                            && db.data.indexOf(x.cianId) === -1
                            && geoFilter(path(['geo', 'userInput'], x))
                        )
                        .map((x) => new CianOffer(x));

    console.log(`[cian] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        db.data = db.data.concat(offers.map(({cianId}) => cianId));
        await db.save();
    }

    return offers;
};

class CianOffer extends Offer {
    toHtml() {
        return `
<b>${this.geo.userInput}</b>
${this.roomsCount} комн., ${this.bargainTerms.price}₽
${this.fullUrl}`;
    }
}
