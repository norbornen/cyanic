import { InstanceType } from '@hasezoey/typegoose';
import { AxiosInstance } from 'axios';
import { Dictionary } from 'ramda';
import { createHttpAgent } from '../tools/agent';
import { ExtSourceConnection } from '../models/ExtSource';
import { ExtEntity } from '../models/ext_entity/ExtEntity';


type CtorArgs = [ExtSourceConnection, any?];

export default class AbstractExtEntityFactory {
    protected baseURL!: string;
    protected readonly default_currency = 'RUR';
    protected _agent!: AxiosInstance;

    constructor(protected connection?: ExtSourceConnection, protected params?: any) {
    }

    protected get agent(): AxiosInstance {
        if (!this._agent) {
            this._agent = createHttpAgent(this.baseURL);
        }
        return this._agent;
    }

    public async makeInstanse(data: Dictionary<any>): Promise<InstanceType<ExtEntity>> {
        throw new Error('call abstract class method');
    }
}

export { AbstractExtEntityFactory, CtorArgs };
