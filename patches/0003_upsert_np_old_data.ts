// tslint:disable:prefer-const
import { Dictionary, isNil, isEmpty } from 'ramda';
import createConnection, { disconnect } from '../src/mongooseConnect';
import { InstanceType } from '@hasezoey/typegoose';
import { ExtSourceModel, ExtSource, ExtSourceTransport } from '../src/models/ExtSource';
import { FlatOfferModel, FlatOfferDTO, Money } from '../src/models/ext_entity/offer/FlatOffer';
const history: Array<Dictionary<any>> = require('./hist');

createConnection({db: 'mongodb://localhost/cyanic'})
.then(async () => {
    await run();
    await disconnect();
    process.exit(0);
})
.catch(async (err) => {
    console.error(err);
    await disconnect();
    process.exit(1);
});

async function run() {
    const offersDTO = await getOffersDTO();
    console.log(offersDTO.length);

    const filteredOffersDTO: FlatOfferDTO[] = [];
    for (const offerDTO of offersDTO) {
        const existsFlatOffer = await FlatOfferModel.findOne(
            {$or: [
                {ext_id: offerDTO.ext_id, source: offerDTO.source},
                {url: offerDTO.ext_full_url}
            ]}
        );
        if (!existsFlatOffer) {
            filteredOffersDTO.push(offerDTO);
        }
    }
    console.log(filteredOffersDTO.length);

    await FlatOfferModel.insertMany(filteredOffersDTO);
}

async function getOffersDTO() {
    const extSourceMap = await getExtSources();

    const bot_history = history.filter(({from_id}) => from_id === 647343504)
            .sort((a, b) => a.id - b.id)
            .map(({id, date, message}: {id: number; date: string; message: string}) => ({id, date, message}))
            .filter(({ message }) => !/thelocals/.test(message));

    let offersDTO = bot_history.map((h): FlatOfferDTO => {
        let [ address, rooms_and_price, url ] = h.message.split(/\n/).map((x) => x.trim());
        let [ rooms, price ] = (rooms_and_price || '').split(/\s*,\s*/).map((x): string | number => x.replace(/\D/g, ''));
        if (!address || !rooms_and_price || !url || !rooms || !price) {
            console.error(h);
            throw new Error('INCORRECT_DATA');
        }
        address = address.replace(/\s+,/g, ',').replace(/,\s?,/g, ',')
                        .replace(/(Россия|г\.?\s?Москва|Москва г|Москва),\s*/g, '').replace(/,\s?,/g, ',')
                        .replace(/(Москва|москва)\s+/g, '')
                        .replace(/, д (\d+)/, ', $1')
                        .replace(/^г\s*/, '').replace(/^ул /, 'улица ').replace(/^119634, /, '').trim();
        if (!isNil(rooms) && !isEmpty(rooms)) {
            rooms = Number(rooms);
        }
        if (!isNil(price) && !isEmpty(price)) {
            price = Number(price);
        }

        let ext_id: string = url;
        let source;
        if (/cian/.test(url)) {
            source = extSourceMap.get(ExtSourceTransport.cian)!._id;
            ext_id = /\/(\d+)\/?$/.exec(url)![1];
        }
        if (/yandex/.test(url)) {
            source = extSourceMap.get(ExtSourceTransport.realty_yandex)!._id;
            ext_id = /\/(\d+)\/?$/.exec(url)![1];
        }
        if (/avito/.test(url)) {
            source = extSourceMap.get(ExtSourceTransport.avito)!._id;
            ext_id = /\._(\d+)\/?$/.exec(url)![1];
        }
        if (isNil(ext_id) || isEmpty(ext_id)) {
            throw new Error(`INCORRECT EXT_ID FOR ${url}`);
        }

        const offer: FlatOfferDTO = {
            source, ext_id,
            ext_full_url: url,
            rooms_count: rooms,
            price: new Money(price as number, 'RUR'),
            location: { address },
            createdAt: new Date(h.date),
            updatedAt: new Date(h.date),
            ext_updated_at: new Date(h.date),
            is_active: true,
            is_notifications_send: true
        };
        return offer;
    });

    // uniq by ext_id
    offersDTO = offersDTO.reverse().filter((obj, idx, arr) => {
        return arr.map((mapObj) => mapObj.ext_id).indexOf(obj.ext_id) === idx;
    });

    return offersDTO;
}

async function getExtSources() {
    const extSources = await ExtSourceModel.find({});
    const map = new Map<ExtSourceTransport, InstanceType<ExtSource>>();
    extSources.forEach((extSource) => map.set(extSource.transport, extSource));
    return map;
}
