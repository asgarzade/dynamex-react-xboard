import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { updateBalance } from 'state/reducers/user/actions';
import Currency from 'models/Currency';
import { round } from 'helpers/functions';

const staticText = {
    modalTitle: 'Balance Operations',
    selectPlaceholder: 'Choose...',
    balanceLabel: 'Balance:',
    currencyLabel: 'Currency:',
    purposeLabel: 'Purpose:',
    amountLabel: 'Amount:',
    rates: 'Rates',
    closeBtn: 'Close',
    saveBtn: 'Save',
};
// Fixes the overlapping problem of the component
const reactSelectStyle = {
    menu: provided => ({ ...provided, zIndex: 9999 })
};

const BalanceModal = props => {
    const [show, setShow] = useState(false);
    const [isFormComplete, setFormIncomplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [balanceCurrency, setBalanceCurrency] = useState(Currency.createDefault());
    const [balanceAmount, setBalanceAmount] = useState(0);
    const [balanceForm, setBalanceForm] = useState({
        user: '',
        action: '',
        walletCurrency: 0,
        currency: 0,
        amount: 0
    });

    const { user, currencies, isModalOpen, onClose, onSuccess, updateBalance } = props;

    const userFullName = `${user.fullName}`;
    const baseCurrency = currencies.find(currency => parseFloat(currency.rate) === 1) || Currency.createDefault();
    const otherCurrencies = currencies.filter(currency => parseFloat(currency.rate) !== 1);

    const balanceOptions = user.wallets.map(wallet => ({
        value: wallet.currency.id,
        label: `${userFullName}: ${wallet.amount} ${wallet.currency.code} (${round(wallet.amount*wallet.currency.rate, 2)} ${baseCurrency.code})`
    }));

    const purposeOptions = [];
    
    for (let [value, label] of Object.entries(props.choices.balanceChoices)) {
        purposeOptions.push({
            value,
            label
        });
    }

    const onBalanceChange = value => {
        let currency = currencies.find(currency => currency.id === value.value);
        setBalanceCurrency(currency);

        setBalanceAmount(round(balanceForm.amount / currency.rate, 2));

        setBalanceForm(prevState => ({
            ...prevState,
            walletCurrency: value.value
        }));
    };
    const onPurposeChange = value => {
        setBalanceForm(prevState => ({
            ...prevState,
            action: value.value
        }));
    };
    const onAmountChange = e => {
        let amount = e.target.value;

        if (balanceCurrency.rate) setBalanceAmount(round(amount / balanceCurrency.rate, 2));

        setBalanceForm(prevState => ({
            ...prevState,
            amount: parseFloat(amount)
        }));
    };
    const onBalanceAmountChange = e => {
        let amount = e.target.value;

        setBalanceAmount(amount);

        setBalanceForm(prevState => ({
            ...prevState,
            amount: round(amount * parseFloat(balanceCurrency.rate), 2)
        }));
    };
    const handleFormSubmit = () => {  
        setLoading(true);
        updateBalance({
            data: balanceForm, 
            errorCallback: () => setLoading(false),
            successCallback: onSuccess,
        });
    };

    useEffect(() => {
        const formItems = Object.entries(balanceForm);
        const isFormComplete = formItems.every(([ ,value]) =>  value);

        setFormIncomplete(isFormComplete)
    }, [balanceForm]);

    useEffect(() => {
        setShow(isModalOpen);
    }, [isModalOpen]);

    useEffect(() => {
        setBalanceForm(prevState => ({
            ...prevState,
            user: user.clientCode,
        }));
    }, [user]);

    useEffect(() => {
        setBalanceForm(prevState => ({
            ...prevState,
            currency: baseCurrency.id,
        }));
    }, [baseCurrency]);

    return (
        <Modal show={show} onHide={onClose} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>{staticText.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-5 py-4'>
                    <div className="border rounded mb-5 overflow-hidden">
                        <h6 className='p-3 border-bottom bg-light mb-0'>{staticText.rates}</h6>
                        <div className="row m-0">
                        {
                            otherCurrencies.map((currency, index) => (
                                <div className="col py-4" key={index}>
                                    <p>{currency.name}</p>
                                    <p className='m-0'>1 {currency.code} = {currency.rate} {baseCurrency.code}</p>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <form>
                        <div className="form-group react-select row">
                            <label htmlFor="currency" className='col-sm-4 col-form-label'>{staticText.currencyLabel}</label>
                            <div className="col-sm-8">
                                <Select
                                    isClearable={false}
                                    isDisabled={true}
                                    styles={reactSelectStyle}
                                    value={{
                                        value: baseCurrency.id,
                                        label: baseCurrency.name
                                    }} 
                                />
                            </div>
                        </div>
                        <div className="form-group react-select row">
                            <label htmlFor="balance" className='col-sm-4 col-form-label'>{staticText.balanceLabel}</label>
                            <div className="col-sm-8">
                                <Select
                                    isClearable={false}
                                    options={balanceOptions} 
                                    styles={reactSelectStyle}
                                    onChange={onBalanceChange}
                                    placeholder={staticText.selectPlaceholder}
                                />
                            </div>
                        </div>
                        <div className="form-group react-select row">
                            <label htmlFor="purpose" className='col-sm-4 col-form-label'>{staticText.purposeLabel}</label>
                            <div className="col-sm-8">
                                <Select
                                    isClearable={false}
                                    options={purposeOptions} 
                                    styles={reactSelectStyle}
                                    onChange={onPurposeChange}
                                    placeholder={staticText.selectPlaceholder}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="base-amount" className='col-sm-4 col-form-label'>{staticText.amountLabel}</label>
                            <div className="col-sm-8 d-flex">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">{balanceCurrency.code || baseCurrency.code}</div>
                                    </div>
                                    <input 
                                        className='form-control' 
                                        type="number" 
                                        id='balance-amount'
                                        min='0'
                                        disabled={!balanceCurrency.code} 
                                        value={balanceAmount} 
                                        onChange={onBalanceAmountChange}
                                    />
                                </div>
                                <div className="input-group-text">=</div>
                                <div className="input-group">
                                    <input 
                                        className='form-control' 
                                        type="number" 
                                        id='base-amount' 
                                        min='0'
                                        value={balanceForm.amount} 
                                        onChange={onAmountChange}/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">{baseCurrency.code}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={onClose}>{staticText.closeBtn}</button>
                    <button className='btn btn-primary' onClick={handleFormSubmit} disabled={!isFormComplete || loading}>{staticText.saveBtn}</button>
                </Modal.Footer>
            </Modal>
    )
};

const mapStateToProps = state => ({
    currencies: state.currencies,
    user: state.user.userProfile,
    choices: state.choices,
});

export default connect(mapStateToProps, {
    updateBalance,
})(BalanceModal);