import createConnection, { disconnect } from '../src/mongooseConnect';
import { InstanceType } from '@typegoose/typegoose';
import ExtSourceModel, { ExtSource, ExtSourceTransport, ExtSourceDTO } from '../src/models/ExtSource';
import OfferModel from '../src/models/ext_entity/offer/Offer';
import NotificationChannelModel, { NotificationChannel } from '../src/models/NotificationChannel';

createConnection({db: 'mongodb://localhost/cyanic'})
.then(async () => {
    await initExtsources();
    await disconnect();
    process.exit(0);
})
.catch(async (err) => {
    console.error(err);
    await disconnect();
    process.exit(1);
});


async function initExtsources() {
    await OfferModel.deleteMany({});
    await ExtSourceModel.deleteMany({});

    const notification_channels = await NotificationChannelModel.find({ is_active: true });
    await Promise.all([
        esCian(notification_channels),
        esAvito(notification_channels),
        esYandex(notification_channels),
        esTheLocals(notification_channels)
    ]);
}

async function esCian(notification_channels: Array<InstanceType<NotificationChannel>>): Promise<ExtSource> {
    return ExtSourceModel.create({
        is_active: false,
        name: 'ЦИАН',
        alias: 'cian_np',
        transport: ExtSourceTransport.cian,
        factory: 'offer/flat/cian',
        notification_channels,
        connection: {
            config: {
                _type: "flatrent",
                for_day: {
                    type: "term",
                    value: "!1"
                },
                geo: {
                    type: "geo",
                    value: [
                        { type: "street", id: 1390 },
                        { type: "street", id: 2458 },
                        { type: "street", id: 1542 },
                        { type: "street", id: 2431 },
                        { type: "street", id: 2956 }
                    ]
                },
                engine_version: {
                    type: "term",
                    value: 2
                },
                room: {
                    type: "terms",
                    value: [2, 3]
                },
                region: {
                    type: "terms",
                    value: [ 1 ]
                },
                is_first_floor: {
                    type: "term",
                    value: false
                },
                price: {
                    type: "range",
                    value: { lte: 53001 }
                },
                wp: {
                    type: "term",
                    value: true
                }
            }
        }
    } as ExtSourceDTO);
}

async function esYandex(notification_channels: Array<InstanceType<NotificationChannel>>): Promise<ExtSource> {
    return ExtSourceModel.create({
        is_active: false,
        name: 'Яндекс.Недвижимость',
        alias: 'realty_yandex_np',
        transport: ExtSourceTransport.realty_yandex,
        factory: 'offer/flat/realty_yandex',
        notification_channels,
        connection: {
            config: {
                type: 'RENT',
                category: 'APARTMENT',
                unifiedAddress: [
                    'Россия, Москва, Лукинская улица',
                    'Россия, Москва, Чоботовская улица',
                    'Россия, Москва, улица Скульптора Мухиной',
                    'Россия, Москва, улица Шолохова',
                    'Россия, Москва, улица Федосьино',
                    'Россия, Москва, 6-я улица Лазенки',
                ],
                priceMax: '52000',
                rgid: '587795',
                roomsTotal: ['2', '3'],
                _format: 'react',
                _pageType: 'search',
                _providers: 'react-search-data',
            }
        }
    } as ExtSourceDTO);
}

async function esAvito(notification_channels: Array<InstanceType<NotificationChannel>>): Promise<ExtSource> {
    return ExtSourceModel.create({
        is_active: false,
        name: 'Avito',
        alias: 'avito_np',
        transport: ExtSourceTransport.avito,
        factory: 'offer/flat/avito',
        pipes_before: ['offer/flat/geo_filter_np.avito'],
        notification_channels,
        connection: {
            config: {
                'categoryId': 24,
                'correctorMode': 0,
                'params[201]': 1060,
                'params[504]': 5256,
                'params[550][0]': 5704,
                'params[550][1]': 5705,
                'searchArea[latBottom]': 55.631491836250625,
                'searchArea[lonLeft]': 37.29596235618074,
                'searchArea[latTop]': 55.65301841193268,
                'searchArea[lonRight]': 37.404291962146175,
                'viewPort[width]': 1591.3333740234375,
                'viewPort[height]': 558,
                'page': 1,
                'limit': 50,
            }
        }
    } as ExtSourceDTO);
}

async function esTheLocals(notification_channels: Array<InstanceType<NotificationChannel>>): Promise<ExtSource> {
    return ExtSourceModel.create({
        is_active: true,
        name: 'Локалс',
        alias: 'the_locals_np',
        transport: ExtSourceTransport.thelocals,
        factory: 'offer/flat/the_locals',
        pipes_before: ['offer/flat/geo_filter_np.the_locals'],
        notification_channels,
        connection: {
            config: {
                filter: {
                    kind: "apartment",
                    deal_type: "rent",
                    rooms_amount: [2, 3],
                    subway_ids: [800],
                    agent_fee: 100,
                    has_agent_fee: true
                }
            }
        }
    } as ExtSourceDTO);
}
