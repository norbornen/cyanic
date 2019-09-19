import { Dictionary } from 'ramda';

export default class AbstractExtEntityPipe {
    constructor() {}
    public async apply(data: Dictionary<any>): Promise<boolean> {
        throw new Error('call abstract class method');
    }
}

export { AbstractExtEntityPipe };
