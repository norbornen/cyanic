const config = require('config');
const { path } = require('ramda');
const Ax = require('../ax');
const Db = require('../db');
const { Offer } = require('./offer');
const geoFilter = require('../geo_filter');

const ax = Ax.create();

module.exports = async () => {
    const db = await Db.create('cian');

    const urlGetIdx = 'https://api.cian.ru/search-offers/v1/get-infinite-search-result-desktop/';
    const urlGetItems = 'https://api.cian.ru/search-offers/v1/get-offers-by-ids-desktop/';
    const jsonQuery = config.get('cian.jsonQuery');
    const queryString = config.get('cian.queryString');

    const rawIdx = [].concat(
            ...(await Promise.all([
                        ax.post(urlGetIdx, {jsonQuery, queryString}),
                        ax.post(urlGetIdx, Object.assign({pageNumber: 2}, {jsonQuery, queryString}))
            ]))
            .map(({data}) => data.infiniteSearchResult || [])
    );
    const cianOfferIds = rawIdx.map(({itemId}) => itemId);

    let offers = (await ax.post(urlGetItems, {cianOfferIds, jsonQuery})).data.offersSerialized || [];
    offers = offers.filter((x) => x.roomsCount >= 2 
                                    && x.childrenAllowed !== false
                                    && db.data.indexOf(x.cianId) === -1
                                    && geoFilter(path(['geo', 'userInput'], x))
                )
                .map((x) => new CianOffer(x));

    console.log(`[cian] idx: ${cianOfferIds.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        db.data = db.data.concat(offers.map(({cianId}) => cianId));
        await db.save();
    }

    return offers;
};

class CianOffer extends Offer {
    toHtml() {
        return `
<i>cian</i>
<a href="${this.fullUrl}">${this.geo.userInput}</a>
<b>${this.roomsCount} комн., ${this.bargainTerms.price}₽</b>`;
    }
}
