import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { payOrder } from 'state/reducers/order/actions';
import Currency from 'models/Currency';
import { round } from 'helpers/functions';
import MiniOrdersTable from "views/components/OrdersTable/MiniOrdersTable";
import TextInput from 'views/components/Form/TextInput';

const staticText = {
    refundTitle: 'Refund Excess Payment',
    payTitle: 'Pay Order Remainder',
    selectPlaceholder: 'Choose...',
    balance: 'Balance',
    methodLabel: 'Payment Type:',
    currencyLabel: 'Currency:',
    // purposeLabel: 'Purpose:',
    amountLabel: 'Amount:',
    // markAsDoneLabel: 'Mark as Done:',
    closeBtn: 'Close',
    payBtn: 'Pay',
    refundBtn: 'Refund',
    errorMessage: 'Operation failed!',
    amount: 'Amount',
    remainderAmount: 'Paid remainder amount',
};

class PaymentModal extends React.Component {
    state = {
        isModalOpen: this.props.isModalOpen,
        loading: false,
        baseCurrency: {},
        otherCurrencies: [],
        balances: [],
        totalInBaseCurrency: 0,
        totalInText: '',
        orderTotalCurrency: 0,
        refundTypes: [],
    };

    componentDidMount() {
        const { currencies, user, order } = this.props;

        const baseCurrency = currencies.find(currency => currency.isBase) || Currency.createDefault();
        const otherCurrencies = currencies.filter(currency => !currency.isBase);
        const balances = user.wallets.map(wallet => (
            `${staticText.balance} (${wallet.currency.code}): ${wallet.amount} ${wallet.currency.symbol} (${round(wallet.amount * wallet.currency.rate, 2)} ${baseCurrency.code})`
        ));
        const orderTotalCurrency = currencies.find(currency => currency.id === order.totalPriceCurrency);
        const totalAmount = round(parseFloat(order.totalPrice) + parseFloat(order.remainderPrice), 2)
        const totalInBaseCurrency = round(totalAmount * parseFloat(orderTotalCurrency.rate), 2);
        const totalInText = `${totalAmount} ${orderTotalCurrency?.symbol}
            ${baseCurrency.id !== order.totalPriceCurrency ? ` / ${totalInBaseCurrency} ${baseCurrency.symbol}` : ''}`;
        const totalRemainder = `${order.paidRemainderAmount} ${orderTotalCurrency?.symbol}
            ${baseCurrency.id !== order.totalPriceCurrency ? ` / ${order.paidRemainderAmountInBaseCurrency} ${baseCurrency.symbol}` : ''}`;

        this.setState({
            baseCurrency,
            otherCurrencies,
            balances,
            totalInText,
            totalRemainder,
            orderTotalCurrency,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (!isEqual(prevState.form, this.state.form)) {
        //     const { method } = this.state.form;
        //
        //     const requiredItems = {
        //         method
        //     };
        //
        //     const requiredFormItems = Object.entries(requiredItems);
        //     const isFormComplete = requiredFormItems.every(([ ,value]) =>  value);
        //
        //     this.setState({ isFormComplete });
        // }
    }

    handleFormSubmit = id => {
        this.setState({ loading: true })
        this.props.payOrder({
            id,
            successCallback: this.props.onSuccess,
            defaultCallback: this.setState({ loading: false })
        })
    };

    render() {
        const { isModalOpen, loading, baseCurrency, otherCurrencies,
            orderTotalCurrency, totalInText, balances, totalRemainder } = this.state;
        const { onClose, user, order } = this.props;
        const isMoreThanZero = parseFloat(order.remainderPrice) > 0;

        return (
            <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>{isMoreThanZero ? staticText.payTitle : staticText.refundTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-5 py-4'>
                    <div className="row border rounded mb-3 overflow-hidden m-0">
                        {
                            otherCurrencies.map((currency, index) => (
                                <div className="col py-3" key={index}>
                                    <h6>{currency.name}</h6>
                                    <p className='m-0'>1 {currency.code} = {currency.rate} {baseCurrency.code}</p>
                                </div>
                            ))
                        }
                    </div>
                    <MiniOrdersTable orders={[order]} className={'mb-4'}/>
                    <div className='row mb-5'>
                        <div className='col-6'>
                            <h6>#{user.clientCode} {user.fullName}:</h6>
                            <ul className='list-unstyled m-0'>
                                { balances.map((balance, index) => (
                                    <li key={index} className={'mt-1 small font-weight-bold text-info'}>{balance}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='col-6 text-right'>
                            <strong className='mr-1'>{staticText.amount}: </strong>
                            <span>{totalInText}</span>
                            <br/>
                            <strong className='mr-1'>{staticText.remainderAmount}: </strong>
                            <span>{totalRemainder}</span>
                        </div>
                    </div>
                    <form>
                        <TextInput
                            name={'amount'}
                            disabled={true}
                            label={staticText.amountLabel}
                            value={round(order.remainderPrice - order.paidRemainderAmount, 2)}
                            required={true}
                        />
                        <TextInput
                            name={'currency'}
                            disabled={true}
                            label={staticText.currencyLabel}
                            value={orderTotalCurrency.name || ''}
                            required={true}
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={onClose}>{staticText.closeBtn}</button>
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={() => this.handleFormSubmit(order.id)}
                        disabled={loading}
                    >
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        {isMoreThanZero ? staticText.payBtn : staticText.refundBtn}
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    currencies: state.currencies,
    choices: state.choices,
});

export default connect(mapStateToProps, { payOrder })(PaymentModal);