import adapter from 'adapter';
import Pagination from './Pagination';
import Assignment from './Assignment';
/**
 * @property {number} id
 * @property {number} status
 * @property {number} countryFrom
 * @property {string} shop
 * @property {string} trackingCode
 * @property {string} orderCode
 * @property {string} deliveryCode
 * @property {string} brand
 * @property {string} productSize
 * @property {string} productColor
 * @property {boolean} isPaid
 * @property {boolean} isUrgent
 * @property {string} cargoPrice
 * @property {number} cargoPriceCurrency
 * @property {string} productUrl
 * @property {string} productPrice
 * @property {number} productQuantity
 * @property {number} productPriceCurrency
 * @property {string} realProductQuantity
 * @property {string} realProductPrice
 * @property {string} realCargoPrice
 * @property {string} totalPrice
 * @property {number} totalPriceCurrency
 * @property {string} comment
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} statusUpdatedAt
 * @property {number} declaration
 * @property {string} adminLink
 * @property {Assignment} assignment
 * @property {string} remainderPrice
 * @property {string} remainderPriceInBaseCurrency
 * @property {string} paidRemainderAmount
 * @property {string} paidRemainderAmountInBaseCurrency
 * @property {boolean} isRemainderPaid
 * @property {number} productTypes
 */

export default class Order {
    id = 0;
    status = 0;
    countryFrom = 0;
    shop = '';
    trackingCode = '';
    orderCode = '';
    brand = '';
    productSize = '';
    productColor = '';
    isPaid = false;
    isUrgent = false;
    cargoPrice = '';
    cargoPriceCurrency = 0;
    productUrl = '';
    productPrice = '';
    productQuantity = 0;
    productPriceCurrency = 0;
    totalPrice = '';
    totalPriceCurrency = 0;
    comment = '';
    createdAt = '';
    updatedAt = '';
    statusUpdatedAt = '';
    declaration = 0;
    assignment = {};
    remainderPrice = '';
    remainderPriceInBaseCurrency = '';
    isRemainderPaid = false;
    adminLink = '';
    deliveryCode = '';
    realProductQuantity = 0;
    realProductPrice = '';
    realCargoPrice = '';
    paidRemainderAmount = '';
    paidRemainderAmountInBaseCurrency = '';
    productTypes = [];
    isCargoProfitable = false;

    static get API_PATH() {
        return '/xboard/orders/';
    }

    static get API_PATH_PAYMENT() {
        return '/xboard/payments/orders/'
    }

    constructor({id, status, countryFrom, shop, trackingCode, orderCode, brand, productSize, productColor, isPaid,
        isUrgent, productUrl, productPrice, productQuantity, productPriceCurrency, totalPrice, cargoPrice, cargoPriceCurrency,
        totalPriceCurrency, comment, createdAt, updatedAt, statusUpdatedAt, declaration, assignment, remainderPrice,
        remainderPriceInBaseCurrency, isRemainderPaid, adminLink, deliveryCode, realProductQuantity, realProductPrice, realCargoPrice,
                    paidRemainderAmountInBaseCurrency, paidRemainderAmount, productTypes, isCargoProfitable
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.trackingCode = trackingCode;
        this.orderCode = orderCode;
        this.shop = shop;
        this.isPaid = isPaid;
        this.productQuantity = productQuantity;
        this.productPrice = productPrice;
        this.totalPrice = totalPrice;
        this.isRemainderPaid = isRemainderPaid;
        this.comment = comment;
        this.statusUpdatedAt = statusUpdatedAt;
        this.brand = brand;
        this.productSize = productSize;
        this.productColor = productColor;
        this.isUrgent = isUrgent;
        this.productUrl = productUrl;
        this.declaration = declaration;
        this.assignment = new Assignment(assignment);
        this.remainderPrice = remainderPrice;
        this.remainderPriceInBaseCurrency = remainderPriceInBaseCurrency;
        this.productPriceCurrency = productPriceCurrency;
        this.totalPriceCurrency = totalPriceCurrency;
        this.status = status;
        this.countryFrom = countryFrom;
        this.adminLink = adminLink;
        this.cargoPrice = cargoPrice;
        this.cargoPriceCurrency = cargoPriceCurrency;
        this.deliveryCode = deliveryCode;
        this.realCargoPrice = realCargoPrice;
        this.realProductPrice = realProductPrice;
        this.realProductQuantity = realProductQuantity;
        this.paidRemainderAmount = paidRemainderAmount;
        this.paidRemainderAmountInBaseCurrency = paidRemainderAmountInBaseCurrency;
        this.productTypes = productTypes;
        this.isCargoProfitable = isCargoProfitable;
    }

    static async fetchList({user, status, panel, page}) {
        const orders = [];
        let pagination;

        await adapter({
            url: `${Order.API_PATH}`,
            params: {
                status,
                user,
                panel,
                page,
            }
        }).then(response => {
            response.results && response.results.forEach(element => {
                orders.push(new Order(element));
            });

            const { pageCount, currentPage } = response;
            pagination = new Pagination({pageCount, currentPage})
        });

        return {
            results: orders,
            ...pagination 
        }
    }

    static async fetchSingle(id) {
        let order

        await adapter({
            url: `${Order.API_PATH}${id}/`,
        }).then(response => {
            order = new Order(response)
        });

        return order;
    }

    static async editOrder(order) {
        let orderResp;

        await adapter({
            url: `${Order.API_PATH}${order.id}/`,
            method: 'PATCH',
            data: order,
        }).then(response => { orderResp = new Order(response) });

        return orderResp;
    }

    static async payOrder(id) {
        let payResp;

        await adapter({
            url: `${Order.API_PATH_PAYMENT}${id}/remainder/`,
            method: 'POST',
        }).then(response => { payResp = response });

        return payResp;
    }
}