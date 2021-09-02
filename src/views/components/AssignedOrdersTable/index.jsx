import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { round } from 'helpers/functions';
import moment from 'moment';
import { dateFormat } from 'helpers/constants';
import PaymentModal from 'views/components/PaymentModal/ForOrders';
import MarkAsDoneModal from './MarkAsDoneModal';
import CommentModal from "views/components/CommentModal";
import DeleteModal from "./DeleteModal";
import ChangeOperatorModal from "./ChangeOperatorModal";
import OrderModal from "views/components/OrderModal";
import './index.scss';

const defaultDeleteModalOptions = {
    isModalOpen: false,
    ids: []
};
const defaultCompletedModalOptions = {
    isModalOpen: false,
    orders: []
};
const defaultCommentModalOptions = {
    isModalOpen: false,
    assignment: {},
};
const defaultOperatorModalOptions = {
    isModalOpen: false,
    assignment: {},
};
const defaultPaymentModalOptions = {
    isModalOpen: false,
    order: {},
};
const defaultOrderModalOptions = {
    isModalOpen: false,
    id: 0,
};

const staticText = {
    shop: 'Shop',
    updatedAt: 'Updated at',
    status: 'Status',
    change: 'Edit',
    view: 'View',
    delete: 'Delete',
    pay: 'Pay',
    refund: 'Refund',
    link: 'Link',
    totalCost: 'Total Cost',
    productQuantity: 'Qty',
    productSize: 'Size',
    productPrice: 'Price',
    productColor: 'Color',
    comment: 'User Comment',
    actions: 'Actions',
    doneBtn: 'Mark as Completed',
    deleteBtn: 'Delete Selected',
    total: 'Total',
    clientCode: 'Client Code',
    clientName: 'Client Name',
    phone: 'Phone',
    balances: 'Balances',
    assignedTo: 'Assigned to',
    deleteModalTitle: 'Delete Orders',
    deleteModalMessage: 'Are you sure you want to delete selected order(s)?',
    lastComment: 'Last comment'
};

const handleOpenLink = (e, link) => {
    window.open(link, '_blank');
    e.stopPropagation();
};

