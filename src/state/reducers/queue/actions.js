import { FETCH_QUEUE, FETCH_QUEUE_SUCCESS, ADD_TO_QUEUE, MOVE_QUEUE_ITEM_TO_DONE } from './types';

export const fetchQueue = () => ({
    type: FETCH_QUEUE,
});
export const fetchQueueSuccess = (data) => ({
    type: FETCH_QUEUE_SUCCESS,
    payload: {
        data
    }
});

export const addToQueue = (payload) => ({
    type: ADD_TO_QUEUE,
    payload
});
export const moveQueueItemToDone = (payload) => ({
    type: MOVE_QUEUE_ITEM_TO_DONE,
    payload
});
