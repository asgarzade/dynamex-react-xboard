import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { payDeclarations } from 'state/reducers/declaration/actions';
import Currency from 'models/Currency';
import { round } from 'helpers/functions';
import MiniDeclarationsTable from "views/components/DeclarationsTable/MiniDeclarationsTable";
import GenericInput from 'views/components/Form/GenericInput';
import TextInput from 'views/components/Form/TextInput';
// import CheckBox from 'views/components/Form/CheckBox';
import { isEqual } from 'lodash';

const staticText = {
    modalTitle: 'Pay Declarations',
    selectPlaceholder: 'Choose...',
    balance: 'Balance',
    methodLabel: 'Payment Type:',
    currencyLabel: 'Currency:',
    // purposeLabel: 'Purpose:',
    amountLabel: 'Amount:',
    // markAsDoneLabel: 'Mark as Done:',
    closeBtn: 'Close',
    saveBtn: 'Save',
    errorMessage: 'Operation failed!',
    amount: 'Amount',
};
// Fixes the overlapping problem of the component
const reactSelectStyle = {
    menu: provided => ({ ...provided, zIndex: 9999 })
};

class PaymentModal extends React.Component {
    state = {
        isModalOpen: this.props.isModalOpen,
        isFormComplete: true,
        // markAsDone: false,
        loading: false,
        form: {
            user: '',
            currency: '',
            declarations: [],
            method: '',
        },
        baseCurrency: {},
        otherCurrencies: [],
        userName: '',
        balances: [],
        paymentMethods: [],
        totalCosts: [],
        totalInBaseCurrency: '',
    };

    componentDidMount() {
        const { currencies, user, choices, declarations } = this.props;

        const baseCurrency = currencies.find(currency => currency.isBase) || Currency.createDefault();
        const otherCurrencies = currencies.filter(currency => !currency.isBase);
        const userName = `${user.fullName}`;
        const balances = user.wallets.map(wallet => (
            `${staticText.balance} (${wallet.currency.code}): ${wallet.amount} ${wallet.currency.symbol} (${round(wallet.amount*wallet.currency.rate, 2)} ${baseCurrency.code})`
        ));
        const paymentMethods = [];
        for (let [value, label] of Object.entries(choices.paymentMethods)) {
            paymentMethods.push({
                value,
                label
            });
        }

        const form = {
            user: user.clientCode,
            currency: baseCurrency,
            declarations: declarations.map(declaration => declaration.id),
            method: '',
        };

        this.setTotalAmount(declarations, currencies, baseCurrency);

        this.setState({
            baseCurrency,
            otherCurrencies,
            userName,
            balances,
            paymentMethods,
            form,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!isEqual(prevState.form, this.state.form)) {
            const { method } = this.state.form;

            const requiredItems = {
                method
            };

            const requiredFormItems = Object.entries(requiredItems);
            const isFormComplete = requiredFormItems.every(([ ,value]) =>  value);

            this.setState({ isFormComplete });
        }
    }

    setTotalAmount = (declarations, currencies, baseCurrency) => {
        const costs = [];

        currencies.forEach(currency => {
            const filteredDeclarations = declarations.filter(declaration => currency.id === declaration.totalPriceCurrency);
            if (filteredDeclarations.length) {
                const amount = filteredDeclarations.reduce((sum, item) => round(parseFloat(sum) + parseFloat(item.totalPrice), 2), 0);
                costs.push({
                    ...currency,
                    amount,
                    amountInBaseCurrency: round(amount * currency.rate, 2)
                })
            }
        });

        const totalInBaseCurrency = round(costs.reduce((sum, item) => sum + item.amountInBaseCurrency, 0), 2);

        const totalCosts = costs.map(item => (
            item.isBase ?
                `${item.amount}${item.symbol}`
                :
                `${item.amount}${item.symbol} (${round(item.amount * item.rate, 2)}${baseCurrency.symbol})`
        ));

        this.setState({
            totalInBaseCurrency,
            totalCosts,
        });
    };

    handleFormSubmit = () => {
        const { user, currency, declarations, method } = this.state.form;
        const { onSuccess } = this.props;

        const formData = {
            user,
            currency: currency.id,
            declarations,
            method: method.value
        };

        this.setState({ loading: true });

        this.props.payDeclarations({
            data: formData,
            defaultCallback: () => this.setState({ loading: false }),
            successCallback: onSuccess,
            // markAsDone: this.state.markAsDone,
        })
    };

    onSelectChange = (selectName, value) => {
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                [selectName]: value
            }
        }))
    };

    // handleCheckboxChange = e => {
    //     const targetName = e.target.name;
    //     const checked = e.target.checked;
    //
    //     this.setState({ [targetName]: checked })
    // };

    render() {
        const { isModalOpen, isFormComplete, loading, baseCurrency, totalInBaseCurrency, totalCosts,
            otherCurrencies, balances, userName, paymentMethods, form } = this.state;
        const { onClose, user, declarations } = this.props;

        return (
            <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>{staticText.modalTitle}</Modal.Title>
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
                    <MiniDeclarationsTable declarations={declarations} className={'mb-4'}/>
                    <div className='row mb-5'>
                        <div className='col-6'>
                            <h6>#{user.clientCode} {userName}:</h6>
                            <ul className='list-unstyled m-0'>
                                { balances.map((balance, index) => (
                                    <li key={index} className={'mt-1 small font-weight-bold text-info'}>{balance}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='col-6 d-flex justify-content-end'>
                            <strong className='mr-1'>{staticText.amount}: </strong>
                            <ul className='list-unstyled m-0 text-right'>
                                {
                                    totalCosts.map((cost, index) => (
                                        <li key={index}>{cost}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <form>
                        <GenericInput
                            label={staticText.methodLabel}
                            name={'method'}
                            required={true}
                        >
                            <Select
                                isClearable={false}
                                styles={reactSelectStyle}
                                inputId={'method'}
                                options={paymentMethods}
                                onChange={(value) => this.onSelectChange('method', value)}
                                placeholder={staticText.selectPlaceholder}
                                value={form.method}
                            />
                        </GenericInput>
                        <TextInput
                            name={'amount'}
                            disabled={true}
                            label={staticText.amountLabel}
                            value={totalInBaseCurrency}
                            required={true}
                        />
                        <TextInput
                            name={'currency'}
                            disabled={true}
                            label={staticText.currencyLabel}
                            value={form.currency.name || ''}
                            required={true}
                        />
                        {/*<CheckBox*/}
                        {/*    onChange={this.handleCheckboxChange}*/}
                        {/*    name={'markAsDone'}*/}
                        {/*    label={staticText.markAsDoneLabel}*/}
                        {/*    isChecked={markAsDone}*/}
                        {/*/>*/}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={onClose}>{staticText.closeBtn}</button>
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={this.handleFormSubmit}
                        disabled={!isFormComplete || loading}
                    >
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        {staticText.saveBtn}
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    currencies: state.currencies,
    user: state.user.userProfile,
    hasError: state.user.hasError,
    choices: state.choices,
});

export default connect(mapStateToProps, { payDeclarations })(PaymentModal);