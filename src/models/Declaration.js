import adapter from 'adapter';
import Pagination from './Pagination';
import Comment from "./Comment";

/**
 * @property {number} id
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} trackingCode
 * @property {string} shop
 * @property {number} productQuantity
 * @property {string} productPrice
 * @property {string} totalPrice
 * @property {boolean} isPaid
 * @property {string} comment
 * @property {string} statusUpdatedAt
 * @property {string} extra
 * @property {string} attachment
 * @property {string} weight
 * @property {string} deliveryCode
 * @property {string} deliveryCost
 * @property {string} discountPrice
 * @property {boolean} isFromAdmin
 * @property {boolean} isCosmetics
 * @property {boolean} isUpdatedByAdmin
 * @property {number} countryFrom
 * @property {number} countryTo
 * @property {number} productPriceCurrency
 * @property {number} totalPriceCurrency
 * @property {number} status
 * @property {number} deliveryCostCurrency
 * @property {number} discountPriceCurrency
 * @property {string} creatorAdmin
 * @property {string} destinationWarehouse
 * @property {ProductType} productTypes
 * @property {boolean} packageSizeConsidered
 * @property {number} packageHeight
 * @property {number} packageWidth
 * @property {number} packageLength
 */
export default class Declaration {
    id = 0;
    user = '';
    adminLink = '';
    comments = [];
    createdAt = '';
    updatedAt = '';
    trackingCode = '';
    shop = '';
    productQuantity = 0;
    productPrice = '';
    totalPrice = '';
    totalInUsd = '';
    isPaid = false;
    comment = '';
    statusUpdatedAt = '';
    attachment = '';
    weight = '';
    deliveryCode = null;
    deliveryCost = '';
    discountPrice = '';
    penaltyCost = '';
    penaltyStartDate = null;
    penaltyLastAppliedDate = null;
    isFromAdmin = false;
    isCosmetics = false;
    isUpdatedByAdmin = false;
    shelfPlaceNumber = 0;
    countryFrom = 0;
    countryTo = 0;
    productPriceCurrency = 0;
    totalPriceCurrency = 0;
    status = 0;
    deliveryCostCurrency = 0;
    discountPriceCurrency = 0;
    penaltyCostCurrency = 0;
    creatorAdmin = null;
    destinationWarehouse = 0;
    queuer = null;
    productTypes = [];
    packageSizeConsidered = false;
    packageHeight = 0;
    packageWidth = 0;
    packageLength = 0;
    bag = null;

    static get API_PATH() {
        return '/xboard/declarations/';
    }

    static get API_PATH_PAYMENT() {
        return '/xboard/payments/declarations/'
    }

    static get API_PATH_STATUS() {
        return '/xboard/statuses/declaration/shortcuts/'
    }

    constructor({ id, createdAt, updatedAt, trackingCode, shop, productQuantity, productPrice, totalPrice, isPaid,
        comment, statusUpdatedAt, extra, attachment, weight, deliveryCode, deliveryCost, discountPrice, isFromAdmin,
        isCosmetics, isUpdatedByAdmin, countryFrom, countryTo, productPriceCurrency, totalPriceCurrency, status,
        deliveryCostCurrency, discountPriceCurrency, creatorAdmin, destinationWarehouse, productTypes, adminLink,
        user, totalInUsd, penaltyCost, penaltyStartDate, penaltyLastAppliedDate, penaltyCostCurrency, shelfPlaceNumber,
        packageSizeConsidered, packageHeight, packageWidth, packageLength, comments, queuer, bag
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.trackingCode = trackingCode;
        this.shop = shop;
        this.productQuantity = productQuantity;
        this.productPrice = productPrice;
        this.totalPrice = totalPrice;
        this.isPaid = isPaid;
        this.comment = comment;
        this.statusUpdatedAt = statusUpdatedAt;
        this.extra = extra;
        this.attachment = attachment;
        this.weight = weight;
        this.deliveryCode = deliveryCode;
        this.deliveryCost = deliveryCost;
        this.discountPrice = discountPrice;
        this.isFromAdmin = isFromAdmin;
        this.isCosmetics = isCosmetics;
        this.isUpdatedByAdmin = isUpdatedByAdmin;
        this.countryFrom = countryFrom;
        this.countryTo = countryTo;
        this.productPriceCurrency = productPriceCurrency;
        this.totalPriceCurrency = totalPriceCurrency;
        this.status = status;
        this.deliveryCostCurrency = deliveryCostCurrency;
        this.discountPriceCurrency = discountPriceCurrency;
        this.creatorAdmin = creatorAdmin;
        this.destinationWarehouse = destinationWarehouse;
        this.productTypes = productTypes;
        this.adminLink = adminLink;
        this.user = user;
        this.totalInUsd = totalInUsd;
        this.penaltyCost = penaltyCost;
        this.penaltyStartDate = penaltyStartDate;
        this.penaltyLastAppliedDate = penaltyLastAppliedDate;
        this.penaltyCostCurrency = penaltyCostCurrency;
        this.shelfPlaceNumber = shelfPlaceNumber;
        this.packageSizeConsidered = packageSizeConsidered;
        this.packageHeight = packageHeight;
        this.packageLength = packageLength;
        this.packageWidth = packageWidth;
        this.queuer = queuer;
        comments.forEach(comment => this.comments.push(new Comment(comment)));
        this.bag = bag;
    }

    static createEmpty() {
        return {
            id: '',
            trackingCode: '',
            shop: '',
            productQuantity: '',
            productPrice: '',
            comment: '',
            attachment: undefined,
            weight: '',
            deliveryCode: '',
            isCosmetics: false,
            countryFrom: '',
            status: '',
            productTypes: [],
            packageSizeConsidered: false,
            packageHeight: 0,
            packageWidth: 0,
            packageLength: 0,
            bag: '',
        }
    }

    static async fetchList({user, status, panel, page}) {
        const declarations = [];
        let pagination;

        await adapter({
            url: `${Declaration.API_PATH}`,
            params: {
                status,
                user,
                panel,
                page,
            }
        }).then(response => {
            response.results.forEach(element => {
                declarations.push(new Declaration(element));
            });
            const { pageCount, currentPage } = response;
            pagination = new Pagination({pageCount, currentPage});
        });

        return {
            results: declarations,
            ...pagination
        }
    }

    static async fetchSingle(id) {
        let declaration;

        await adapter({
            url: `${Declaration.API_PATH}${id}/`,
        }).then(response => declaration = new Declaration(response));

        return declaration;
    }

    static async createDeclaration(data, forOrders) {
        let dclrResp;

        await adapter({
            url: `${Declaration.API_PATH}`,
            params: forOrders ? { fororders: 1,} : '',
            method: 'POST',
            data,
        }).then(response => { dclrResp = new Declaration(response) });

        return dclrResp;
    }

    static async editDeclaration(id, data) {
        let dclrResp;

        await adapter({
            url: `${Declaration.API_PATH}${id}/`,
            method: 'PATCH',
            data,
        }).then(response => { dclrResp = new Declaration(response) });

        return dclrResp;
    }

    static async payDeclarations(data) {
        let payResp;

        await adapter({
            url: `${Declaration.API_PATH_PAYMENT}`,
            method: 'POST',
            data,
        }).then(response => { payResp = response });

        return payResp;
    }

    static async changeDeclarationStatus(items, action) {
        let response;

        await adapter({
            url: `${Declaration.API_PATH_STATUS}`,
            data: {
                items,
                action
            },
            method: 'POST',
        }).then(resp => response = resp);

        return response;
    }
}