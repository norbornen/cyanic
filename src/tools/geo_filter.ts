const STREETS = ['лукинская', 'чоботовская', 'мухиной', 'шолохова', 'федосьино', 'лазенки'];
const REGEXP = new RegExp(`(${STREETS.join('|')})`, 'gi');

export default (address: string | null | undefined): boolean => {
    if (typeof address === 'string') {
        return REGEXP.test(address.toLocaleLowerCase());
    }
    return false;
};
