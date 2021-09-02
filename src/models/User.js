import adapter from 'adapter';
import Wallet from './Wallet';
/**
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phoneOperator
 * @property {string} phoneNumber
 * @property {string} clientCode
 * @property {string} email
 * @property {string} last30DaysDecExpenses
 * @property {string} last30DaysOrdExpenses
 * @property {Wallet} wallets
 */
export default class User {
    firstName = "";
    lastName = "";
    phoneOperator = "";
    phoneNumber = "";
    clientCode = "";
    email = "";
    last30DaysDecExpenses = '';
    last30DaysOrdExpenses = "";
    wallets = [];

    static get API_PATH() {
        return '/xboard/users';
    }

    constructor({ firstName, lastName, phoneNumber, phoneOperator, clientCode, email, wallets, last30DaysDecExpenses, last30DaysOrdExpenses }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.phoneOperator = phoneOperator;
        this.clientCode = clientCode;
        this.email = email;
        this.last30DaysOrdExpenses = last30DaysOrdExpenses;
        this.last30DaysDecExpenses = last30DaysDecExpenses;
        wallets.forEach(wallet => {
            this.wallets.push(new Wallet(wallet));
        })
    }

    get fullName() {
        if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`;
        if (this.firstName && !this.lastName) return this.firstName;
        return this.email;
    }

    static createDefault() {
        return new User({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            phoneOperator: '',
            clientCode: '',
            email: '',
            last30: '',
            wallets: []
        })
    }

    static async fetchUserProfile(clientCode) {
        let user;

        await adapter({
            url: `${User.API_PATH}/${clientCode}/profile/`,
        }).then(res => {
            user = new User(res);
        });

        return user;
    }
}
