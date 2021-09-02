import adapter from 'adapter';
/**
 * @property {object} paymentMethods
 * @property {object} paymentChoices
 * @property {object} balanceChoices
 * @property {object} mobileOperators
 */
export default class Choice {
    paymentMethods = {};
    paymentChoices = {};
    balanceChoices = {};
    mobileOperators = [];

    static get API_PATH() {
        return '/xboard/operations/choices/';
    }

    constructor({ paymentMethods, paymentChoices, balanceChoices, mobileOperators }) {
        this.paymentMethods = paymentMethods;
        this.paymentChoices = paymentChoices;
        this.balanceChoices = balanceChoices;
        this.mobileOperators = mobileOperators;
    }

    static createDefault() {
        return new Choice({
            paymentMethods: {},
            paymentChoices: {},
            balanceChoices: {},
            mobileOperators: [],
        })
    }

    static async fetchChoices() {
        let choices;

        await adapter({
            url: `${Choice.API_PATH}`,
        }).then(response => {
            choices = new Choice(response)
        });

        return choices;
    }
}