import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Declaration from 'models/Declaration';
import GenericInput from 'views/components/Form/GenericInput';
import TextInput from 'views/components/Form/TextInput';
import TextArea from 'views/components/Form/TextArea';
import NumberInput from 'views/components/Form/NumberInput';
import CheckBox from 'views/components/Form/CheckBox';
import FileInput from 'views/components/Form/FileInput'
import Select from 'react-select';
import MiniOrdersTable from "views/components/OrdersTable/MiniOrdersTable";
import { fetchDeclarationStatuses } from 'state/reducers/status/actions';
import { fetchProductTypes } from 'state/reducers/productType/actions';
import { createDeclaration, editDeclaration, emptyDeclarationErrors } from 'state/reducers/declaration/actions';
import { isEmpty, round } from 'helpers/functions';
import { reactSelectStyle } from 'helpers/constants';
import { fetchBags } from 'state/reducers/bag/actions';

const staticText = {
    editTitle: 'Edit Declaration',
    newTitle: 'New Declaration',
    closeBtn: 'Close',
    saveBtn: 'Save',
    userLabel: 'User',
    countryLabel: 'Country',
    statusLabel: 'Status',
    typesLabel: 'Product types',
    shopLabel: 'Shop',
    deliveryCodeLabel: 'Delivery code',
    quantityLabel: 'Quantity',
    productPriceLabel: 'Product price',
    productPriceCurrencyLabel: 'Product price currency',
    weightLabel: 'Weight',
    packageHeightLabel: 'Height',
    packageWidthLabel: 'Width',
    packageLengthLabel: 'Length',
    weightInputAppend: 'kg',
    sizeInputAppend: 'cm',
    documentLabel: 'Document',
    liquidLabel: 'Is liquid',
    commentLabel: 'Comment',
    packageSizeConsideredLabel: 'Large package',
    bagLabel: 'Bag',
};

