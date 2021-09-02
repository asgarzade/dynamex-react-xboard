import { FETCH_USER_PROFILE_SUCCESS, UPDATE_BALANCE_SUCCESS } from './types';
import User from 'models/User';
import { round } from 'helpers/functions';

export const userState = {
    userProfile: User.createDefault(),
    hasError: false
};

export default (state = userState, { type, payload }) => {
    switch (type) {
        case FETCH_USER_PROFILE_SUCCESS:
            return { ...state, userProfile: payload.user };   
        case UPDATE_BALANCE_SUCCESS:
            return { 
                ...state, 
                hasError: false,
                userProfile: {
                    ...state.userProfile,
                    wallets: getNewWallet(state.userProfile.wallets, payload.balanceReport)
                } 
            };
        // I decided not to use these, and just show errors via toast
        // case BALANCE_ERROR_TRUE:
        //     return { ...state, hasError: true };
        // case BALANCE_ERROR_FALSE:
        //     return { ...state, hasError: false };
        default:
            return state;
    }
}

function getNewWallet(wallets, report) {
    const updatedWallet = wallets.find(wallet => wallet.currency.id === report.currency)
    
    switch (report.operation) {
        case 'add':
            updatedWallet.amount = round(parseFloat(updatedWallet.amount) + parseFloat(report.amount), 2);
            break;
        case 'refund':
            updatedWallet.amount = round(parseFloat(updatedWallet.amount) - parseFloat(report.amount), 2);
            break;
        default:
            break;
    }
    return wallets;
}