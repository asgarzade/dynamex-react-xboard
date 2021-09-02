import { FETCH_BAGS, FETCH_BAGS_SUCCESS } from "./types";

export const fetchBags = () => ({
    type: FETCH_BAGS
})

export const fetchBagsSuccess = bags => ({
    type: FETCH_BAGS_SUCCESS,
    payload: {
        bags
    }
})