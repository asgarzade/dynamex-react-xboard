import { put, takeLatest, call } from 'redux-saga/effects'
import { CREATE_DECLARATION, EDIT_DECLARATION, PAY_DECLARATIONS, CHANGE_DECLARATION_STATUS, FETCH_SINGLE_DECLARATION } from 'state/reducers/declaration/types';
import { createDeclarationSuccess, createDeclarationError, fetchSingleDeclarationSuccess } from 'state/reducers/declaration/actions';
import Declaration from 'models/Declaration';
import { TOAST_TYPES, TOAST_MESSAGES } from 'helpers/constants';
import { NotifyType } from 'utils/NotifyType';

function* workerCreateDeclaration({ payload }) {
    const { data, defaultCallback, successCallback, forOrders } = payload;
    try {
        const response = yield call(Declaration.createDeclaration, data, forOrders);
        yield put(createDeclarationSuccess(response));
        yield successCallback(response.id);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.DECLARATION_CREATED);
    } catch(error){
        if (error.status < 500 && error.status >= 400) {
            yield put(createDeclarationError(error.data))
        }
        else {
            yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR)
        }
        yield defaultCallback();
    } finally {

    }
}

function* workerEditDeclaration({ payload }) {
    const { id, data, defaultCallback, successCallback } = payload;
    try {
        const response = yield call(Declaration.editDeclaration, id, data);
        yield put(createDeclarationSuccess(response));
        yield successCallback(response.id);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.DECLARATION_SAVED);
    } catch(error){
        if (error.status < 500 && error.status >= 400) {
            yield put(createDeclarationError(error.data))
        }
        else {
            yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR)
        }
        yield defaultCallback();
    } finally {

    }
}

function* workerPayDeclarations({ payload }) {
    const { data, defaultCallback, successCallback } = payload;
    try {
        const responseList = yield call(Declaration.payDeclarations, data);
        let hasPaymentSucceeded = false;
        responseList.forEach(response => {
            if (response.succeed) {
                hasPaymentSucceeded = true;
                NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.PAYMENT_COMPLETED);
            } else {
                NotifyType(TOAST_TYPES.ERROR, response.detail);
            }
        });
        if (hasPaymentSucceeded) yield successCallback();
        else yield defaultCallback();
    } catch(error){
        yield defaultCallback();
    } finally {

    }
}

function* workerChangeDeclarationStatus({ payload }) {
    const { items, action, successCallback } = payload;
    try {
        const response = yield call(Declaration.changeDeclarationStatus, items, action);
        if (response.count > 0) {
            yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.DECLARATION_DONE);
            yield successCallback();
        }
    } catch (error) {
        yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR)
    } finally {

    }
}

function* workerFetchSingleDeclaration({ payload }) {
    try {
        const response = yield call(Declaration.fetchSingle, payload.id);
        yield put(fetchSingleDeclarationSuccess(response));
    } catch(error){

    } finally {

    }
}

function* declaration() {
    yield takeLatest(CREATE_DECLARATION, workerCreateDeclaration);
    yield takeLatest(EDIT_DECLARATION, workerEditDeclaration);
    yield takeLatest(PAY_DECLARATIONS, workerPayDeclarations);
    yield takeLatest(CHANGE_DECLARATION_STATUS, workerChangeDeclarationStatus);
    yield takeLatest(FETCH_SINGLE_DECLARATION, workerFetchSingleDeclaration)
}

export default declaration;