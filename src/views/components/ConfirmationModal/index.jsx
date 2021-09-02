import React from 'react';
import Modal from 'react-bootstrap/Modal';

const staticText = {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
};

const ConfirmationModal = props => {
    const { isModalOpen, onClose, onConfirm, title, message, ids } = props;

    return (
        <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <button className='btn btn-secondary' onClick={onClose}>{staticText.cancelBtn}</button>
                <button className='btn btn-primary' onClick={() => onConfirm(ids)}>{staticText.confirmBtn}</button>
            </Modal.Footer>
        </Modal>
    )
};

export default ConfirmationModal;