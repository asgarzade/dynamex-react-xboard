import React from 'react';
import { connect } from 'react-redux';
import AssignedOrdersTable from "views/components/AssignedOrdersTable";
import Loading from "views/components/Loading";
import Search from "views/components/Search";
import Pagination from 'views/components/Pagination';
import { fetchAssignedOrders } from 'state/reducers/assignedOrder/actions';
import { fetchAssignedOrderStatuses } from 'state/reducers/status/actions';
import queryString from "query-string";
import StatusNav from "../components/StatusNav";
import { removeParams } from "helpers/functions";

const staticText = {
    searchPlaceholder: 'start your search with client code, name or email...',
    allOrdersBtn: 'All Orders',
    notFound: 'No Assignments',
};

class AssignedOrders extends React.Component {
    state = {
        selectedStatus: 0,
    };

    componentDidMount() {
        this.props.fetchAssignedOrderStatuses();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const nextParams = queryString.parse(this.props.location.search);
        const prevParams = queryString.parse(prevProps.location.search);

        const { user, status, assignmentpage } = nextParams;
        const { selectedStatus } = this.state;
        const { statuses } = this.props;

        if (statuses.length) {
            if (!status && !selectedStatus) {
                const selectedStatus = this.getDefaultStatus(statuses).id;
                this.setState({ selectedStatus });
                this.props.fetchAssignedOrders({
                    user,
                    status: selectedStatus,
                    page: assignmentpage
                });
                return;
            }
            else if (status && !selectedStatus) {
                this.setState({ selectedStatus: status });
                this.props.fetchAssignedOrders({
                    user,
                    status,
                    page: assignmentpage
                });
                return;
            }
            else if (status && status !== prevParams.status) {
                removeParams(this.props, ['assignmentpage']);
                this.setState({ selectedStatus: status });
                this.props.fetchAssignedOrders({
                    user,
                    status
                });
                return;
            }
        }

        if (user !== prevParams.user || assignmentpage !== prevParams.assignmentpage) {
            const selectedStatus = this.getDefaultStatus(statuses).id;
            this.props.fetchAssignedOrders({
                user,
                status: selectedStatus,
                page: assignmentpage
            });
        }
    }

    getDefaultStatus = (statuses) => statuses.find(status => status.isShownByDefault);

    handleOrderChange = () => {
        const params = queryString.parse(this.props.location.search);

        const { user, assignmentpage } = params;
        const { selectedStatus } = this.state;

        this.props.fetchAssignedOrders({
            user,
            status: selectedStatus,
            page: assignmentpage
        });
    };

    render() {
        const { assignments, statuses, loading, currentOperator } = this.props;
        const { selectedStatus } = this.state;

        return (
            <div className="assignments mb-5">
                <div className="row align-items-center mb-5">
                    <div className="col-8">
                        <Search query={'user'} placeholder={staticText.searchPlaceholder} clearBtn={true}/>
                    </div>
                    <div className="col-4 text-right">
                        { currentOperator.canViewOrder &&
                            <a
                                href={`/labmin/fulfillment/order/`}
                                target='_blank'
                                rel="noopener noreferrer"
                                className='btn btn-outline-info ml-2'
                            >
                                {staticText.allOrdersBtn}
                            </a>
                        }
                    </div>
                </div>
                <StatusNav statuses={statuses} selectedStatus={selectedStatus}/>
                { loading ? <Loading /> : assignments.results.length ?
                    <>
                    { assignments.results.map((assignment, index) => (
                        <AssignedOrdersTable key={index}
                                             assignment={assignment}
                                             statuses={statuses}
                                             selectedStatus={selectedStatus}
                                             onOrderChange={this.handleOrderChange}
                        />))
                    }
                        <Pagination
                            pageCount={assignments.pageCount}
                            currentPage={assignments.currentPage}
                            type={'assignment'}
                        />
                    </>
                    :
                    <div className={'py-5 px-3 bg-white'}>{staticText.notFound}</div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    assignments: state.assignedOrders.list,
    statuses: state.statuses.assignedOrderStatuses,
    loading: state.loading.ordersLoading,
    currentOperator: state.operator.operatorProfile,
});

export default connect(mapStateToProps, {
    fetchAssignedOrders,
    fetchAssignedOrderStatuses,
})(AssignedOrders);
