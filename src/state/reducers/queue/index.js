import { FETCH_QUEUE_SUCCESS } from './types';

export const queueState = {
    queueItems: [],
};

export default (state = queueState, { type, payload }) => {
    switch (type) {
        case FETCH_QUEUE_SUCCESS:
            return { ...state, queueItems: payload.data };
        default:
            return state;
    }
}