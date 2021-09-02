import { combineReducers } from 'redux';

//reducers
import loading from './loading';
import statuses from './status';
import autocomplete from './autocomplete';
import user from './user';
import countries from './country';
import currencies from './currency';
import warehouses from './warehouse';
import paydesk from './paydesk';
import choices from './choice';
import warehouseItems from './warehousePage';
import productTypes from './productType';
import assignedOrders from './assignedOrder';
import declaration from './declaration';
import operator from './operator';
import order from './order';
import queue from './queue';
import bags from './bag';

export default combineReducers({
    loading,
    statuses,
    autocomplete,
    user,
    countries,
    currencies,
    warehouses,
    paydesk,
    choices,
    warehouseItems,
    productTypes,
    assignedOrders,
    declaration,
    operator,
    order,
    queue,
    bags,
});
