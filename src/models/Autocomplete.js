import adapter from 'adapter';
/**
 * @property {string} label
 * @property {string} value
 */
export default class Autocomplete {
    label = "";
    value = "";
    
    static get API_PATH() {
        return '/xboard/autocomplete';
    }

    constructor({ label, value }) {
        this.label = label;
        this.value = value;
    }

    static async fetchUsers(query) {
        const users = [];
        
        await adapter({
            url: `${Autocomplete.API_PATH}/user`,
            params: {
                q: query
            }
        }).then(res => {
            res.forEach(element => {
                users.push(new Autocomplete(element));
            });
        })
        return users;
    }
}