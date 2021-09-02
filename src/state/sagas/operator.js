import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_OPERATOR_PROFILE, FETCH_OPERATORS } from 'state/reducers/operator/types';
import { fetchOperatorProfileSuccess, fetchOperatorsSuccess } from 'state/reducers/operator/actions';
import Operator from 'models/Operator';

function* workerFetchOperatorProfile() {
    try {
        const response = yield call(Operator.fetchOperatorProfile);
        yield put(fetchOperatorProfileSuccess(response));
    } catch(error){
        // console.error(error);
    } finally {
    }
}

function* workerFetchOperators() {
    try {
        const response = yield call(Operator.fetchList);
        yield put(fetchOperatorsSuccess(response));
    } catch(error){
    } finally {
    }
}

function* operatorActions() {
    yield takeLatest(FETCH_OPERATOR_PROFILE, workerFetchOperatorProfile);
    yield takeLatest(FETCH_OPERATORS, workerFetchOperators);
}

export default operatorActions;