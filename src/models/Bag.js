import adapter from 'adapter';
/**
 * @property {number} id
 * @property {string} name
 * @property {boolean} wasLast
 */
export default class Bag {
    id = 0;
    name = "";
    wasLast = false;
    
    static get API_PATH() {
        return '/xboard/bags/';
    }

    constructor({ id, name, wasLast }) {
        this.id = id;
        this.name = name;
        this.wasLast = wasLast;
    }

    static async fetchList() {
        const bags = [];

        await adapter({
            url: `${Bag.API_PATH}`
        }).then(response => {
            response.forEach(element => {
                bags.push(new Bag(element));
            });
        });

        return bags;
    }
}