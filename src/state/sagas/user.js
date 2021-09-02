import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_USER_PROFILE, UPDATE_BALANCE } from 'state/reducers/user/types';
import { fetchUserProfileSuccess, updateBalanceSuccess } from 'state/reducers/user/actions';
import { setUserLoading } from 'state/reducers/loading/actions';
import { TOAST_TYPES, TOAST_MESSAGES } from 'helpers/constants';
import { NotifyType } from 'utils/NotifyType';
import User from 'models/User';
import Wallet from 'models/Wallet';

function* workerFetchUserProfile({ payload }) {
    yield put(setUserLoading(true));
    try {
        const response = yield call(User.fetchUserProfile, payload.clientCode);
        yield put(fetchUserProfileSuccess(response));
    } catch(error){
        console.error(error);
    } finally {
        yield put(setUserLoading(false));
    }
}

function* workerUpdateBalance({ payload }) {
    const { data, errorCallback, successCallback } = payload;
    try {
        const response = yield call(Wallet.updateBalance, data);
        if (response.succeed) {
            yield put(updateBalanceSuccess({
                ...response,
                operation: data.action
            }));
            successCallback();
            yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.BALANCE_UPDATED);
        } else {
            errorCallback();
            // yield put(updateBalanceError(true));
            yield NotifyType(TOAST_TYPES.ERROR, response.detail || TOAST_MESSAGES.GENERIC_ERROR);
        }
    } catch(error){
        // yield put(updateBalanceError(true));
        if (error.data && error.data.amount) {
            yield NotifyType(TOAST_TYPES.ERROR, error.data.amount[0]);
        }
        errorCallback();
    } finally {
    }
}

function* userActions() {
    yield takeLatest(FETCH_USER_PROFILE, workerFetchUserProfile);
    yield takeLatest(UPDATE_BALANCE, workerUpdateBalance);
}

export default userActions;