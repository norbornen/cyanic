const { isNil } = require('ramda');
const config = require('config');

const streets = config.get('geo.streets');
const re = new RegExp(`(${streets.join('|')})`, 'g');

module.exports = (geo) => {
    let ok = true;
    if (!isNil(geo)) {
        geo = geo.toLocaleLowerCase();
        ok = re.test(geo);
    }
    return ok;
};
