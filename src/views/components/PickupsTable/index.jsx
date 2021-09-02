import React, {useState} from 'react';
import { connect } from 'react-redux';
import { moveQueueItemToDone } from 'state/reducers/queue/actions';
import CommentModal from "views/components/CommentModal";
import './index.scss';
import moment from "moment";
import { dateFormat } from 'helpers/constants';

const staticText = {
    tableTitle: 'Pickups',
    pickupsSelected: 'pickup(s) selected',
    moveToDone: 'Move to Done',
    number: 'Number',
    user: 'User',
    declaration: 'Declaration',
    doneBtn: 'Done',
    shelfNumber: 'Shelf Number',
    operatorComment: 'Operator comment',
    more: 'More',
    empty: 'No pickups',
};
const defaultCommentModalOptions = {
    isModalOpen: false,
    declaration: {},
};

const addLoading = element => {
    element.classList.add('loading');
    element.setAttribute('disabled', 'disabled');
};
const removeLoading = element => {
    element.classList.remove('loading');
    element.removeAttribute('disabled');
};

const PickupsTable = props => {
    const [commentModalOptions, setCommentModalOptions] = useState(defaultCommentModalOptions);
    const { pickups, onPickupDone, moveQueueItemToDone, currentOperator } = props;

    const moveToDone = (e, id) => {
        const { target } = e;

        addLoading(target);

        moveQueueItemToDone({
            id,
            successCallback: () => {
                removeLoading(target);
                onPickupDone();
            },
            defaultCallback: () => removeLoading(target)
        })
    };

    return (
        <>
            { commentModalOptions.isModalOpen &&
                <CommentModal
                    isModalOpen={true}
                    commentsContainer={commentModalOptions.declaration}
                    type={'view'}
                    onClose={() => setCommentModalOptions(defaultCommentModalOptions)}
                />
            }
            <div className='px-2 bg-white d-flex justify-content-between align-items-center'>
                <h6 className='m-0 py-3'>{staticText.tableTitle}</h6>
            </div>
            <div className='tabular overflow-auto'>
                <table className='m-0'>
                    <thead>
                        <tr>
                            <th>
                                <div className="text">
                                    <span>{staticText.number}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.user}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.declaration}</span>
                                </div>
                            </th>
                            <th>
                                <div className={'text'}>
                                    <span>{staticText.operatorComment}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.moveToDone}</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pickups.map((pickup, index) => {
                                const { user, declarations } = pickup;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <span className={'number'}>{pickup.number}</span>
                                        </td>
                                        <td>
                                            {user.clientCode} - {user.fullName}
                                        </td>
                                        <td>
                                            <ul className={'list-unstyled m-0'}>
                                                {declarations.map((declaration, index) => (
                                                    <li key={index} className={'my-2'}>
                                                        <a
                                                            href={declaration.adminLink}
                                                            className={''}
                                                            target={'_blank'}

                                                        >
                                                            {declaration.trackingCode}
                                                        </a>
                                                        {' - '}
                                                        {declaration.weight}kg
                                                        {' - '}
                                                        {staticText.shelfNumber} - {declaration.shelfPlaceNumber}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul className={'list-unstyled m-0'}>
                                                {declarations.map((declaration, index) => {
                                                    const lastComment = declaration.comments[declaration.comments.length - 1];
                                                    return (
                                                        <li key={index} className={'my-2'}>
                                                            { lastComment &&
                                                            <>
                                                                <span className={'mb-1 d-block'}>
                                                                    {moment(lastComment.createdAt).format(dateFormat)} - {lastComment.user.fullName}: <br/>
                                                                    <span className={'font-weight-500'}>{lastComment.body}</span> <br/>
                                                                </span>
                                                                <button
                                                                    className={'btn btn-outline-secondary btn-sm py-1 commentlink'}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCommentModalOptions({
                                                                            isModalOpen: true,
                                                                            declaration,
                                                                        });
                                                                    }}
                                                                >
                                                                    {staticText.more}
                                                                </button>
                                                            </>
                                                            }
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </td>
                                        <td>
                                            {
                                                currentOperator.canChangeDeclarationStatus &&
                                                <button
                                                    className='btn btn-success'
                                                    onClick={(e) => moveToDone(e, pickup.id)}
                                                >
                                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                    {staticText.doneBtn}
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                { !pickups.length && <div className='p-3 bg-white'>{staticText.empty}</div> }
            </div>
        </>
    )
};

const mapStateToProps = state => ({
    currentOperator: state.operator.operatorProfile,
});

export default connect(mapStateToProps, {moveQueueItemToDone})(PickupsTable);