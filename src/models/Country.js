import adapter from 'adapter';
import Currency from './Currency';
/**
 * @property {number} id
 * @property {Currency} currency
 * @property {string} name
 * @property {boolean} isBase
 */
export default class Country {
    id = 0;
    currency = {};
    name = "";
    isBase = false;
    
    static get API_PATH() {
        return '/core/countries/';
    }

    constructor({ id, currency, name, isBase }) {
        this.id = id;
        this.currency = new Currency(currency);
        this.name = name;
        this.isBase = isBase;
    }

    static async fetchList() {
        const countries = [];

        await adapter({
            url: `${Country.API_PATH}`
        }).then(response => {
            response.forEach(element => {
                countries.push(new Country(element));
            });
        });

        return countries;
    }
}