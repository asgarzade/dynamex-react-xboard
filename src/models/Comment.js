import Operator from "./Operator";
/**
 * @property {Operator} user
 * @property {date} createdAt
 * @property {string} body
 */
export default class Comment {
    user = {};
    createdAt = '';
    body = '';

    constructor({ user, createdAt, body }) {
        this.createdAt = createdAt;
        this.user = new Operator(user);
        this.body = body;
    }
}