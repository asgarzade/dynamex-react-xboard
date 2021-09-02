import adapter from 'adapter';
/**
 * @property {number} id
 * @property {string} country
 * @property {string} displayName
 * @property {string} contactNumber
 */
export default class Warehouse {
    id = 0;
    country = "";
    displayName = "";
    contactNumber = "";
    
    static get API_PATH() {
        return '/fulfillment/warehouses/';
    }

    constructor({ id, country, displayName, contactNumber }) {
        this.id = id;
        this.country = country;
        this.displayName = displayName;
        this.contactNumber = contactNumber;
    }

    static async fetchList() {
        const warehouses = [];

        await adapter({
            url: `${Warehouse.API_PATH}`
        }).then(response => {
            response.forEach(element => {
                warehouses.push(new Warehouse(element));
            });
        });

        return warehouses;
    }
}