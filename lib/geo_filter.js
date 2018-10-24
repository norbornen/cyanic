const { isNil } = require('ramda');

module.exports = (geo) => {
    let ok = true;
    if (!isNil(geo)) {
        geo = geo.toLocaleLowerCase();
        ok = geo.indexOf('боровск') === -1
                && geo.indexOf('внуков') === -1
                && geo.indexOf('новоорловск') === -1
                && geo.indexOf('новопеределкинск') === -1
                && geo.indexOf('производ') === -1
                && geo.indexOf('маршак') === -1
                && geo.indexOf('московский') === -1
                && geo.indexOf('тарковск') === -1
                && geo.indexOf('кокошкин') === -1
                && geo.indexOf('марушк') === -1
                && geo.indexOf('ервомайск') === -1
        ;
    }
    return ok;
};
