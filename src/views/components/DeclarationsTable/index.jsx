import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import DeclarationModal from 'views/components/DeclarationModal';
import PaymentModal from 'views/components/PaymentModal/ForDeclarations';
import QueueModal from 'views/components/QueueModal';
import CommentModal from "views/components/CommentModal";
import Pagination from 'views/components/Pagination';
import Loading from 'views/components/Loading';
import moment from 'moment';
import { dateFormat } from 'helpers/constants';
import './index.scss';

const staticText = {
    trackingCode: 'Tracking code',
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
    pickups: 'Pickup',
    tableTitle: 'Declarations',
    pickupsBtn: 'Send to Pickup',
    payDclrBtn: 'Pay for Declarations',
    dclrSaveMessage: 'Declaration Saved',
    newDclrBtn: 'Create Declaration',
    declarationsSelected: 'declaration(s) selected',
    empty: 'No declarations',
    doneModalTitle: 'Move to Done',
    doneModalMessage: 'Are you sure you want to mark the selected declaration(s) as done?',
    operatorComment: 'Operator comment',
    more: 'More',
    bag: 'Bag',
};
const defaultDeclarationModalOptions = {
    isModalOpen: false,
    declaration: null,
    type: ''
};
const defaultPaymentModalOptions = {
    isModalOpen: false,
    declarations: [],
};
const defaultQueueModalOptions = {
    isModalOpen: false,
    ids: []
};
const defaultCommentModalOptions = {
    isModalOpen: false,
    declaration: {},
};

