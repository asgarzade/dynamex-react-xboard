import adapter from 'adapter';
import Pagination from './Pagination';
import User from './User';
import Order from './Order';

/**
 * @property {User} user
 * @property {Order} orders
 */
export default class AssignedOrder {
    user = {};
    orders = [];

    static get API_PATH() {
        return '/xboard/assignments/';
    }

    static get API_PATH_STATUS() {
        return '/xboard/statuses/orderassignment/shortcuts/';
    }

    constructor({ user, orders }) {
        this.user = new User(user);
        orders.forEach(order => {
            this.orders.push(new Order(order));
        })
    }

    static async fetchList({user, status, page}) {
        return await adapter({
            url: `${AssignedOrder.API_PATH}`,
            params: {
                user,
                status,
                page
            }
        }).then(response => {
          const { pageCount, currentPage } = response;
          const pagination = new Pagination({ pageCount, currentPage });
          const assignments = response.results.map(item => new AssignedOrder(item));

          return {
            results: assignments,
            ...pagination
          }
        });
    }

    static async changeAssignedOrderStatus({items, action, orderCode, deletionReason}) {
        let response;

        await adapter({
            url: `${AssignedOrder.API_PATH_STATUS}`,
            data: {
                items,
                action,
                orderCode,
                deletionReason
            },
            method: 'POST',
        }).then(resp => response = resp);

        return response;
    }

    static async addComment(id, body) {
        let response;

        await adapter({
            url: `${AssignedOrder.API_PATH}${id}/comments/`,
            data: {
                body
            },
            method: 'POST'
        }).then(res => response = res);

        return response;
    }

    static async changeAssignee(id, operatorCode) {
        let response;

        await adapter({
            url: `${AssignedOrder.API_PATH}${id}/`,
            data: {
                operatorCode
            },
            method: 'PUT'
        }).then(res => response = res);

        return response;
    }
}
