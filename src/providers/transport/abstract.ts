import { AxiosInstance } from 'axios';
import { Dictionary } from 'ramda';
import { createHttpAgent } from '../../tools/agent';
import { ExtSourceConnection } from '../../models/ExtSource';

type ArrayOfDictionary<T> = Dictionary<T>[];

type CtorArgs = [ExtSourceConnection, any?];

export default abstract class AbstractTransportProvider {
    public baseURL!: string;
    protected _agent!: AxiosInstance;

    constructor(protected connection: ExtSourceConnection, protected params?: any) {
        if ('endpoint' in connection && connection.endpoint) {
            this.baseURL = connection.endpoint;
        }
    }

    protected get agent(): AxiosInstance {
        if (!this._agent) {
            this._agent = createHttpAgent(this.baseURL);
        }
        return this._agent;
    }

    public abstract async getExtEntities(): Promise<Dictionary<any>[]>;
}

export { AbstractTransportProvider, CtorArgs, ArrayOfDictionary };
