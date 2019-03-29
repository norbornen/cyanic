const config = require('config');
const { path, pathOr } = require('ramda');
const Ax = require('../ax');
const Db = require('../db');
const { Offer } = require('./offer');
const geoFilter = require('../geo_filter');

const ax = Ax.create({'content-type': 'application/json'});

module.exports.getOffers = async () => {
    const db = await Db.create('thelocals');

    const urlGetIdx = 'https://thelocals.ru/api/frontend/rooms';
    const query = config.get('thelocals.query');

    const rawListRes = (await ax.post(urlGetIdx, query));
    const points = path(['data', 'ads'], rawListRes) || [];

    const offers = points.filter((x) => pathOr(0, ['rooms'], x) >= 2
                                && ! db.find(x.id)
                                && geoFilter(x.address)
                    )
                    .map((x) => new ThelocalsOffer(x));

    console.log(`[thelocals] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        await db.concat(offers.map(({id}) => id));
    }
    return offers;
};

class ThelocalsOffer extends Offer {
    toHtml() {
        return `
<b>${this.address}</b>
${this.rooms} комн., ${this.price}₽
https://thelocals.ru${this.path}`;
    }
}
