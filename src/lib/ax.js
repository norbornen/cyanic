const axios = require('axios');
const qs = require('qs');

module.exports.create = (headers) => {
    const ax = axios.create();
    ax.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 5.1; rv:44.0) Gecko/20100101 Firefox/44.0';
    ax.defaults.headers.common['accept'] = 'application/json, text/plain, */*';
    if (headers) {
        Object.entries(headers).forEach(([k, v]) => ax.defaults.headers.common[k] = v);
    }
    ax.defaults.paramsSerializer = (params) => qs.stringify(params, {arrayFormat: 'repeat'});
    return ax;
};
