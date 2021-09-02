import React from 'react';
import { connect } from 'react-redux';
import {isEmpty, round} from 'helpers/functions';

const staticText = {
    title: 'Declaration Saved',
    clientCode: 'Client code',
    clientName: 'Client name',
    trackingCode: 'Tracking code',
    price: 'Price',
    weight: 'Weight',
    kg: 'kg',
    printInvoice: 'Print Invoice',
    printBill: 'Print Airway Bill',
    printSticker: 'Print Sticker',
    error: 'Something went wrong'
};
const baseUrl = '/labmin/fulfillment/declaration/';

const getPriceDetails = (declaration, currencies) => {
    let price = '';

    if (!isEmpty(declaration) && currencies.length) {
        const {totalPrice, totalPriceCurrency} = declaration;
        const baseCurrency = currencies.find(currency => currency.isBase);

        if (totalPriceCurrency === baseCurrency.id) {
            price = totalPrice + baseCurrency.symbol
        } else {
            const itemCurrency = currencies.find(currency => currency.id === totalPriceCurrency);
            price = `${totalPrice} ${itemCurrency.symbol} (${round(totalPrice * itemCurrency.rate, 2)} ${baseCurrency.symbol})`
        }
    }

    return price;
};

const PrintingBoard = props => {

    const { user, className, declaration, currencies, id } = props;

    return (
        !isEmpty(declaration) ?
            parseInt(id) !== declaration.id ?
                <div className={`alert alert-danger ${className}`}>{staticText.error}</div>
                :
                <div className={`alert alert-success ${className}`}>
                    <h5>{staticText.title}</h5>
                    <hr />
                    <div className={'row'}>
                        <div className={'col-4'}>
                            <ul className={'list-unstyled m-0'}>
                                <li><span className={'font-weight-500'}>{staticText.clientName}</span>: {user.fullName}</li>
                                <li><span className={'font-weight-500'}>{staticText.clientCode}</span>: {user.clientCode}</li>
                            </ul>
                        </div>
                        <div className={'col-4'}>
                            <ul className={'list-unstyled m-0'}>
                                <li><span className={'font-weight-500'}>{staticText.trackingCode}</span>: {declaration.trackingCode}</li>
                                <li><span className={'font-weight-500'}>{staticText.price}</span>: {getPriceDetails(declaration, currencies)}</li>
                                <li><span className={'font-weight-500'}>{staticText.weight}</span>: {declaration.weight} {staticText.kg}</li>
                            </ul>
                        </div>
                        <div className={'col-4'}>
                            <a
                                className={'btn btn-success mb-1 mr-1'}
                                href={`${baseUrl}${declaration.id}/invoice`}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                            >
                                Print Invoice
                            </a>
                            <a
                                className={'btn btn-success mb-1 mr-1'}
                                href={`${baseUrl}${declaration.id}/airway`}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                            >
                                Print Airway Bill
                            </a>
                            <a
                                className={'btn btn-success mb-1 mr-1'}
                                href={`${baseUrl}${declaration.id}/sticker`}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                            >
                                Print Sticker
                            </a>
                        </div>
                    </div>
                </div>
            : ''
    )
}

const mapStateToProps = state => ({
    user: state.user.userProfile,
    currencies: state.currencies,
});

export default connect(mapStateToProps)(PrintingBoard);