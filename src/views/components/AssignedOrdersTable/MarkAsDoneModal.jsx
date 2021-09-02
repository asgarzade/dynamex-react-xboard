import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TextInput from 'views/components/Form/TextInput';
// import GenericInput from "views/components/Form/GenericInput";
import { changeAssignedOrderStatus, clearAssignedOrderActionErrors } from "state/reducers/assignedOrder/actions";
// import { fetchProductTypes } from 'state/reducers/productType/actions';
// import Select from "react-select";
// import { reactSelectStyle } from 'helpers/constants';
import { isEmpty } from "helpers/functions";

const staticText = {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    title: 'Mark Orders as Completed',
    orderCodeLabel: 'Order number:',
    // typesLabel: 'Product types',
};

const MarkAsDoneModal = props => {
    const { isModalOpen, onClose, onSuccess, orders, changeAssignedOrderStatus,
        errors, clearAssignedOrderActionErrors } = props;
    const [form, setForm] = useState({orderCode: ''});
    // const [isFormComplete, setFormComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [availableTypes, setAvailableTypes] = useState([]);

    const handleInputChange = e => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setForm(prevState => ({
            ...prevState,
            [targetName]: targetValue
        }));
    };

    const handleFormSubmit = () => {
        const { orderCode } = form;

        const formData = {
            orderCode,
            // productTypes: productTypes.map(type => type.id),
            items: orders.map(order => order.assignment.id),
            action: 'done',
        };

        setLoading(true);

        changeAssignedOrderStatus({
            ...formData,
            defaultCallback: () => setLoading(false),
            successCallback: onSuccess,
        });
    };

    // useEffect(() => {
    //     const { orderCode, productTypes } = form;
    //
    //     const requiredItems = Object.entries({
    //         orderCode, productTypes
    //     });
    //
    //     const isFormComplete = requiredItems.every(([ ,value]) => {
    //         if (value && value.constructor === Array) return value.length;
    //         else return value;
    //     });
    //
    //     setFormComplete(isFormComplete);
    // }, [form]);

    // useEffect(() => {
    //     if (!productTypes.length) fetchProductTypes();
    // }, [fetchProductTypes, productTypes]);

    // useEffect(() => {
    //     const countryId = orders[0].countryFrom;
    //     setAvailableTypes(productTypes.filter(type => type.country === countryId));
    // }, [productTypes, orders]);

    useEffect(() => {
        return () => {
            clearAssignedOrderActionErrors();
        }
    }, [isModalOpen, clearAssignedOrderActionErrors]);

    return (
        <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
            <Modal.Header closeButton>
                <Modal.Title>{staticText.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <TextInput
                        onChange={handleInputChange}
                        name={'orderCode'}
                        label={staticText.orderCodeLabel}
                        error={!isEmpty(errors) && errors.orderCode}
                        value={form.orderCode}
                        required={true}
                    />
                    {/*<GenericInput*/}
                    {/*    label={staticText.typesLabel}*/}
                    {/*    error={!isEmpty(errors) && errors.productTypes}*/}
                    {/*    name={'productTypes'}*/}
                    {/*    required={true}*/}
                    {/*>*/}
                    {/*    <Select*/}
                    {/*        isClearable={true}*/}
                    {/*        styles={reactSelectStyle}*/}
                    {/*        isMulti={true}*/}
                    {/*        inputId={'productTypes'}*/}
                    {/*        options={availableTypes}*/}
                    {/*        onChange={value => handleSelectChange('productTypes', value)}*/}
                    {/*        getOptionLabel={opt => opt.name}*/}
                    {/*        getOptionValue={opt => opt.id}*/}
                    {/*        value={form.productTypes}*/}
                    {/*    />*/}
                    {/*</GenericInput>*/}
                </form>
                <div className={'error-message text-center'}>
                    {!isEmpty(errors) && errors.nonFieldErrors}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-secondary' onClick={onClose}>{staticText.cancelBtn}</button>
                <button
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    onClick={handleFormSubmit}
                    disabled={!form.orderCode.length || loading}
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                    {staticText.confirmBtn}
                </button>
            </Modal.Footer>
        </Modal>
    )
};

const mapStateToProps = state => ({
    productTypes: state.productTypes,
    errors: state.assignedOrders.errors,
});

export default connect(mapStateToProps, {
    changeAssignedOrderStatus,
    // fetchProductTypes,
    clearAssignedOrderActionErrors,
})(MarkAsDoneModal);