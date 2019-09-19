import GFNPTL from "./geo_filter_np.the_locals";
import { path, isEmpty, Dictionary } from "ramda";

export default class GFNPA extends GFNPTL {
    public async apply(data: Dictionary<any>): Promise<boolean> {
        const address = path<string>(['address'], data) || path<string>(['ext', 'address'], data);
        if (address && typeof address === 'string' && !isEmpty(address)) {
            return GFNPTL.REGEXP.test(address.toLocaleLowerCase());
        }
        return false;
    }
}
