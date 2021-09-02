import Comment from './Comment';
import Operator from './Operator';
/**
 * @property {Comment} comment
 * @property {number} id
 * @property {number} status
 * @property {Operator} operator
 */
export default class Assignment {
    comments = [];
    id = 0;
    status = 0;
    operator = {};

    constructor({ comments, id, status, operator }) {
        comments.forEach(comment => this.comments.push(new Comment(comment)));
        this.id = id;
        this.status = status;
        this.operator = new Operator(operator)
    }
}
