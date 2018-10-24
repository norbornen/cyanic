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
    const db = await Db('cian');

    const urlGetIdx = 'https://api.cian.ru/search-offers/v1/get-infinite-search-result-desktop/';
    const urlGetItems = 'https://api.cian.ru/search-offers/v1/get-offers-by-ids-desktop/';
    const jsonQuery = config.get('cian.jsonQuery');
    const queryString = config.get('cian.queryString');

    const rawIdx = [].concat(
            ...(await Promise.all([
                        axios.post(urlGetIdx, {jsonQuery, queryString}),
                        // axios.post(urlGetIdx, Object.assign({pageNumber: 2}, {jsonQuery, queryString}))
            ]))
            .map(({data}) => data.infiniteSearchResult || [])
    );
    
    const cianOfferIds = rawIdx.map(({itemId}) => itemId);

    let offers = (await axios.post(urlGetItems, {cianOfferIds, jsonQuery})).data.offersSerialized || [];
    offers = offers.filter((x) => x.roomsCount >= 2 
                                    && x.childrenAllowed !== false
                                    && db.data.indexOf(x.cianId) === -1
                                    && geoFilter(path(['geo', 'userInput'], x))
                );

    console.log(`idx: ${cianOfferIds.length}, offers: ${offers.length}`);
    if (offers.length > 0) {
        await queue.addAll(offers.map((x) => () => offerMessage(x)));
        db.data = db.data.concat(offers.map(({cianId}) => cianId));
        await db.save();
    }
};

async function offerMessage(offer) {
    const t = `
<a href="${offer.fullUrl}">${offer.geo.userInput}</a>
<b>${offer.roomsCount} комн., ${offer.bargainTerms.price}₽</b>
`;
    await sendHtmlMessage(t);
}
