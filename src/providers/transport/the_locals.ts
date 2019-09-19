import { AbstractTransportProvider, ArrayOfDictionary } from './abstract';

interface ITransportResponse {
    ads: ArrayOfDictionary<any>;
}

export default class LocalsTransportProvider extends AbstractTransportProvider {
    public baseURL: string = 'https://thelocals.ru';

    public async getExtEntities(): Promise<ArrayOfDictionary<any>> {
        let { data: { ads: extEntities } }: { data: ITransportResponse } =
            await this.agent.post('/api/frontend/rooms', { ...this.connection.config });
        extEntities = extEntities && Array.isArray(extEntities) ? extEntities : [];
        return extEntities;
    }

}

export { LocalsTransportProvider };
