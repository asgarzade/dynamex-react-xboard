import { statusesState } from './reducers/status';
import { countriesState } from './reducers/country';
import { currenciesState } from './reducers/currency';
import { autocompleteState } from './reducers/autocomplete';
import { userState } from './reducers/user';
import { warehousesState } from './reducers/warehouse';
import { paydeskState } from './reducers/paydesk';
import { choicesState } from './reducers/choice';
import { warehouseItemsState } from './reducers/warehousePage';
import { productTypesState } from './reducers/productType';
import { declarationState } from './reducers/declaration';
import { loadingState } from "./reducers/loading";
import { assignedOrdersState } from './reducers/assignedOrder';
import { operatorState } from "./reducers/operator";
import { orderState } from "./reducers/order";
import { queueState } from "./reducers/queue";
import { bagsState } from './reducers/bag';

export default {
    statuses: statusesState,
    countries: countriesState,
    currencies: currenciesState,
    autocomplete: autocompleteState,
    user: userState,
    warehouses: warehousesState,
    paydesk: paydeskState,
    choices: choicesState,
    warehouseItems: warehouseItemsState,
    productTypes: productTypesState,
    declaration: declarationState,
    loading: loadingState,
    assignedOrders: assignedOrdersState,
    operator: operatorState,
    order: orderState,
    queue: queueState,
    bags: bagsState,
}