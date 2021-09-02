import adapter from 'adapter';
/**
 * @property {number} id
 * @property {string} name
 * @property {number} country
 */
export default class ProductType {
    id = 0;
    name = '';
    country = 0;

    static get API_PATH() {
        return '/fulfillment/product-types/';
    }

    constructor({ id, name, country }) {
        this.id = id;
        this.name = name;
        this.country = country;
    }

    static async fetchList() {
        const types = [];

        await adapter({
            url: `${ProductType.API_PATH}`,
            // url: 'statuses'
        }).then(response => {
            response.forEach(element => {
                types.push(new ProductType(element));
            });
        });

        return types;
    }
}