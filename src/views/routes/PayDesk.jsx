import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { fetchUserProfile } from 'state/reducers/user/actions';
import { fetchOrderStatuses, fetchDeclarationStatuses } from 'state/reducers/status/actions';
import { fetchDeclarations, fetchOrders } from 'state/reducers/paydesk/actions';
import UserInfoCard from 'views/components/UserInfoCard';
import DeclarationsTable from 'views/components/DeclarationsTable';
import OrdersTable from 'views/components/OrdersTable';
import StatusNav from 'views/components/StatusNav';
import Search from 'views/components/Search';
import { updateParams, removeParams } from "helpers/functions";

const staticText = {
    searchPlaceholder: 'start your search with client code, name or email...',
    switch: 'Switch to',
};
const actionTypes = [{
    query: 'declaration',
    title: 'Declarations'
}, {
    query: 'order',
    title: 'Orders'
}];
const panel = 'paydesk';
// let count = 0;

class PayDesk extends React.Component {
    state = {
        actionType: actionTypes[0],
        selectedStatus: 0,
        isPaymentEnabled: false,
    };

    componentDidMount() {
        this.props.fetchDeclarationStatuses();
        this.props.fetchOrderStatuses();

        const params = queryString.parse(this.props.location.search);
        const { user, action } = params;

        if (user) this.fetchUserData(user);
        // else clearParams(this.props);
        if (action && action !== this.state.actionType.query) {
            const nextAction = actionTypes.find(type => type.query === action);
            if (nextAction) this.setState({ actionType: nextAction });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const nextParams = queryString.parse(this.props.location.search);
        const prevParams = queryString.parse(prevProps.location.search);

        const { user, action, status, declarationpage, orderpage } = nextParams;
        const { selectedStatus } = this.state;

        if (user) {
            if (user !== prevParams.user) {
                removeParams(this.props, ['declarationpage', 'orderpage']);
                this.fetchUserData(user);
                this.fetchPaydeskData(user, action, selectedStatus);
            }

            if (this.props.declarationStatuses.length && this.props.orderStatuses.length) {
                if (!status && !selectedStatus) {
                    const selectedStatus = this.getDefaultStatus(this.getStatuses(action)).id;
                    this.setState({ selectedStatus });
                    this.fetchPaydeskData(user, action, selectedStatus, declarationpage, orderpage);
                }
                else if (status && !selectedStatus) {
                    this.setState({ selectedStatus: status });
                    this.fetchPaydeskData(user, action, status, declarationpage, orderpage);
                }
                else if (status && status !== prevParams.status) {
                    removeParams(this.props, ['declarationpage', 'orderpage']);
                    this.setState({ selectedStatus: status });
                    this.fetchPaydeskData(user, action, status);
                }
            }

            if (action !== prevParams.action) {
                removeParams(this.props, ['declarationpage', 'orderpage', 'status']);
                const selectedStatus = this.getDefaultStatus(this.getStatuses(action))?.id;
                this.setState({selectedStatus});
                this.fetchPaydeskData(user, action, selectedStatus);
            }

            if (declarationpage && declarationpage !== prevParams.declarationpage) {
                this.fetchPaydeskData(user, action, status, declarationpage, orderpage);
            }

            if (orderpage && orderpage !== prevParams.orderpage) {
                this.fetchPaydeskData(user, action, status, declarationpage, orderpage);
            }
        }
    }

    fetchPaydeskData = (user, action, status, declarationPage, orderPage) => {
        if (action === 'order') {
            this.props.fetchOrders({user, status, page: orderPage});
        } else {
            this.props.fetchDeclarations({user, status, page: declarationPage});
        }
    };

    fetchUserData = (user) => {
        this.props.fetchUserProfile(user);
    };

    getStatuses = (action) => {
        let statuses;
        if (action === 'order') {
            statuses = this.props.orderStatuses;
        } else {
            statuses = this.props.declarationStatuses;
        }
        return statuses;
    };

    getDefaultStatus = (statuses) => statuses.find(status => status.isShownByDefault);

    checkIfPaymentEnabled = (statuses, action, selectedStatus) => {
        if (action === 'order') return false;
        return statuses.find(status => status.id === parseInt(selectedStatus))?.canBePayedFromPaydesk;
    };

    handleActionChange = actionType => {
        updateParams(this.props, 'action', actionType.query);
        this.setState({ actionType })
    };

    handleDeclarationChange = () => {
        const params = queryString.parse(this.props.location.search);

        const { user, action, declarationpage, orderpage } = params;
        const { selectedStatus } = this.state;
        this.fetchPaydeskData(user, action, selectedStatus, declarationpage, orderpage);
    };

    render() {
        const { actionType, selectedStatus } = this.state;
        const { paydeskItems } = this.props;
        const params = queryString.parse(this.props.location.search);
        const statuses = this.getStatuses(params.action);
        const isPaymentEnabled = this.checkIfPaymentEnabled(statuses, params.action, selectedStatus);
        const availableActionTypes = actionTypes.filter(item => item.query !== actionType.query);

        return (
            <div className='pay-desk'>
                <div className="row align-items-center mb-5">
                    <div className="col-8">
                        <Search placeholder={staticText.searchPlaceholder} query={'user'}/>
                    </div>
                    <div className="col-4">
                        <div className='text-right'>
                            {
                                availableActionTypes.map(actionType => (
                                    <button
                                        key={actionType.query}
                                        onClick={() => this.handleActionChange(actionType)}
                                        className='btn btn-outline-info ml-1'
                                    >
                                        {staticText.switch} {actionType.title}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
                { params.user &&
                <>


                    <UserInfoCard className='mb-3'/>

                    <StatusNav statuses={statuses} selectedStatus={selectedStatus}/>

                    {
                        params.action === 'order' ?
                        <OrdersTable
                            panel={panel}
                            orders={paydeskItems}
                        />
                        :
                        <DeclarationsTable
                            panel={panel}
                            isPaymentEnabled={isPaymentEnabled}
                            declarations={paydeskItems}
                            onDeclarationChange={this.handleDeclarationChange}
                            onPayment={() => this.fetchUserData(params.user)}
                        />
                    }
                </>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    orderStatuses: state.statuses.orderStatuses,
    declarationStatuses: state.statuses.declarationStatuses,
    paydeskItems: state.paydesk,
});

export default connect(mapStateToProps, {
    fetchUserProfile,
    fetchDeclarationStatuses,
    fetchOrderStatuses,
    fetchDeclarations,
    fetchOrders,
})(PayDesk);
