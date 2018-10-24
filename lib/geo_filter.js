const { isNil } = require('ramda');

module.exports = (geo) => {
    let ok = true;
    if (!isNil(geo)) {
        geo = geo.toLocaleLowerCase();
        ok = geo.indexOf('боровск') === -1
                && geo.indexOf('внуковск') === -1
                && geo.indexOf('новоорловск') === -1
                && geo.indexOf('новопеределкинск') === -1
                && geo.indexOf('производ') === -1;
    }
    return ok;
};
