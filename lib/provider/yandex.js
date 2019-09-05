const config = require('config');
const { path } = require('ramda');
const Ax = require('../ax');
const Db = require('../db');
const { Offer } = require('./offer');
const geoFilter = require('../geo_filter');

const ax = Ax.create({'content-type': 'application/json'});

module.exports.getOffers = async () => {
    const db = await Db.create('yandex');

    const urlGetIdx = 'https://realty.yandex.ru/gate/react-page/get/';
    const query = config.get('yandex.query');

    const rawListRes = await ax.get(urlGetIdx, {params: query});

    const points = path(['data', 'response', 'search', 'offers', 'entities'], rawListRes) || [];
    const offers = points.filter((x) => x.roomsTotal >= 2 &&
                            ! db.find(x.offerId) &&
                            geoFilter(path(['location', 'geocoderAddress'], x))
                        )
                        .map((x) => new YandexOffer(x));

    console.log(`[yandex] idx: ${points.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        await db.concat(offers.map(({offerId}) => offerId));
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
