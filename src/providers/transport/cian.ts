import { AbstractTransportProvider, ArrayOfDictionary } from './abstract';

interface ITransportResponse {
    data: {
        offersSerialized: ArrayOfDictionary<any>
    };
}

export default class CianTransportProvider extends AbstractTransportProvider {
    public baseURL: string = 'https://api.cian.ru';

    // constructor(...args: CtorArgs) {
    //     super(...args);
    // }

    public async getExtEntities(): Promise<ArrayOfDictionary<any>> {
        let { data: { data: { offersSerialized: extEntities } } }: { data: ITransportResponse } =
            await this.agent.post('/search-offers/v2/search-offers-desktop/', { jsonQuery: this.connection.config });
        extEntities = extEntities && Array.isArray(extEntities) ? extEntities : [];

        return extEntities;
    }

}

export { CianTransportProvider };
