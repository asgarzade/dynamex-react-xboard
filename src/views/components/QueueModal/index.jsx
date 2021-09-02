import React, {useState} from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Loading from "../Loading";
import { addToQueue } from 'state/reducers/queue/actions';
import './index.scss';

const staticText = {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    closeBtn: 'Close',
    modalTitle: 'Send to Pickup',
    modalMessage: 'Please confirm to move selected declaration(s) to Pickup',
    successMessage: 'Declaration(s) moved to Pickup. Here is the queue number:',
};

const QueueModal = props => {
    const { isModalOpen, onClose, onSuccess, ids, addToQueue } = props;
    const [loading, setLoading] = useState(false);
    const [queueNumber, setQueueNumber] = useState(0);

    const handleConfirm = () => {
        setLoading(true);
        addToQueue({
            ids,
            successCallback: (number) => setQueueNumber(number),
            defaultCallback: () => setLoading(false)
        })
    };

    return (
        <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
            { loading ?
                <Loading />
                :
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>{staticText.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { queueNumber ?
                            <div>
                                <p>{staticText.successMessage}</p>
                                <p className={'queue-number'}>{queueNumber}</p>
                            </div>
                            :
                            <div>{staticText.modalMessage}</div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        {  queueNumber ?
                            <button className='btn btn-secondary' onClick={onSuccess}>{staticText.closeBtn}</button>
                            :
                            <>
                                <button className='btn btn-secondary' onClick={onClose}>{staticText.cancelBtn}</button>
                                <button className='btn btn-primary' onClick={handleConfirm}>{staticText.confirmBtn}</button>
                            </>
                        }
                    </Modal.Footer>
                </>

            }

        </Modal>
    )
};

export default connect(null, { addToQueue })(QueueModal);