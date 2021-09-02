import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import GenericInput from 'views/components/Form/GenericInput';
import TextInput from 'views/components/Form/TextInput';
import TextArea from 'views/components/Form/TextArea';
import NumberInput from 'views/components/Form/NumberInput';
import Loading from 'views/components/Loading';
import { fetchOrderStatuses } from 'state/reducers/status/actions';
import { editOrder, emptyOrderErrors, fetchSingleOrder, emptyOrder } from 'state/reducers/order/actions';
import Select from "react-select";
import { isEmpty } from 'helpers/functions';
import { fetchProductTypes } from 'state/reducers/productType/actions';
import CheckBox from 'views/components/Form/CheckBox';

const staticText = {
    modalTitle: 'Edit Order',
    closeBtn: 'Close',
    saveBtn: 'Save',
    statusLabel: 'Status',
    productQuantityLabel: 'Product quantity',
    productPriceLabel: 'Product price',
    totalPriceLabel: 'Total price',
    cargoPriceLabel: 'Cargo price',
    productSizeLabel: 'Product size',
    productColorLabel: 'Product color',
    realQuantityLabel: 'Real quantity',
    realPriceLabel: 'Real product price',
    realCargoLabel: 'Real cargo price',
    commentLabel: 'Comment',
    urlLabel: 'Product URL',
    typesLabel: 'Product types',
    profitableCargoLabel: 'Profitable cargo',
};

// Fixes the overlapping problem of the component
const reactSelectStyle = {
    menu: provided => ({ ...provided, zIndex: 9999 })
};

