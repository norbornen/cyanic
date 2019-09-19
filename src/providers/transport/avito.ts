import { path } from 'ramda';
import { AbstractTransportProvider, ArrayOfDictionary } from './abstract';

interface ITransportResponse {
    items: ArrayOfDictionary<any>;
}

export default class AvitoTransportProvider extends AbstractTransportProvider {
    public baseURL: string = 'https://www.avito.ru';

    public async getExtEntities(): Promise<ArrayOfDictionary<any>> {
        const extEntities: ArrayOfDictionary<any> = [];

        const { data: { items: short_data } }: { data: ITransportResponse } = await this.agent.get('/map/items', {params: this.connection.config});
        if (short_data && Array.isArray(short_data) && short_data.length > 0) {
            for (let item of short_data) {
                try {
                    const params = { id: item.id, lat: path(['coords', 'lat'], item), lng: path(['coords', 'lng'], item) };
                    const { data: { items: extend_data } }: { data: ITransportResponse } = await this.agent.get('/js/catalog/items', { params });
                    if (extend_data && item.id in extend_data) {
                        item = Object.assign(item, extend_data[ item.id ] || {});
                    }
                } catch (err) {
                    console.error('AvitoTransportProvider::extendExtEntities', err);
                }
                extEntities.push(item);
            }
        }

        return extEntities;
    }

}

export { AvitoTransportProvider };
