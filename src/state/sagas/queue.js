import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_QUEUE, ADD_TO_QUEUE, MOVE_QUEUE_ITEM_TO_DONE } from 'state/reducers/queue/types';
import { fetchQueueSuccess } from 'state/reducers/queue/actions';
import { TOAST_TYPES, TOAST_MESSAGES } from 'helpers/constants';
import { NotifyType } from 'utils/NotifyType';
import Queue from 'models/Queue';

function* workerFetchQueue() {
    try {
        const response = yield call(Queue.fetchList);
        yield put(fetchQueueSuccess(response));
    } catch(error){
        // console.error(error);
    } finally {
    }
}

function* workerAddToQueue({ payload }) {
    const { ids, successCallback, defaultCallback } = payload;
    try {
        const response = yield call(Queue.addToQueue, ids);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.MOVED_TO_PICKUP);
        yield successCallback(response.queueNumber);
        yield defaultCallback();
    } catch(error){
        yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR);
        yield defaultCallback();
    } finally {
    }
}

function* workerMoveToDone({ payload }) {
    const { id, successCallback, defaultCallback } = payload;
    try {
        yield call(Queue.moveToDone, id);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.MOVED_TO_DONE);
        yield successCallback();
    } catch(error){
        yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR);
        yield defaultCallback();
    } finally {
    }
}

function* queueActions() {
    yield takeLatest(FETCH_QUEUE, workerFetchQueue);
    yield takeLatest(ADD_TO_QUEUE, workerAddToQueue);
    yield takeLatest(MOVE_QUEUE_ITEM_TO_DONE, workerMoveToDone);
}

export default queueActions;