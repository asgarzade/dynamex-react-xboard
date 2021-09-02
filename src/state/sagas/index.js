import { spawn, call, all, delay } from "redux-saga/effects";
import fetchAutocompleteUsers from './autocomplete';
import fetchCountries from './country';
import fetchCurrencies from './currency';
import userActions from './user';
import fetchStatuses from './status';
import fetchWarehouses from './warehouse';
import fetchPayDeskItems from './paydesk';
import fetchChoices from './choice';
import fetchWarehouseItems from './warehousePage';
import fetchProductTypes from './productType';
import assignedOrderActions from './assignedOrders';
import declaration from './declaration';
import operatorActions from './operator';
import orderActions from './order';
import queueActions from "./queue";
import fetchBags from './bag';

const makeRestartable = saga => {
    return function* () {
        yield spawn(function* () {
            while (true) {
                try {
                    yield call(saga);
                } catch (e) {
                    console.error("Saga error, the saga will be restarted", e);
                }
                yield delay(1000);
            }
        });
    };
};

const rootSagas = [
    fetchAutocompleteUsers,
    userActions,
    fetchCountries,
    fetchCurrencies,
    fetchStatuses,
    fetchWarehouses,
    fetchPayDeskItems,
    fetchChoices,
    fetchWarehouseItems,
    fetchProductTypes,
    assignedOrderActions,
    declaration,
    operatorActions,
    orderActions,
    queueActions,
    fetchBags,
].map(makeRestartable);

export default function* rootSaga() {
    yield all(rootSagas.map(saga => call(saga)));
}
