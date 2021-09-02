import adapter from 'adapter';
/**
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} clientCode
 * @property {string} email
 * @property {number} assignedCountries
 * @property {boolean} isAdmin
 * @property {boolean} isSuperuser
 * @property {string} permissions
 */
export default class Operator {
    firstName = "";
    lastName = "";
    clientCode = "";
    email = "";
    assignedCountries = [];
    isAdmin = false;
    isSuperuser = false;
    permissions = [];

    static get API_PATH() {
        return '/xboard/operator';
    }

    get fullName() {
        if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`;
        if (this.firstName && !this.lastName) return this.firstName;
        return this.email;
    }

    get canChangeOperator() {
        return this.isSuperuser || this.permissions.includes('can_change_operator');
    }
    get canAddComment() {
        return this.isSuperuser || this.permissions.includes('add_orderassignmentcomment');
    }
    get canRefundOrders() {
        return this.isSuperuser || this.permissions.includes('can_refund_orders');
    }
    get canChangeAssignmentStatus() {
        return this.isSuperuser || this.permissions.includes('can_change_assignment_status');
    }
    get canChangeOrderStatus() {
        return this.isSuperuser || this.permissions.includes('can_change_order_status');
    }
    get canChangeDeclarationStatus() {
        return this.isSuperuser || this.permissions.includes('can_change_declaration_status');
    }
    get canEditOrder() {
        return this.isSuperuser || this.permissions.includes('change_order');
    }
    get canEditDeclaration() {
        return this.isSuperuser || this.permissions.includes('change_declaration');
    }
    get canViewOrder() {
        return this.isSuperuser || this.permissions.includes('view_order');
    }
    get canViewDeclaration() {
        return this.isSuperuser || this.permissions.includes('view_declaration');
    }
    get canCreateDeclaration() {
        return this.isSuperuser || this.permissions.includes('add_declaration');
    }
    get canPayDeclaration() {
        return this.isSuperuser || this.permissions.includes('can_pay_declarations');
    }
    get canPayRemainder() {
        return this.isSuperuser || this.permissions.includes('can_pay_remainder');
    }
    get canMakeBalanceOperations() {
        return this.isSuperuser || this.permissions.includes('can_do_balance_operations');
    }

    constructor({ firstName, lastName, clientCode, email, assignedCountries, isAdmin, permissions, isSuperuser }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.clientCode = clientCode;
        this.email = email;
        this.isAdmin = isAdmin;
        this.assignedCountries = assignedCountries;
        this.permissions = permissions;
        this.isSuperuser = isSuperuser;
    }

    static createDefault() {
        return new Operator({
            firstName: '',
            lastName: '',
            clientCode: '',
            email: '',
            isAdmin: false,
            assignedCountries: [],
            permissions: [],
        })
    }

    static async fetchList() {
        let operators = [];

        await adapter({
            url: `${Operator.API_PATH}s`,
        }).then(res => {
            res.forEach(item => operators.push(new Operator(item)));
        });

        return operators;
    }

    static async fetchOperatorProfile() {
        let operator;

        await adapter({
            url: `${Operator.API_PATH}/profile/`,
        }).then(res => {
            operator = new Operator(res)
        });

        return operator;
    }
}
