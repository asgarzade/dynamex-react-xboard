import adapter from 'adapter';
/**
 * @property {number} id
 * @property {string} type
 * @property {string} name
 * @property {boolean} isShownByDefault
 * @property {boolean} canBePayedFromPaydesk
 * @property {string} level
 */
export default class Status {
    id = 0;
    type = '';
    name = '';
    isShownByDefault = false;
    canBePayedFromPaydesk = false;
    level = '';

    static get API_PATH() {
        return '/xboard/statuses/';
    }

    constructor({ id, type, name, isShownByDefault, canBePayedFromPaydesk, level }) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.isShownByDefault = isShownByDefault;
        this.canBePayedFromPaydesk = canBePayedFromPaydesk;
        this.level = level;
    }

    static async fetchOrderStatuses(panel) {
        const statuses = [];

        await adapter({
            url: `${Status.API_PATH}`,
            params: {
                type: 'order',
                panel
            },
        }).then(response => {
            response.forEach(element => {
                statuses.push(new Status(element));
            });
        });

        return statuses;
    }
    static async fetchAssignedOrderStatuses() {
        const statuses = [];

        await adapter({
            url: `${Status.API_PATH}`,
            params: {
                type: 'orderassignment',
            },
        }).then(response => {
            response.forEach(element => {
                statuses.push(new Status(element));
            });
        });

        return statuses;
    }


    static async fetchDeclarationStatuses(panel) {
        const statuses = [];

        await adapter({
            url: `${Status.API_PATH}`,
            params: {
                type: 'declaration',
                panel
            },
        }).then(response => {
            response.forEach(element => {
                statuses.push(new Status(element));
            });
        });

        return statuses;
    }
}