import Currency from './Currency';
import adapter from 'adapter';

/**
 * @property {Currency} currency
 * @property {string} amount
 * @property {boolean} usable
 */
export default class Wallet {
    currency = {};
    amount = "";
    usable = false;

    constructor({ currency, amount, usable }) {
        this.currency = new Currency(currency);
        this.amount = amount;
        this.usable = usable;
    }

    static get API_PATH() {
        return '/xboard/payments/balances/';
    }

    static async updateBalance(data) {
        let balanceResp;

        await adapter({
            url: `${Wallet.API_PATH}`,
            method: 'POST',
            data,
        }).then(response => balanceResp = response);

        return balanceResp;
    }
}