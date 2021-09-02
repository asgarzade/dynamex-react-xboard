import adapter from 'adapter';
import User from './User';
import Declaration from "./Declaration";

/**
 * @property {number} id
 * @property {User} user
 * @property {Declaration} declarations
 * @property {number} number
 */
export default class Queue {
    id = 0;
    user = {};
    declarations = [];
    number = 0;

    static get API_PATH_GET() {
        return '/xboard/queue/';
    }

    static get API_PATH_POST() {
        return '/xboard/queuers/'
    }

    constructor({ id, number, user, declarations }) {
        this.id = id;
        this.number = number;
        this.user = new User(user);
        declarations.forEach(declaration => this.declarations.push(new Declaration(declaration)));
    }

    static async fetchList() {
        let queueItems = [];

        await adapter({
            url: `${Queue.API_PATH_GET}`,
        }).then(response => {
            response.queuers.forEach(item => {
                queueItems.push(new Queue(item));
            });

        });

        return queueItems;
    }

    static async addToQueue(declarations) {
        let number = 0;

        console.log(declarations)

        await adapter({
            url: `${Queue.API_PATH_POST}`,
            data: {
                declarations
            },
            method: 'POST'
        }).then(response => number = response);

        return number;
    }

    static async moveToDone(id) {
        let rsp = '';

        await adapter({
            url: `${Queue.API_PATH_POST}${id}/done/`,
            method: 'POST',
        }).then(response => rsp = response);

        return rsp;
    }
}