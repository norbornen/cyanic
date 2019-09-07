import { path } from 'ramda';
import { Money as MoneyBase, Currencies as CurrenciesBase, Currency as ICurrency } from 'ts-money';

const Currencies = {
    ...CurrenciesBase,
    RUB: { ...CurrenciesBase.RUB, symbol: '₽' },
    RUR: { ...CurrenciesBase.RUB, symbol: '₽', code: 'RUR' }
} as const;

class Money extends MoneyBase {
    constructor(amount: number = -1, currency: string | ICurrency = 'RUR') {
        if (typeof currency === 'string' && currency in Currencies) {
            currency = path<ICurrency>([currency], Currencies)!;
        }
        super(amount, currency);
    }
}

export { Money, Currencies };
