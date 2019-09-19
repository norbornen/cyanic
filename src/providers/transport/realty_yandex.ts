import { AbstractTransportProvider, ArrayOfDictionary } from './abstract';

interface ITransportResponse {
    response: {
        search: {
            offers: {
                entities: ArrayOfDictionary<any>
            }
        }
    };
}

export default class RealtyYandexTransportProvider extends AbstractTransportProvider {
    public baseURL: string = 'https://realty.yandex.ru';

    public async getExtEntities(): Promise<ArrayOfDictionary<any>> {
        let { data: { response: { search: { offers: { entities: extEntities } } } } }: { data: ITransportResponse } =
            await this.agent.get('/gate/react-page/get/', { params: this.connection.config });
        extEntities = extEntities && Array.isArray(extEntities) ? extEntities : [];

        return extEntities;
    }

}

export { RealtyYandexTransportProvider };