const AssignedOrdersTable = props => {
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [baseCurrency, setBaseCurrency] = useState({});
    const [status, setStatus] = useState({});
    // const [total, setTotal] = useState('');
    const [deleteModalOptions, setDeleteModalOptions] = useState(defaultDeleteModalOptions);
    const [completedModalOptions, setCompletedModalOptions] = useState(defaultCompletedModalOptions);
    const [commentModalOptions, setCommentModalOptions] = useState(defaultCommentModalOptions);
    const [operatorModalOptions, setOperatorModalOptions] = useState(defaultOperatorModalOptions);
    const [paymentModalOptions, setPaymentModalOptions] = useState(defaultPaymentModalOptions);
    const [orderModalOptions, setOrderModalOptions] = useState(defaultOrderModalOptions);

    // from props
    const { assignment, statuses, selectedStatus, onOrderChange } = props;
    const { user, orders } = assignment;
    // from state
    const { currencies, currentOperator, mobileOperators } = props;

    const toggleSelectAll = () => {
        if (selectAll) setSelected([]);
        else {
            const selected = [];
            orders.forEach(order => {
                selected.push(order.id);
            });
            setSelected(selected);
        }
    };

    const toggleSelect = (id) => {
        const checked = selected.indexOf(id);

        setSelected(prevState => {
            return checked === -1 ? [ ...prevState, id ] : prevState.filter(item => item !== id);
        })
    };

    const getStatusName = id => {
        const status = statuses.find(status => status.id === id);

        if (status) return status.name;
    };

    const getCurrencySymbol = id => {
        const currency = currencies.find(currency => currency.id === id);

        if (currency) return currency.symbol;
    };

    const calcSelected = (data, selected) => {
        const selectedOrders = data.filter(item => selected.includes(item.id));
        const orderTotals = [];

        currencies.forEach(currency => {
            const ordersForCurrency = selectedOrders.filter(order => currency.id === order.totalPriceCurrency);
            if (ordersForCurrency.length) {
                orderTotals.push({
                    ...currency,
                    orderTotal: ordersForCurrency.reduce((sum, item) => round(parseFloat(sum) + parseFloat(item.totalPrice), 2), 0)
                });
            }
        });

        return (
            <ul className='list-unstyled m-0 text-right'>
                { orderTotals.map((item, index) => (
                    <li key={index}>
                        { item.isBase ?
                            `${item.orderTotal}${item.symbol}`
                            :
                            `${item.orderTotal}${item.symbol} (${round(item.orderTotal * item.rate, 2)}${baseCurrency.symbol})`
                        }
                    </li>
                ))}
            </ul>
        )
    };

    // get base currency
    useEffect(() => {
       setBaseCurrency(currencies.find(currency => currency.isBase))
    }, [currencies]);

    // get selected orders from ids; it is useful in a few places; probably should go
    useEffect(() => {
        setSelectedOrders(orders.filter(order => selected.includes(order.id)));

        if (selected.length && selected.length === orders.length) setSelectAll(true);
        else setSelectAll(false);
    }, [selected, orders]);

    useEffect(() => {
        const status = statuses.find(status => status.id === parseInt(selectedStatus));
        setStatus(status);
    }, [statuses, selectedStatus]);

    return (
        <div className='mb-5'>
            { deleteModalOptions.isModalOpen &&
                <DeleteModal
                    isModalOpen={true}
                    ids={deleteModalOptions.ids}
                    onClose={() => setDeleteModalOptions(defaultDeleteModalOptions)}
                    onSuccess={(ids) => {
                        setDeleteModalOptions(defaultDeleteModalOptions);
                        onOrderChange(ids);
                    }}
                />
            }
            { completedModalOptions.isModalOpen &&
                <MarkAsDoneModal
                    isModalOpen={true}
                    orders={completedModalOptions.orders}
                    onClose={() => setCompletedModalOptions(defaultCompletedModalOptions)}
                    onSuccess={() => {
                        setCompletedModalOptions(defaultCompletedModalOptions);
                        onOrderChange();
                    }}
                />
            }
            { commentModalOptions.isModalOpen &&
                <CommentModal
                    isModalOpen={true}
                    commentsContainer={commentModalOptions.assignment}
                    type={currentOperator.canAddComment ? 'edit' : 'view'}
                    onClose={() => setCommentModalOptions(defaultCommentModalOptions)}
                    onSuccess={() => {
                        setCommentModalOptions(defaultCommentModalOptions);
                        onOrderChange();
                    }}
                />
            }
            { operatorModalOptions.isModalOpen &&
                <ChangeOperatorModal
                    isModalOpen={true}
                    assignment={operatorModalOptions.assignment}
                    onClose={() => setOperatorModalOptions(defaultOperatorModalOptions)}
                    onSuccess={() => {
                        setOperatorModalOptions(defaultOperatorModalOptions);
                        onOrderChange();
                    }}
                />
            }
            { paymentModalOptions.isModalOpen &&
                <PaymentModal
                    isModalOpen={true}
                    order={paymentModalOptions.order}
                    user={user}
                    onClose={() => setPaymentModalOptions(defaultPaymentModalOptions)}
                    onSuccess={() => {
                        setPaymentModalOptions(defaultPaymentModalOptions);
                        onOrderChange();
                    }}
                />
            }
            { orderModalOptions.isModalOpen &&
                <OrderModal
                    isModalOpen={true}
                    id={orderModalOptions.id}
                    onClose={() => setOrderModalOptions(defaultOrderModalOptions)}
                    onSuccess={() => {
                        setOrderModalOptions(defaultOrderModalOptions);
                        onOrderChange();
                    }}
                />
            }

            <div className='p-2 bg-white d-flex justify-content-between align-items-center'>
                <ul className="list-unstyled small m-0">
                    <li><span className="text-secondary">{staticText.clientCode}:</span> <strong>#{user.clientCode}</strong></li>
                    <li><span className="text-secondary">{staticText.clientName}:</span> <strong>{user.fullName}</strong></li>
                </ul>

                <ul className="list-unstyled small m-0">
                    <li>
                        <span className="text-secondary">{staticText.phone}:</span>
                        <strong>{mobileOperators.find(operator => operator.id === user.phoneOperator)?.prefix}{user.phoneNumber}</strong>
                    </li>
                </ul>

                <div className="d-flex align-items-center">
                    <span className="mr-2">{staticText.balances}:</span>
                    { user.wallets.map((wallet, index) => (
                        <span key={index} className="badge badge-dark mr-1 py-2">{wallet.amount} {wallet.currency.symbol}</span>
                    ))}
                </div>

                <div>
                    {
                        (status.level === 'base' && currentOperator.canChangeAssignmentStatus) &&
                        <button
                            className='btn btn-sm btn-success ml-2'
                            onClick={() => {
                                setCompletedModalOptions({
                                    isModalOpen: true,
                                    orders: selectedOrders
                                })
                            }}
                            disabled={!selected.length}
                        >
                            {staticText.doneBtn}
                        </button>
                    }
                    {
                        (status?.level !== 'deleted' && currentOperator.canRefundOrders) &&
                        <button
                            className='btn btn-sm btn-danger ml-2'
                            onClick={() => {
                                const ids = selectedOrders.map(order => order.assignment.id);
                                setDeleteModalOptions({
                                    isModalOpen: true,
                                    ids
                                })
                            }}
                            disabled={!selected.length}
                        >
                            {staticText.deleteBtn}
                        </button>
                    }
                </div>

            </div>
            <div className='tabular overflow-auto'>
                <table className='m-0'>
                    <thead>
                        <tr>
                            <th scope='col' className='action-checkbox-column'>
                                <div className="text">
                                    <span>
                                        <input type="checkbox" id='action-toggle' onChange={toggleSelectAll} checked={selectAll}/>
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.link}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.status}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.totalCost}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.productQuantity}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.productPrice}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.productSize}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.productColor}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.comment}</span>
                                </div>
                            </th>
                            <th>
                                <div className="text">
                                    <span>{staticText.actions}</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { orders.map((order, index) => {
                            const { assignment } = order;
                            const { operator, comments } = assignment;
                            const lastComment = comments[comments.length - 1];
                            return (
                                <tr key={index} onClick={() => toggleSelect(order.id)} className={selected.indexOf(order.id) > -1 ? 'checked' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selected.indexOf(order.id) > -1}
                                            readOnly
                                        />
                                    </td>
                                    <td className={'d-flex flex-column'} style={{maxWidth: '400px'}}>
                                        <button
                                            className='btn btn-link btn-sm table-link text-left px-0 pt-0'
                                            onClick={(e) => handleOpenLink(e, order.productUrl)}
                                        >
                                            {order.productUrl}
                                        </button>
                                        <small>{staticText.assignedTo}: {operator.clientCode} - {operator.fullName}</small>
                                        { lastComment ?
                                            <small className={'text-danger font-weight-bold my-1'}>
                                                {moment(lastComment.createdAt).format(dateFormat)} - {lastComment.user.fullName}: <br/>
                                                {lastComment.body}
                                            </small>
                                            : ''
                                        }
                                        <small><strong>{staticText.updatedAt}:</strong> {moment(order.updatedAt).format(dateFormat)}</small>
                                    </td>
                                    <td>
                                        {getStatusName(order.assignment.status)}
                                    </td>
                                    <td>
                                        {order.totalPrice} {getCurrencySymbol(order.totalPriceCurrency)}
                                    </td>
                                    <td>
                                        {order.productQuantity}
                                    </td>
                                    <td>
                                        {order.productPrice} {getCurrencySymbol(order.productPriceCurrency)}
                                    </td>
                                    <td>
                                        {order.productSize}
                                    </td>
                                    <td>
                                        {order.productColor}
                                    </td>
                                    <td style={{maxWidth: '250px'}}>
                                        {order.comment}
                                    </td>
                                    <td>
                                        <div className={'d-flex flex-nowrap justify-content-between align-items-center'}>
                                            <div className={'d-flex flex-nowrap'}>
                                                {
                                                    (status?.level === 'base' && currentOperator.canChangeAssignmentStatus) &&
                                                    <button
                                                        className={'btn btn-outline-success donelink empty p-1 mr-1'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCompletedModalOptions({
                                                                isModalOpen: true,
                                                                orders: [order]
                                                            })
                                                        }}
                                                    />
                                                }
                                                {
                                                    currentOperator.canViewOrder &&
                                                    <button
                                                        className={'btn btn-outline-secondary viewlink empty p-1 mr-1'}
                                                        onClick={(e) => handleOpenLink(e, order.adminLink)}
                                                    />
                                                }
                                                {
                                                    (currentOperator.canAddComment || lastComment) &&
                                                    <button
                                                        className={'btn btn-outline-info commentlink empty p-1 mr-1'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCommentModalOptions({
                                                                isModalOpen: true,
                                                                assignment,
                                                            });
                                                        }}
                                                    />
                                                }
                                                {
                                                    (status.level === 'base' && currentOperator.canChangeOperator) &&
                                                    <button
                                                        className={'btn btn-outline-info operatorlink empty p-1 mr-1'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOperatorModalOptions({
                                                                isModalOpen: true,
                                                                assignment
                                                            })
                                                        }}
                                                    />
                                                }
                                                {
                                                    (status?.level !== 'deleted' && currentOperator.canEditOrder) &&
                                                    <button
                                                        className={'btn btn-outline-info change-link empty p-1 mr-1'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOrderModalOptions({
                                                                isModalOpen: true,
                                                                id: order.id
                                                            })
                                                        }}
                                                    />
                                                }
                                                {
                                                    (status?.level !== 'deleted' && currentOperator.canPayRemainder) &&
                                                    <button
                                                        className={'btn btn-outline-info btn-sm paylink empty p-1 mr-1'}
                                                        disabled={order.isRemainderPaid}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPaymentModalOptions({
                                                                isModalOpen: true,
                                                                order,
                                                            });
                                                        }}
                                                    />
                                                }
                                                {
                                                    (status?.level !== 'deleted' && currentOperator.canRefundOrders) &&
                                                    <button
                                                        className={'btn btn-outline-danger delete-link empty p-1 mr-1'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteModalOptions({
                                                                isModalOpen: true,
                                                                ids: [assignment.id]
                                                            })
                                                        }}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            { selected.length > 0 &&
                <div className='p-2 bg-white border d-flex justify-content-end'>
                    <strong className='mr-3'>{staticText.total}:</strong>
                    {calcSelected(orders, selected)}
                </div>
            }
        </div>
    )
};

const mapStateToProps = state => ({
    currencies: state.currencies,
    currentOperator: state.operator.operatorProfile,
    mobileOperators: state.choices.mobileOperators,
});

export default connect(mapStateToProps)(AssignedOrdersTable);