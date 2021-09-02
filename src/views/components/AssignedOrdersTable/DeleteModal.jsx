import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TextArea from 'views/components/Form/TextArea';
import { changeAssignedOrderStatus, clearAssignedOrderActionErrors } from "state/reducers/assignedOrder/actions";
import { isEmpty } from "helpers/functions";

const staticText = {
    cancelBtn: 'Cancel',
    confirmBtn: 'Delete',
    title: 'Delete Orders',
    reasonLabel: 'Reason for deletion:',
};

const DeleteModal = props => {
    const { isModalOpen, onClose, onSuccess, ids, changeAssignedOrderStatus, clearAssignedOrderActionErrors, errors } = props;
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = () => {
        setLoading(true);

        changeAssignedOrderStatus({
            items: ids,
            action: 'delete',
            deletionReason: reason,
            defaultCallback: () => setLoading(false),
            successCallback: onSuccess,
            productTypes: [], // temporary; due to a backend issue
        });
    };

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
                    <TextArea
                        onChange={(e) => setReason(e.target.value)}
                        name={'reason'}
                        label={staticText.reasonLabel}
                        error={!isEmpty(errors) && errors.deletionReason}
                        value={reason}
                        required={true}
                    />
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
                    // disabled={!reason || loading}
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    {staticText.confirmBtn}
                </button>
            </Modal.Footer>
        </Modal>
    )
};

const mapStateToProps = state => ({
    errors: state.assignedOrders.errors,
});

export default connect(mapStateToProps, {
    changeAssignedOrderStatus,
    clearAssignedOrderActionErrors,
})(DeleteModal);