const DeclarationsTable = props => {
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedDeclarations, setSelectedDeclarations] = useState([]);
    const [declarationModalOptions, setDeclarationModalOptions] = useState(defaultDeclarationModalOptions);
    const [paymentModalOptions, setPaymentModalOptions] = useState(defaultPaymentModalOptions);
    const [queueModalOptions, setQueueModalOptions] = useState(defaultQueueModalOptions);
    const [isBulkPaymentEnabled, setBulkPaymentEnabled] = useState(false);
    const [isBulkPickupEnabled, setBulkPickupEnabled] = useState(false);
    const [commentModalOptions, setCommentModalOptions] = useState(defaultCommentModalOptions);
    const [isOperatorCommentColumnVisible, setOperatorCommentColumnVisible] = useState(false);

    // from props
    const { declarations, className, panel, isPaymentEnabled, onDeclarationChange, onPayment } = props;
    // from state
    const { currencies, warehouses, statuses, loading, currentOperator, bags } = props;

    const handleChangeDclr = (e, declaration) => {
        setDeclarationModalOptions({
            isModalOpen: true,
            declaration,
            type: 'edit'
        });
        e.stopPropagation();
    };

    const handleNewDclr = () => {
        setDeclarationModalOptions({
            isModalOpen: true,
            declaration: null,
            type: 'new',
        });
    };

    const handleOpenLink = (e, link) => {
        window.open(link, '_blank');
        e.stopPropagation();
    };

    const toggleSelectAll = () => {
        if (selectAll) setSelected([]);
        else {
            const selected = [];
            declarations.results.forEach(declaration => {
                selected.push(declaration.id);
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
        const status = statuses.find(status => status.id === id);

        if (status) return status.name;
    };

    const getWarehouseName = id => {
        const warehouse = warehouses.find(warehouse => warehouse.id === id);

        if (warehouse) return warehouse.displayName;
    };

    const getCurrencySymbol = id => {
        const currency = currencies.find(currency => currency.id === id);

        if (currency) return currency.symbol;
    };

    const getBagName = id => {
        const bag = bags.find(bag => bag.id === id);

        if (bag) return bag.name;
    }

    const payDeclarations = declarations => {
        setPaymentModalOptions({
            isModalOpen: true,
            declarations
        })
    };

    const moveDeclarationsToQueue = declarationIds => {
        setQueueModalOptions({
            isModalOpen: true,
            ids: declarationIds
        })
    };

    useEffect(() => {
        setSelectedDeclarations(declarations.results.filter(declaration => selected.includes(declaration.id)));

        if (selected.length && selected.length === declarations.results.length) setSelectAll(true);
        else setSelectAll(false);
    }, [selected, declarations]);

    useEffect(() => {
        setSelected([]);

        const isOperatorCommentColumnVisible = declarations.results.some(declaration => declaration.comments.length)
        setOperatorCommentColumnVisible(isOperatorCommentColumnVisible);
    }, [declarations]);

    useEffect(() => {
        if (selectedDeclarations.length) {
            setBulkPickupEnabled(selectedDeclarations.every(declaration => declaration.isPaid));
            setBulkPaymentEnabled(selectedDeclarations.every(declaration => !declaration.isPaid));
        } else {
            setBulkPickupEnabled(false);
            setBulkPaymentEnabled(false);
        }
    }, [selectedDeclarations]);

    return (
        <div className={className}>
            { commentModalOptions.isModalOpen &&
                <CommentModal
                    isModalOpen={true}
                    commentsContainer={commentModalOptions.declaration}
                    type={'view'}
                    onClose={() => setCommentModalOptions(defaultCommentModalOptions)}
                />
            }
            { declarationModalOptions.isModalOpen &&
                <DeclarationModal 
                    isModalOpen={true}
                    declarationToEdit={declarationModalOptions.declaration}
                    modalType={declarationModalOptions.type}
                    panel={panel}
                    onClose={() => setDeclarationModalOptions(defaultDeclarationModalOptions)}
                    onSuccess={(id) => {
                        setDeclarationModalOptions(defaultDeclarationModalOptions);
                        onDeclarationChange(id);
                    }}
                />
            }
            { paymentModalOptions.isModalOpen &&
                <PaymentModal
                    isModalOpen={true}
                    declarations={paymentModalOptions.declarations}
                    // panel={panel}
                    onClose={() => setPaymentModalOptions(defaultPaymentModalOptions)}
                    onSuccess={() => {
                        setPaymentModalOptions(defaultPaymentModalOptions);
                        onDeclarationChange();
                        onPayment();
                    }}
                />
            }
            { queueModalOptions.isModalOpen &&
                <QueueModal
                    isModalOpen={true}
                    ids={queueModalOptions.ids}
                    onClose={() => setQueueModalOptions(defaultQueueModalOptions)}
                    onSuccess={() => {
                        setQueueModalOptions(defaultQueueModalOptions);
                        onDeclarationChange();
                    }}
                />
            }
            <div className='px-2 bg-white d-flex justify-content-between align-items-center'>
                <h6 className='m-0 py-3'>{staticText.tableTitle}</h6>
                { selected.length ?
                    <div className='show-selected'>
                        {selected.length} {staticText.declarationsSelected}
                    </div>
                    : ''
                }
                {
                    isPaymentEnabled && 
                    <div className='d-flex'>
                        {
                            currentOperator.canChangeDeclarationStatus &&
                            <button
                                className='btn btn-outline-success ml-2'
                                disabled={!isBulkPickupEnabled}
                                onClick={() => moveDeclarationsToQueue(selected)}
                            >
                                {staticText.pickupsBtn}
                            </button>
                        }
                        {
                            currentOperator.canPayDeclaration &&
                            <button
                                className='btn btn-outline-success ml-2'
                                disabled={!isBulkPaymentEnabled}
                                onClick={() => payDeclarations(selectedDeclarations)}
                            >
                                {staticText.payDclrBtn}
                            </button>
                        }
                    </div> 
                }
                {
                    (currentOperator.canCreateDeclaration && panel === 'warehouse') &&
                    <button className='btn btn-outline-info' onClick={handleNewDclr}>{staticText.newDclrBtn}</button>
                }
            </div>
            <div className='tabular'>
                { loading ?
                    <>
                        <table className='m-0'>
                            <thead>
                                <tr>
                                    <th scope='col' className='action-checkbox-column'>
                                        <div className='text'>
                                        <span>
                                            <input type='checkbox' id='action-toggle' onChange={toggleSelectAll} checked={selectAll}/>
                                        </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.trackingCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.warehouse}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.status}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.shop}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.weight}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.productPrice}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.deliveryCost}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={'text'}>
                                            <span>{staticText.operatorComment}</span>
                                        </div>
                                    </th>
                                    {
                                        panel === 'warehouse' &&
                                        <th>
                                            <div className={'text'}>
                                                <span>{staticText.bag}</span>
                                            </div>
                                        </th>
                                    }
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.updatedAt}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.actions}</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                        <Loading/>
                    </>
                    :
                    <>
                        <table className='m-0'>
                            <thead>
                                <tr>
                                    <th scope='col' className='action-checkbox-column'>
                                        <div className='text'>
                                        <span>
                                            <input type='checkbox' id='action-toggle' onChange={toggleSelectAll} checked={selectAll}/>
                                        </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.trackingCode}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.warehouse}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.status}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.shop}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.weight}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.productPrice}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.deliveryCost}</span>
                                        </div>
                                    </th>
                                    {
                                        isOperatorCommentColumnVisible && 
                                        <th>
                                            <div className={'text'}>
                                                <span>{staticText.operatorComment}</span>
                                            </div>
                                        </th>
                                    }
                                    {
                                        panel === 'warehouse' &&
                                        <th>
                                            <div className={'text'}>
                                                <span>{staticText.bag}</span>
                                            </div>
                                        </th>
                                    }
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.updatedAt}</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='text'>
                                            <span>{staticText.actions}</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                declarations.results.map((declaration, index) => {
                                    const lastComment = declaration.comments && declaration.comments[declaration.comments.length - 1];
                                    return (
                                        <tr key={index} onClick={() => toggleSelect(declaration.id)} className={selected.indexOf(declaration.id) > -1 ? 'checked' : ''}>
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    checked={selected.indexOf(declaration.id) > -1}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                {
                                                    currentOperator.canViewDeclaration ?
                                                        <button
                                                            className='btn btn-link btn-sm px-0'
                                                            onClick={(e) => handleOpenLink(e, declaration.adminLink)}
                                                        >{declaration.trackingCode}
                                                        </button>
                                                        :
                                                        declaration.trackingCode
                                                }

                                            </td>
                                            <td>
                                                {getWarehouseName(declaration.destinationWarehouse)}
                                            </td>
                                            <td>
                                                {getStatusName(declaration.status)}
                                            </td>
                                            <td>
                                                {declaration.shop}
                                            </td>
                                            <td>
                                                {declaration.weight} kg
                                            </td>
                                            <td>
                                                {declaration.productPrice} {getCurrencySymbol(declaration.productPriceCurrency)}
                                            </td>
                                            <td>
                                                {declaration.totalPrice} {getCurrencySymbol(declaration.totalPriceCurrency)}
                                            </td>
                                            {
                                                isOperatorCommentColumnVisible &&
                                                <td>
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
                                                </td>
                                            }
                                            {
                                                panel === 'warehouse' &&
                                                <td>{getBagName(declaration.bag)}</td>
                                            }
                                            <td>
                                                {declaration.statusUpdatedAt ? moment(declaration.statusUpdatedAt).format(dateFormat) : 'n/a'}
                                            </td>
                                            <td>
                                                {
                                                    currentOperator.canEditDeclaration &&
                                                    <button
                                                        className='change-link btn btn-outline-info mr-2'
                                                        onClick={(e) => handleChangeDclr(e, declaration)}
                                                    >
                                                        {staticText.change}
                                                    </button>
                                                }
                                                {
                                                    (isPaymentEnabled && currentOperator.canPayDeclaration && !declaration.isPaid) &&
                                                    <button
                                                        className='paylink btn btn-outline-success'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            payDeclarations([declaration]);
                                                        }}
                                                    >
                                                        {staticText.pay}
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        { !declarations.results.length ?
                            <div className='p-3 bg-white'>{staticText.empty}</div>
                            :
                            <Pagination
                                pageCount={declarations.pageCount}
                                currentPage={declarations.currentPage}
                                type={'declaration'}
                            />
                        }
                    </>
                }
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    statuses: state.statuses.declarationStatuses,
    warehouses: state.warehouses,
    currencies: state.currencies,
    loading: state.loading.declarationsLoading,
    currentOperator: state.operator.operatorProfile,
    bags: state.bags,
});

export default connect(mapStateToProps)(DeclarationsTable);