import { Dictionary } from 'ramda';

type CtorArgs = [Dictionary<any>, Dictionary<any>?];

export default abstract class AbstractNotifcationProvider {
    constructor(protected readonly connection: Dictionary<any>, protected template?: Dictionary<any>) {
    }

    public abstract async send(msg_data: Dictionary<any>): Promise<boolean>;
}

export { AbstractNotifcationProvider, CtorArgs };
