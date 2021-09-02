import React, { useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import TextArea from 'views/components/Form/TextArea';
import { addCommentToAssignment } from "state/reducers/assignedOrder/actions";
import moment from 'moment';
import { dateFormat } from 'helpers/constants';

const staticText = {
    cancelBtn: 'Cancel',
    confirmBtn: 'Add',
    editTitle: 'Add Comment',
    viewTitle: 'Comments',
    closeBtn: 'Close',
    commentLabel: 'Your Comment:',
    previousComments: 'Previous Comments'
};

const CommentModal = props => {
    const { isModalOpen, onClose, onSuccess, commentsContainer, addCommentToAssignment, type } = props;
    const { comments } = commentsContainer;
    // const { comments } = commentsContainer;
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = () => {
        setLoading(true);

        addCommentToAssignment({
            id: commentsContainer.id,
            body: comment,
            defaultCallback: () => setLoading(false),
            successCallback: onSuccess
        });
    };

    return (
        <Modal show={isModalOpen} onHide={onClose} style={{opacity:1}}>
            <Modal.Header closeButton>
                <Modal.Title>{type === 'edit' ? staticText.editTitle : staticText.viewTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { comments.length ?
                    <>
                        {/*<h6>{staticText.previousComments}</h6>*/}
                        <ul className={'list-unstyled mb-0'}>
                            { comments.map((comment, index) => (
                                <li key={index} className="row mb-3">
                                    <div className={'col-sm-4'}>
                                        <strong className={''}>{comment.user.fullName}</strong>
                                        {comment.user.isAdmin && <span className={'badge badge-light ml-2'}>Admin</span>}
                                        <br/>
                                        <small>{moment(comment.createdAt).format(dateFormat)}</small>
                                    </div>
                                    <div className="col-sm-8">
                                        {comment.body}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                    : ''
                }
                {
                    type === 'edit' &&
                    <form className={comments.length && 'mt-5'}>
                        <TextArea
                            onChange={(e) => setComment(e.target.value)}
                            name={'comment'}
                            label={staticText.commentLabel}
                            // error={!isEmpty(errors) && errors.shop}
                            value={comment}
                            required={true}
                            noMargin={true}
                        />
                    </form>
                }
            </Modal.Body>
            <Modal.Footer>
                {
                    type === 'edit' ?
                        <>
                            <button className='btn btn-secondary' onClick={onClose}>{staticText.cancelBtn}</button>
                            <button
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={handleFormSubmit}
                                disabled={!comment || loading}
                            >
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                {staticText.confirmBtn}
                            </button>
                        </>
                        :
                        <button className='btn btn-secondary' onClick={onClose}>{staticText.closeBtn}</button>
                }

            </Modal.Footer>
        </Modal>
    )
};

export default connect(null, { addCommentToAssignment })(CommentModal);