const DeclarationModal = props => {
    const [show, setShow] = useState(false);
    const [declaration, setDeclaration] = useState(Declaration.createEmpty());
    const [isFormComplete, setFormComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productTypeOptions, setProductTypeOptions] = useState([]);
    const [attachment, setAttachment] = useState({});

    // props
    const { isModalOpen, declarationToEdit, panel, onSuccess, onClose, modalType, forOrders, orders } = props;
    // state
    const { user, countries, declarationResponse, statuses, productTypes, bags } = props;
    // actions
    const { fetchDeclarationStatuses, fetchProductTypes, createDeclaration, editDeclaration, emptyDeclarationErrors, fetchBags } = props;

    const userInfo = `${user.fullName} - ${user.email}`;
    const { errors } = declarationResponse;

    const countryOptions = countries.filter(country => !country.isBase);
    
    const handleInputChange = e => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setDeclaration(prevState => ({
            ...prevState,
            [targetName]: targetValue
        }));
    };

    const handleCheckboxChange = e => {
        const targetName = e.target.name;
        const checked = e.target.checked;

        setDeclaration(prevState => ({
            ...prevState,
            [targetName]: checked
        }));
    };

    const handleSelectChange = (inputName, value) => {
        setDeclaration(prevState => ({
            ...prevState,
            [inputName]: value
        }));

        if (inputName === 'countryFrom') {
            setDeclaration(prevState => ({
                ...prevState,
                productTypes: []
            }));
            // setProductTypeOptions(productTypes.filter(type => type.country === value.id));
        }
    };

    const handleFormSubmit = () => {
        const { shop, productPrice, productQuantity, productTypes, packageSizeConsidered, packageWidth, packageLength,
            packageHeight, comment, weight, deliveryCode, isCosmetics, status, countryFrom, bag } = declaration;

        const data = {
            shop, 
            productPrice, 
            productQuantity, 
            productTypes: productTypes.map(type => type.id),
            comment, 
            weight,
            deliveryCode, 
            isCosmetics, 
            status: status.id,
            countryFrom: countryFrom.id,
            packageSizeConsidered,
            packageWidth,
            packageLength,
            packageHeight,
            bag: bag.id,
        };

        if (panel !== 'problem') data.user = user.clientCode;
        if (forOrders) data.orders = orders.map(order => order.id);

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key].constructor === Array) {
                data[key].forEach(item => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, data[key]);
            }
        });
        if (!isEmpty(attachment)) formData.append('attachment', attachment, attachment.name);

        setLoading(true);
        if (modalType === 'new') {
            createDeclaration({
                data: formData,
                defaultCallback: () => setLoading(false),
                successCallback: onSuccess,
                forOrders
            });
        } else if (modalType === 'edit') {
            editDeclaration({
                id: declarationToEdit.id,
                data: formData,
                defaultCallback: () => setLoading(false),
                successCallback: onSuccess,
            })
        }
    };

    // filters product types for chosen country
    useEffect(() => {
        if (declaration.countryFrom) {
            setProductTypeOptions(productTypes.filter(type => type.country === declaration.countryFrom.id));
        }
    }, [productTypes, declaration.countryFrom]);

    // checks if all the required items are filled
    useEffect(() => {
        const { productPrice, productQuantity, productTypes, weight, status, countryFrom,
            packageSizeConsidered, packageHeight, packageLength, packageWidth } = declaration;
        
        let requiredItems = {
            productPrice, productQuantity, productTypes, weight, status, countryFrom
        };

        if (packageSizeConsidered) {
            requiredItems = {
                ...requiredItems,
                packageHeight,
                packageLength,
                packageWidth,
            }
        }

        const requiredFormItems = Object.entries(requiredItems);
        const isFormComplete = requiredFormItems.every(([ ,value]) => {
            if (value && value.constructor === Array) return value.length;
            else return value;
        });

        setFormComplete(isFormComplete);
    }, [declaration]);
    
    // handles opening and closing the modal
    useEffect(() => {
        setShow(isModalOpen);

        return () => {
            emptyDeclarationErrors();
        }
    }, [isModalOpen, emptyDeclarationErrors]);

    // sets form values if modalType is set to edit
    useEffect(() => {
        if (modalType === 'edit') setDeclaration({
            ...declarationToEdit,
            countryFrom: countries.find(country => country.id === declarationToEdit.countryFrom),
            status: statuses.find(status => status.id === declarationToEdit.status),
            productTypes: productTypes.filter(type => declarationToEdit.productTypes.includes(type.id)),
            comment: declarationToEdit.comment || '',
            deliveryCode: declarationToEdit.deliveryCode || '',
            bag: bags.find(bag => bag.id === declarationToEdit.bag),
        });
    }, [declarationToEdit, modalType, countries, statuses, productTypes, bags]);

    // sets form values if modal is for creating declaration for orders
    useEffect(() => {
        if (forOrders) { 
            let productTypeIds = [];
            orders.forEach(order => productTypeIds.push(...order.productTypes));

            setDeclaration(prevState => ({
                ...prevState,
                countryFrom: countries.find(country => country.id === orders[0].countryFrom),
                productQuantity: orders.reduce((sum, item) => sum + item.productQuantity, 0),
                productPrice: round(orders.reduce((sum, item) => parseFloat(sum) + parseFloat(item.totalPrice) + parseFloat(item.remainderPrice), 0), 2),
                productTypes: productTypes.filter(type => productTypeIds.includes(type.id)),
            }));
        }
    }, [forOrders, orders, countries]);

    // fetches declaration statuses depending on the panel the modal was called at
    useEffect(() => {
        if (panel === 'problem' || panel === 'warehouse') fetchDeclarationStatuses(panel)
    }, [fetchDeclarationStatuses, panel]);

    // fetches product types if state is empty
    useEffect(() => {
        if (!productTypes.length) fetchProductTypes();
    }, [fetchProductTypes, productTypes]);

    // fetches bags if state is empty
    useEffect(() => {
        fetchBags();
    }, [fetchBags]);

    // set default bag if creating a new declaration
    useEffect(() => {
        if (modalType === 'new' && bags.length) {
            setDeclaration(prevState => ({
                ...prevState,
                bag: bags.find(bag => bag.wasLast)
            }))
        }
    }, [modalType, bags]);

    return (
        <>
            <Modal show={show} onHide={onClose} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'new' ? staticText.newTitle : staticText.editTitle}</Modal.Title>
                </Modal.Header>
                <div className='modal-footer border-bottom border-top-0'>
                    <ModalActions onClose={onClose} loading={loading} handleFormSubmit={handleFormSubmit} isFormComplete={isFormComplete} />
                </div>
                <Modal.Body className='pt-4 pb-2'>
                    { forOrders && <MiniOrdersTable orders={orders} className={'mb-5'}/> }
                    <form>
                        { panel !== 'problem' &&
                            <div className="form-group row">
                                <label className='col-sm-4 col-form-label'>{staticText.userLabel}</label>
                                <label className='col-sm-8 col-form-label font-weight-bold'>{userInfo}</label>
                            </div>
                        }
                        <NumberInput 
                            onChange={handleInputChange}
                            name={'weight'}
                            label={staticText.weightLabel}
                            error={!isEmpty(errors) && errors.weight}
                            value={declaration.weight || ''}
                            append={staticText.weightInputAppend}
                            required={true}
                        />
                        <CheckBox
                            onChange={handleCheckboxChange}
                            name={'packageSizeConsidered'}
                            label={staticText.packageSizeConsideredLabel}
                            error={!isEmpty(errors) && errors.packageSizeConsidered}
                            isChecked={declaration.packageSizeConsidered}
                        />
                        { declaration.packageSizeConsidered && <>
                            <NumberInput
                                onChange={handleInputChange}
                                name={'packageHeight'}
                                label={staticText.packageHeightLabel}
                                error={!isEmpty(errors) && errors.packageHeight}
                                value={declaration.packageHeight || ''}
                                append={staticText.sizeInputAppend}
                                required={true}
                            />
                            <NumberInput
                                onChange={handleInputChange}
                                name={'packageWidth'}
                                label={staticText.packageWidthLabel}
                                error={!isEmpty(errors) && errors.packageWidth}
                                value={declaration.packageWidth || ''}
                                append={staticText.sizeInputAppend}
                                required={true}
                            />
                            <NumberInput
                                onChange={handleInputChange}
                                name={'packageLength'}
                                label={staticText.packageLengthLabel}
                                error={!isEmpty(errors) && errors.packageLength}
                                value={declaration.packageLength || ''}
                                append={staticText.sizeInputAppend}
                                required={true}
                            />
                        </> }
                        <CheckBox 
                            onChange={handleCheckboxChange}
                            name={'isCosmetics'}
                            label={staticText.liquidLabel}
                            error={!isEmpty(errors) && errors.isCosmetics}
                            isChecked={declaration.isCosmetics}
                        />
                        <GenericInput
                            label={staticText.countryLabel}
                            error={!isEmpty(errors) && errors.countryFrom}
                            name={'countryFrom'}
                            required={true}
                        >
                            <Select
                                isClearable={false}
                                styles={reactSelectStyle}
                                inputId={'countryFrom'}
                                options={countryOptions}
                                onChange={value => handleSelectChange('countryFrom', value)}
                                getOptionLabel={opt => opt.name}
                                getOptionValue={opt => opt.id}
                                value={declaration.countryFrom}
                            />
                        </GenericInput>
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
                                value={declaration.status}
                            />
                        </GenericInput>
                        <GenericInput 
                            label={staticText.typesLabel} 
                            error={!isEmpty(errors) && errors.productTypes}
                            name={'productTypes'}
                            required={true}
                        >
                            <Select
                                isClearable={true}
                                // closeMenuOnSelect={false}
                                styles={reactSelectStyle}
                                isMulti={true}
                                inputId={'productTypes'}
                                options={productTypeOptions}
                                onChange={value => handleSelectChange('productTypes', value)}
                                isDisabled={!declaration.countryFrom}
                                getOptionLabel={opt => opt.name}
                                getOptionValue={opt => opt.id}
                                value={declaration.productTypes}
                            />
                        </GenericInput>
                        <GenericInput
                            label={staticText.bagLabel}
                            error={!isEmpty(errors) && errors.bag}
                            name={'bag'}
                            // required={true}
                        >
                            <Select
                                isClearable={false}
                                styles={reactSelectStyle}
                                inputId={'bag'}
                                options={bags}
                                onChange={value => handleSelectChange('bag', value)}
                                getOptionLabel={opt => opt.name}
                                getOptionValue={opt => opt.id}
                                value={declaration.bag}
                            />
                        </GenericInput>
                        <TextInput 
                            onChange={handleInputChange}
                            name={'shop'}
                            label={staticText.shopLabel}
                            error={!isEmpty(errors) && errors.shop}
                            value={declaration.shop}
                        />
                        <TextInput 
                            onChange={handleInputChange}
                            name={'deliveryCode'}
                            label={staticText.deliveryCodeLabel}
                            error={!isEmpty(errors) && errors.deliveryCode && errors.deliveryCode}
                            value={declaration.deliveryCode ? declaration.deliveryCode : ''}
                        />
                        <NumberInput 
                            onChange={handleInputChange}
                            name={'productQuantity'}
                            label={staticText.quantityLabel}
                            error={!isEmpty(errors) && errors.productQuantity}
                            value={declaration.productQuantity}
                            required={true}
                        />
                        <NumberInput 
                            onChange={handleInputChange}
                            name={'productPrice'}
                            label={staticText.productPriceLabel}
                            error={!isEmpty(errors) && errors.productPrice}
                            value={declaration.productPrice}
                            required={true}
                        />
                        <FileInput 
                            label={staticText.documentLabel}
                            name={'attachment'}
                            value={attachment}
                            currentFile={declaration.attachment}
                            onChange={(file) => setAttachment(file)}
                            error={!isEmpty(errors) && errors.file}
                        />
                        <TextArea 
                            onChange={handleInputChange}
                            name={'comment'}
                            label={staticText.commentLabel}
                            error={!isEmpty(errors) && errors.comment}
                            value={declaration.comment || ''}
                        />
                    </form>
                    <div className={'error-message text-center'}>{!isEmpty(errors) && errors.orders}</div>
                </Modal.Body>
                <Modal.Footer>
                    <ModalActions onClose={onClose} loading={loading} handleFormSubmit={handleFormSubmit} isFormComplete={isFormComplete} />
                </Modal.Footer>
            </Modal>
        </>
    )
};

const ModalActions = props => {
    const { onClose, loading, handleFormSubmit, isFormComplete } = props;

    return (
        <>
            <button className='btn btn-secondary' onClick={onClose}>{staticText.closeBtn}</button>
            <button
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleFormSubmit}
                disabled={!isFormComplete || loading}
            >
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                {staticText.saveBtn}
            </button>
        </>
    )
}

const mapStateToProps = state => ({
    paydeskItems: state.paydesk,
    currencies: state.currencies,
    countries: state.countries,
    user: state.user.userProfile,
    statuses: state.statuses.declarationStatuses,
    productTypes: state.productTypes,
    declarationResponse: state.declaration,
    bags: state.bags,
});

export default connect(mapStateToProps, {
    fetchDeclarationStatuses,
    fetchProductTypes,
    createDeclaration,
    editDeclaration,
    emptyDeclarationErrors,
    fetchBags,
})(DeclarationModal);