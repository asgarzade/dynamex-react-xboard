import React from 'react';
import { connect } from 'react-redux';
import { round } from 'helpers/functions';

const staticText = {
    trackingCode: 'Tracking code',
    link: 'Link',
    color: 'Color',
    price: 'Price',
    quantity: 'Qty',
    cargo: 'Cargo',
    size: 'Size',
    total: 'Total',
};

const MiniOrdersTable = props => {
    // from props
    const { orders, className } = props;
    // from state
    const { currencies } = props;

    const getCurrencySymbol = id => {
        const currency = currencies.find(currency => currency.id === id);

        if (currency) return currency.symbol;
    };

    return (
        <div className={`tabular ${className}`}>
            <table className='m-0'>
                <thead>
                    <tr>
                        <th>
                            <div className="text">
                                <span>{staticText.link}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.color}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.size}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.quantity}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.price}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.cargo}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.total}</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    orders.map((order, index) => (
                        <tr key={index}>
                            <td><a
                                className={'table-link'}
                                href={order.productUrl}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                            >
                                {order.productUrl}
                            </a></td>
                            <td>{order.productColor}</td>
                            <td>{order.productSize}</td>
                            <td>
                                {
                                    order.productQuantity === order.realProductQuantity ?
                                        <span>{order.productQuantity}</span> :
                                        <>
                                            <span className={'strikethrough'}>{order.productQuantity}</span>
                                            <br/>
                                            <span>{order.realProductQuantity}</span>
                                        </>
                                }
                            </td>
                            <td>
                                {
                                    parseFloat(order.productPrice) === parseFloat(order.realProductPrice) ?
                                        <span>{order.productPrice} {getCurrencySymbol(order.productPriceCurrency)}</span> :
                                        <>
                                            <span className={'strikethrough'}>{order.productPrice} {getCurrencySymbol(order.productPriceCurrency)}</span>
                                            <br/>
                                            <span>{order.realProductPrice} {getCurrencySymbol(order.productPriceCurrency)}</span>
                                        </>
                                }
                            </td>
                            <td>
                                {
                                    parseFloat(order.cargoPrice) === parseFloat(order.realCargoPrice) ?
                                        <span>{order.cargoPrice} {getCurrencySymbol(order.cargoPriceCurrency)}</span> :
                                        <>
                                            <span className={'strikethrough'}>{order.cargoPrice} {getCurrencySymbol(order.cargoPriceCurrency)}</span>
                                            <br/>
                                            <span>{order.realCargoPrice} {getCurrencySymbol(order.cargoPriceCurrency)}</span>
                                        </>
                                }
                            </td>
                            <td>
                                {
                                    !order.remainderPrice ?
                                    <span>{order.totalPrice} {getCurrencySymbol(order.totalPriceCurrency)}</span> :
                                    <>
                                        <span className={'strikethrough'}>{order.totalPrice} {getCurrencySymbol(order.totalPriceCurrency)}</span>
                                        <br/>
                                        <span>{round(parseFloat(order.totalPrice) + parseFloat(order.remainderPrice), 2)} {getCurrencySymbol(order.totalPriceCurrency)}</span>
                                    </>
                                }
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
};

const mapStateToProps = state => ({
    statuses: state.statuses.declarationStatuses,
    warehouses: state.warehouses,
    currencies: state.currencies,
});

export default connect(mapStateToProps)(MiniOrdersTable);