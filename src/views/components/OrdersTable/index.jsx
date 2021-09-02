import React, { useState, useEffect } from 'react';
import DeclarationModal from 'views/components/DeclarationModal';
import { connect } from 'react-redux';
import moment from 'moment';
import { dateFormat } from 'helpers/constants';
import Pagination from 'views/components/Pagination';
import Loading from 'views/components/Loading';
import CommentModal from "views/components/CommentModal";
import './index.scss';

const staticText = {
    trackingCode: 'Tracking code',
    link: 'Link',
    more: 'More',
    warehouse: 'Warehouse',
    shop: 'Shop',
    updatedAt: 'Status updated at',
    weight: 'Weight',
    productPrice: 'Product price',
    deliveryCost: 'Delivery cost',
    status: 'Status',
    actions: 'Actions',
    kg: 'kg',
    add: 'Add',
    change: 'Edit',
    view: 'View',
    delete: 'Delete',
    pay: 'Pay',
    tableTitle: 'Orders',
    doneBtn: 'Done',
    payOrderBtn: 'Pay for Orders',
    userComment: 'User comment',
    operatorComment: 'Operator comment',
    quantity: 'Quantity',
    size: 'Size',
    color: 'Color',
    newDclrBtn: 'Create Declaration with Orders',
    empty: 'No orders',
    orderCode: 'Order code',
    deliveryCode: 'Delivery code',
};
const defaultDeclarationModalOptions = {
    isModalOpen: false,
    orders: []
};
const defaultCommentModalOptions = {
    isModalOpen: false,
    assignment: {},
};

