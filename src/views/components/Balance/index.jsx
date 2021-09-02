import React from 'react';
import './index.scss';

const Balance = props => {
    let { wallet } = props;

    return (
        <div className='balance-card'>
            Balance ({wallet.currency.code}): {wallet.amount} {wallet.currency.symbol}
        </div>
    )
}

export default Balance;