import AbstractExtEntityPipe from "../../abstract";
import { path, isEmpty, Dictionary } from "ramda";

export default class GFNPTL extends AbstractExtEntityPipe {
    protected static readonly STREETS: string[] = ['лукинская', 'чоботовская', 'мухиной', 'шолохова', 'федосьино', 'лазенки'];
    protected static readonly REGEXP = new RegExp(`(${GFNPTL.STREETS.join('|')})`, 'gi');

    public async apply(data: Dictionary<any>): Promise<boolean> {
        const address = path<string>(['address'], data);
        if (address && typeof address === 'string' && !isEmpty(address)) {
            return GFNPTL.REGEXP.test(address.toLocaleLowerCase());
        }
        return true;
    }
}
