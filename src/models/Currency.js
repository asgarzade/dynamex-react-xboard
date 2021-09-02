import adapter from 'adapter';
/**
 * @property {number} id
 * @property {string} code
 * @property {string} symbol
 * @property {string} rate
 * @property {string} name
 * @property {boolean} isBase
 */
export default class Currency {
    id = 0;
    code = "";
    symbol = "";
    rate = "";
    name = "";
    isBase = false;
    
    static get API_PATH() {
        return '/xboard/currencies/';
    }

    constructor({ id, code, symbol, rate, name, isBase }) {
        this.id = id;
        this.code = code;
        this.symbol = symbol;
        this.rate = rate;
        this.name = name;
        this.isBase = isBase;
    }

    static createDefault() {
        return new Currency({
            id: 0,
            code: '',
            symbol: '',
            rate: '',
            name: '',
        })
    }

    static async fetchList() {
        const currencies = [];

        await adapter({
            url: `${Currency.API_PATH}`
        }).then(response => {
            response.forEach(element => {
                currencies.push(new Currency(element));
            });
        });

        return currencies;
    }
}