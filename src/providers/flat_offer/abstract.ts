import { AxiosInstance } from 'axios';
import { Dictionary } from 'ramda';
import { createHttpAgent } from '../../tools/agent';
import { ExtSourceConnection } from '../../models/ExtSource';
import { FlatOfferDTO } from '../../models/Offer';

type CtorArgs = [ExtSourceConnection, any?];

export default abstract class AbstractExtFlatOfferProvider {
    public baseURL: string;
    protected default_currency = 'RUR';
    protected _agent!: AxiosInstance;

    constructor(protected connection: ExtSourceConnection, protected params?: any) {
        this.baseURL = connection.endpoint;
    }

    protected get agent(): AxiosInstance {
        if (!this._agent) {
            this._agent = createHttpAgent(this.baseURL);
        }
        return this._agent;
    }

    public abstract async getExtFlatOffers(): Promise<FlatOfferDTO[]>;
    public abstract FlatOfferFactory(extFlatOffer: Dictionary<any>): FlatOfferDTO;
}

export { AbstractExtFlatOfferProvider, CtorArgs };