const OrdersTable = props => {
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [declarationModalOptions, setDeclarationModalOptions] = useState(defaultDeclarationModalOptions);
    const [commentModalOptions, setCommentModalOptions] = useState(defaultCommentModalOptions);

    const { orders, statuses, currencies, panel, loading, onOrderChange, currentOperator } = props;

    const toggleSelectAll = e => {
        if (selectAll) setSelected([]);
        else {
            const selected = [];
            orders.results.forEach(order => {
                selected.push(order.id);
            });
            setSelected(selected);
        }
    };

    const toggleSelect = (id) => {
        const checked = selected.includes(id);

        setSelected(prevState => {
            return !checked ? [ ...prevState, id ] : prevState.filter(item => item !== id);
        });
    };

    const getStatusName = id => {
        const status = statuses.find(status => status.id === id)

        if (status) return status.name;
    };

    const getCurrencySymbol = id => {
        const currency = currencies.find(currency => currency.id === id)

        if (currency) return currency.symbol;
    };

    const handleOpenLink = (e, link) => {
        window.open(link, '_blank');
        e.stopPropagation();
    };

    useEffect(() => {
        setSelectedOrders(orders.results.filter(order => selected.includes(order.id)));

        if (selected.length && selected.length === orders.results.length) setSelectAll(true);
        else setSelectAll(false);
    }, [selected, orders]);

    useEffect(() => {
        setSelected([]);
    }, [orders]);

    return (
        <>
            { commentModalOptions.isModalOpen &&
                <CommentModal
                    isModalOpen={true}
                    commentsContainer={commentModalOptions.assignment}
                    type={(panel === 'warehouse' && currentOperator.canAddComment) ? 'edit' : 'view'}
                    onClose={() => setCommentModalOptions(defaultCommentModalOptions)}
                    onSuccess={() => {
                        setCommentModalOptions(defaultCommentModalOptions);
                        onOrderChange();
                    }}
                />
            }
            { declarationModalOptions.isModalOpen &&
                <DeclarationModal 
                    isModalOpen={declarationModalOptions.isModalOpen}
                    orders={declarationModalOptions.orders}
                    panel={panel}
                    modalType={'new'}
                    forOrders={true}
                    onClose={() => setDeclarationModalOptions(defaultDeclarationModalOptions)}
                    onSuccess={(id) => {
                        setDeclarationModalOptions(defaultDeclarationModalOptions);
                        onOrderChange(id)
                    }}
                />
            }
            <div className='px-2 bg-white d-flex justify-content-between align-items-center'>
                <h6 className='m-0 py-3'>{staticText.tableTitle}</h6>
                { selected.length ? 
                    <div className="show-selected">
                        {selected.length} order(s) selected 
                    </div>
                    : ''
                }
                {
                    (currentOperator.canCreateDeclaration && panel === 'warehouse') &&
                    <button 
                        className='btn btn-outline-info' 
                        onClick={() => setDeclarationModalOptions({isModalOpen: true, orders: selectedOrders})}
                        disabled={!selected.length}
                    >
                        {staticText.newDclrBtn}
                    </button>
                }
            </div>
            <div className='tabular overflow-auto'>
                { loading ?
                    <>
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
                                            <span>{staticText.trackingCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.link}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.orderCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.deliveryCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.status}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.productPrice}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.quantity}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.size}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.color}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.userComment}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.operatorComment}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.updatedAt}</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                        <Loading />
                    </>
                    :
                    <>
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
                                            <span>{staticText.trackingCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.link}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.orderCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.deliveryCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.status}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.productPrice}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.quantity}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.size}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.color}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.userComment}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.operatorComment}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="text">
                                            <span>{staticText.updatedAt}</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                orders.results.map((order, index) => {
                                    const lastComment = order.assignment?.comments[order.assignment.comments.length - 1];
                                    return (
                                        <tr key={index} onClick={() => toggleSelect(order.id)} className={selected.indexOf(order.id) > -1 ? 'checked' : ''}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selected.indexOf(order.id) > -1}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                {
                                                    currentOperator.canViewOrder ?
                                                        <button
                                                            className="btn btn-link btn-sm px-0"
                                                            onClick={(e) => handleOpenLink(e, order.adminLink)}
                                                        >{order.trackingCode}
                                                        </button>
                                                        :
                                                        order.trackingCode
                                                }

                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-link btn-sm table-link px-0"
                                                    onClick={(e) => handleOpenLink(e, order.productUrl)}
                                                >{order.productUrl}
                                                </button>
                                            </td>
                                            <td>
                                                {order.orderCode}
                                            </td>
                                            <td>
                                                {order.deliveryCode}
                                            </td>
                                            <td>
                                                {getStatusName(order.status)}
                                            </td>
                                            <td>
                                                {order.productPrice} {getCurrencySymbol(order.productPriceCurrency)}
                                            </td>
                                            <td>
                                                {order.productQuantity}
                                            </td>
                                            <td>
                                                {order.productSize}
                                            </td>
                                            <td>
                                                {order.productColor}
                                            </td>
                                            <td>
                                                {order.comment}
                                            </td>
                                            <td>
                                                { lastComment ?
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
                                                                    assignment: order.assignment,
                                                                });
                                                            }}
                                                        >
                                                            {staticText.more}
                                                        </button>
                                                    </>
                                                    :
                                                    (panel === 'warehouse' && currentOperator.canAddComment) &&
                                                    <button
                                                        className={'btn btn-outline-secondary btn-sm py-1 commentlink'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCommentModalOptions({
                                                                isModalOpen: true,
                                                                assignment: order.assignment,
                                                            });
                                                        }}
                                                    >
                                                        {staticText.add}
                                                    </button>
                                                }
                                            </td>
                                            <td>
                                                {order.statusUpdatedAt ? moment(order.statusUpdatedAt).format(dateFormat) : 'n/a'}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        { !orders.results.length ?
                            <div className='p-3 bg-white'>{staticText.empty}</div>
                            :
                            <Pagination
                                pageCount={orders.pageCount}
                                currentPage={orders.currentPage}
                                type={'order'}
                            />
                        }
                    </>
                }
            </div>
        </>
    )
};

const mapStateToProps = state => ({
    statuses: state.statuses.orderStatuses,
    currencies: state.currencies,
    loading: state.loading.ordersLoading,
    currentOperator: state.operator.operatorProfile,
});

export default connect(mapStateToProps)(OrdersTable);