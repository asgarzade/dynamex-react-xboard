import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import GenericInput from "../Form/GenericInput";
import Select from "react-select";
import { changeAssignee } from "state/reducers/assignedOrder/actions";
import { fetchOperators } from "state/reducers/operator/actions";

const staticText = {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    title: 'Change Assignee',
    operatorLabel: 'Choose Operator:',
};

// Fixes the overlapping problem of the component
const reactSelectStyle = {
    menu: provided => ({ ...provided, zIndex: 9999 })
};

const OperatorModal = props => {
    const { isModalOpen, onClose, onSuccess, assignment, fetchOperators, changeAssignee, operators } = props;
    const [loading, setLoading] = useState(false);
    const [operator, setOperator] = useState(assignment.operator);

    const handleFormSubmit = () => {
        const operatorCode = operator.clientCode;

        setLoading(true);

        changeAssignee({
            operatorCode,
            id: assignment.id,
            defaultCallback: () => setLoading(false),
            successCallback: onSuccess,
        });
    };

    // fetchOperators
    useEffect(() => {
        if (!operators.length) fetchOperators();
    }, [fetchOperators, operators]);

    return (
        <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
            <Modal.Header closeButton>
                <Modal.Title>{staticText.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <GenericInput
                        label={staticText.operatorLabel}
                        // error={!isEmpty(errors) && errors.countryFrom}
                        name={'countryFrom'}
                        required={true}
                    >
                        <Select
                            isClearable={false}
                            styles={reactSelectStyle}
                            inputId={'countryFrom'}
                            options={operators}
                            onChange={value => setOperator(value)}
                            getOptionLabel={opt => `${opt.clientCode} - ${opt.fullName}`}
                            getOptionValue={opt => opt.clientCode}
                            value={operator}
                        />
                    </GenericInput>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-secondary' onClick={onClose}>{staticText.cancelBtn}</button>
                <button
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    onClick={handleFormSubmit}
                    disabled={loading}
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    {staticText.confirmBtn}
                </button>
            </Modal.Footer>
        </Modal>
    )
};

const mapStateToProps = state => ({
    operators: state.operator.operators,
});

export default connect(mapStateToProps, {
    changeAssignee,
    fetchOperators
})(OperatorModal);