import React from 'react';
import { connect } from 'react-redux';

const staticText = {
    trackingCode: 'Tracking code',
    weight: 'Weight',
    kg: 'kg',
    productPrice: 'Product price',
    deliveryCost: 'Delivery cost',
    penaltyCost: 'Penalty cost',
    totalCost: 'Total cost',
    none: 'None',
};

const MiniDeclarationsTable = props => {
    // from props
    const { declarations, className } = props;
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
                                <span>{staticText.trackingCode}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.weight}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.productPrice}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.deliveryCost}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.penaltyCost}</span>
                            </div>
                        </th>
                        <th>
                            <div className="text">
                                <span>{staticText.totalCost}</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    declarations.map((declaration, index) => (
                        <tr key={index}>
                            <td>{declaration.trackingCode}</td>
                            <td>{declaration.weight} {staticText.kg}</td>
                            <td>{declaration.productPrice} {getCurrencySymbol(declaration.productPriceCurrency)}</td>
                            <td>{declaration.deliveryCost} {getCurrencySymbol(declaration.deliveryCostCurrency)}</td>
                            <td>{declaration.penaltyCost} {getCurrencySymbol(declaration.penaltyCostCurrency)}</td>
                            <td>{declaration.totalPrice} {getCurrencySymbol(declaration.totalPriceCurrency)}</td>
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

export default connect(mapStateToProps)(MiniDeclarationsTable);