const OrderModal = props => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        status: {},
        productUrl: '',
        productSize: '',
        productColor: '',
        realProductPrice: '',
        realCargoPrice: '',
        realProductQuantity: '',
        productTypes: [],
        isCargoProfitable: false,
    });
    const [productTypeOptions, setProductTypeOptions] = useState([]);

    // props
    const { isModalOpen, id, onSuccess, onClose } = props;
    // state
    const { statuses, errors, productTypes, order } = props;
    // actions
    const { fetchOrderStatuses, editOrder, emptyOrderErrors, fetchProductTypes, fetchSingleOrder, emptyOrder } = props;

    const handleFormSubmit = () => {
        const formData = {
            ...form,
            status: form.status.id,
            productTypes: form.productTypes.map(type => type.id),
            id,
        };

        setLoading(true);

        editOrder({
            order: formData,
            defaultCallback: () => setLoading(false),
            successCallback: onSuccess,
        });
    };

    const handleInputChange = e => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setForm(prevState => ({
            ...prevState,
            [targetName]: targetValue
        }));
    };

    const handleSelectChange = (inputName, value) => {
        setForm(prevState => ({
            ...prevState,
            [inputName]: value
        }));
    };

    const handleCheckboxChange = e => {
        const targetName = e.target.name;
        const checked = e.target.checked;

        setForm(prevState => ({
            ...prevState,
            [targetName]: checked
        }));
    };

    useEffect(() => {
        setShow(isModalOpen);
        fetchSingleOrder(id);

        return () => {
            emptyOrderErrors();
            emptyOrder();
        }
    }, [isModalOpen, emptyOrderErrors, id, fetchSingleOrder, emptyOrder]);

    useEffect(() => {
        setForm({
            status: statuses.length ? statuses.find(status => status.id === order.status) : {},
            productUrl: order.productUrl,
            productSize: order.productSize,
            productColor: order.productColor,
            realProductPrice: order.realProductPrice,
            realCargoPrice: order.realCargoPrice,
            realProductQuantity: order.realProductQuantity,
            productTypes: productTypes.length ? productTypes.filter(type => order.productTypes?.includes(type.id)) : [],
            isCargoProfitable: order.isCargoProfitable,
        });
    }, [order, statuses, productTypes]);

    useEffect(() => {
        if (!statuses.length) fetchOrderStatuses();
    }, [statuses, fetchOrderStatuses]);

    useEffect(() => {
        if (!productTypes.length) fetchProductTypes();
    }, [fetchProductTypes, productTypes]);

    useEffect(() => {
        const orderCountryId = order.countryFrom;
        if (orderCountryId) {
            setProductTypeOptions(productTypes.filter(type => type.country === orderCountryId));
        }
    }, [productTypes, order.countryFrom]);

    return (
        <>
            <Modal show={show} onHide={onClose} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>{staticText.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-5 py-4'>
                    {
                        isEmpty(order) ? 
                        <Loading /> :
                        <>
                            <form>
                                <GenericInput
                                    label={staticText.statusLabel}
                                    error={!isEmpty(errors) && errors.status}
                                    name={'status'}
                                    required={true}
                                >
                                    <Select
                                        isClearable={false}
                                        styles={reactSelectStyle}
                                        inputId={'status'}
                                        options={statuses}
                                        onChange={value => handleSelectChange('status', value)}
                                        getOptionLabel={opt => opt.name}
                                        getOptionValue={opt => opt.id}
                                        value={form.status}
                                    />
                                </GenericInput>
                                <TextInput
                                    onChange={handleInputChange}
                                    name={'productUrl'}
                                    label={staticText.urlLabel}
                                    error={!isEmpty(errors) && errors.productUrl}
                                    value={form.productUrl}
                                    required={true}
                                />
                                <TextArea
                                    onChange={handleInputChange}
                                    name={'comment'}
                                    label={staticText.commentLabel}
                                    rows={3}
                                    error={!isEmpty(errors) && errors.comment}
                                    value={order.comment}
                                />
                                <GenericInput 
                                    label={staticText.typesLabel} 
                                    error={!isEmpty(errors) && errors.productTypes}
                                    name={'productTypes'}
                                    // required={true}
                                >
                                    <Select
                                        isClearable={true}
                                        // closeMenuOnSelect={false}
                                        styles={reactSelectStyle}
                                        isMulti={true}
                                        inputId={'productTypes'}
                                        options={productTypeOptions}
                                        onChange={value => handleSelectChange('productTypes', value)}
                                        getOptionLabel={opt => opt.name}
                                        getOptionValue={opt => opt.id}
                                        value={form.productTypes}
                                    />
                                </GenericInput>
                                <TextInput
                                    onChange={handleInputChange}
                                    name={'productSize'}
                                    label={staticText.productSizeLabel}
                                    error={!isEmpty(errors) && errors.productSize}
                                    value={form.productSize}
                                    required={true}
                                />
                                <TextInput
                                    onChange={handleInputChange}
                                    name={'productColor'}
                                    label={staticText.productColorLabel}
                                    error={!isEmpty(errors) && errors.productColor}
                                    value={form.productColor}
                                    required={true}
                                />
                                <TextInput
                                    name={'productQuantity'}
                                    label={staticText.productQuantityLabel}
                                    value={order.productQuantity}
                                    disabled={true}
                                />
                                <TextInput
                                    name={'productPrice'}
                                    label={staticText.productPriceLabel}
                                    value={order.productPrice}
                                    disabled={true}
                                />
                                <TextInput
                                    name={'cargoPrice'}
                                    label={staticText.cargoPriceLabel}
                                    value={order.cargoPrice}
                                    disabled={true}
                                />
                                <TextInput
                                    name={'totalPrice'}
                                    label={staticText.totalPriceLabel}
                                    value={order.totalPrice}
                                    disabled={true}
                                />
                                <NumberInput
                                    onChange={handleInputChange}
                                    name={'realQuantity'}
                                    label={staticText.realQuantityLabel}
                                    error={!isEmpty(errors) && errors.realQuantity}
                                    value={form.realProductQuantity}
                                    // required={true}
                                />
                                <NumberInput
                                    onChange={handleInputChange}
                                    name={'realProductPrice'}
                                    label={staticText.realPriceLabel}
                                    error={!isEmpty(errors) && errors.realProductPrice}
                                    value={form.realProductPrice}
                                    // required={true}
                                />
                                <NumberInput
                                    onChange={handleInputChange}
                                    name={'realCargoPrice'}
                                    label={staticText.realCargoLabel}
                                    error={!isEmpty(errors) && errors.realCargoPrice}
                                    value={form.realCargoPrice}
                                    // required={true}
                                />
                                <CheckBox 
                                    onChange={handleCheckboxChange}
                                    name={'isCargoProfitable'}
                                    label={staticText.profitableCargoLabel}
                                    isChecked={form.isCargoProfitable}
                                />
                            </form>
                            {!isEmpty(errors) && errors.nonFieldErrors}
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={onClose}>{staticText.closeBtn}</button>
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={handleFormSubmit}
                        disabled={loading}
                    >
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        {staticText.saveBtn}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const mapStateToProps = state => ({
    statuses: state.statuses.orderStatuses,
    errors: state.order.errors,
    productTypes: state.productTypes,
    order: state.order.order,
});

export default connect(mapStateToProps, {
    fetchOrderStatuses,
    editOrder,
    emptyOrderErrors,
    fetchProductTypes,
    fetchSingleOrder,
    emptyOrder,
})(OrderModal);