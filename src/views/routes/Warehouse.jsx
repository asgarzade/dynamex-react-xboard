import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { fetchUserProfile } from 'state/reducers/user/actions';
import { fetchOrderStatuses, fetchDeclarationStatuses } from 'state/reducers/status/actions';
import { fetchSingleDeclaration } from 'state/reducers/declaration/actions';
import { fetchWarehouseOrders, fetchWarehouseDeclarations } from 'state/reducers/warehousePage/actions';
import { fetchBags } from 'state/reducers/bag/actions';
import UserInfoCard from 'views/components/UserInfoCard';
import PrintingBoard from 'views/components/PrintingBoard';
import DeclarationsTable from 'views/components/DeclarationsTable';
import OrdersTable from 'views/components/OrdersTable';
import Search from 'views/components/Search';
import DeclarationModal from 'views/components/DeclarationModal';
import { updateParams, removeParams } from 'helpers/functions';

const staticText = {
    searchPlaceholder: 'start your search with client code, name or email...',
    reportBtn: 'Report Problem',
    allDclrsBtn: 'All Declarations',
};
const panel = 'warehouse';

class Warehouse extends React.Component {
    state = {
        isProblemModalOpen: false,
    };

    componentDidMount() {
        this.props.fetchOrderStatuses(panel);
        this.props.fetchDeclarationStatuses(panel);
        this.props.fetchBags();

        const params = queryString.parse(this.props.location.search);
        const { user, declarationpage, orderpage, last_declaration } = params;

        if (user) this.getAllUserData(user, declarationpage, orderpage);

        if (last_declaration && parseInt(last_declaration) !== this.props.declaration.id) {
            this.props.fetchSingleDeclaration(last_declaration);
        }
    }

    componentDidUpdate(prevProps) {
        const nextParams = queryString.parse(this.props.location.search);
        const prevParams = queryString.parse(prevProps.location.search);

        const { user, declarationpage, orderpage } = nextParams;

        if (user) {
            if (user !== prevParams.user) {
                removeParams(this.props, ['declarationpage', 'orderpage', 'last_declaration']);
                this.getAllUserData(user);
                return;
            }

            if (declarationpage && declarationpage !== prevParams.declarationpage) {
                this.props.fetchWarehouseDeclarations({
                    user,
                    panel,
                    page: declarationpage
                });
                return;
            }

            if (orderpage && orderpage !== prevParams.orderpage) {
                this.props.fetchWarehouseOrders({
                    user,
                    panel,
                    page: orderpage,
                })
            }
        }
    }

    getAllUserData = (user, declarationPage, orderPage) => {
        this.props.fetchUserProfile(user);
        this.props.fetchWarehouseDeclarations({
            user,
            panel,
            page: declarationPage
        });
        this.props.fetchWarehouseOrders({
            user,
            panel,
            page: orderPage
        });
    };

    handleDeclarationChange = (id) => {
        // re-fetch declarations and add newly saved declaration's id to url
        const params = queryString.parse(this.props.location.search);
        const { user, declarationpage } = params;
        this.props.fetchWarehouseDeclarations({
            user,
            panel,
            page: declarationpage
        });
        updateParams(this.props, 'last_declaration', id)
    };

    handleOrderChange = (id) => {
        // re-fetch declarations and orders, and add newly saved declaration's id to url
        const params = queryString.parse(this.props.location.search);
        const { user, declarationpage, orderpage } = params;
        this.props.fetchWarehouseDeclarations({
            user,
            panel,
            page: declarationpage
        });
        this.props.fetchWarehouseOrders({
            user,
            panel,
            page: orderpage
        });
        updateParams(this.props, 'last_declaration', id)
    };

    render() {
        const { isProblemModalOpen } = this.state;
        const { warehouseItems, declaration, user, currentOperator } = this.props;
        const params = queryString.parse(this.props.location.search);

        return (
            <div className='warehouse mb-5'>
                {isProblemModalOpen &&
                <DeclarationModal
                    isModalOpen={isProblemModalOpen}
                    panel={'problem'}
                    modalType={'new'}
                    onClose={() => this.setState({isProblemModalOpen: false})}
                    onSuccess={() => {
                        this.setState({isProblemModalOpen: false})
                    }}
                />
                }
                <div className="row align-items-center mb-5">
                    <div className="col-8">
                        <Search query={'user'} placeholder={staticText.searchPlaceholder}/>
                    </div>
                    <div className="col-4 text-right">
                        {
                            currentOperator.canCreateDeclaration &&
                            <button className="btn btn-outline-danger"
                                    onClick={() => this.setState({isProblemModalOpen: true})}>{staticText.reportBtn}
                            </button>
                        }
                        {
                            currentOperator.canViewDeclaration &&
                            <a
                                href={`/labmin/fulfillment/declaration/?q=${params.user && ''}`}
                                target='_blank'
                                rel="noopener noreferrer"
                                className='btn btn-outline-info ml-2'
                            >
                                {staticText.allDclrsBtn}
                            </a>
                        }
                    </div>
                </div>
                {
                    params.user &&
                    <>
                        <UserInfoCard className='mb-5'/>
                        { params.last_declaration &&
                            <PrintingBoard className='mb-5' user={user} declaration={declaration} id={params.last_declaration}/>
                        }
                        <DeclarationsTable
                            declarations={warehouseItems.declarations}
                            className='mb-5'
                            onDeclarationChange={this.handleDeclarationChange}
                            panel={panel}/>
                        <OrdersTable
                            orders={warehouseItems.orders}
                            onOrderChange={this.handleOrderChange}
                            panel={panel}
                        />
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.userProfile,
    warehouseItems: state.warehouseItems,
    declarationStatuses: state.statuses.declarationStatuses,
    orderStatuses: state.statuses.orderStatuses,
    declaration: state.declaration.declaration,
    currentOperator: state.operator.operatorProfile,
});

export default connect(mapStateToProps, { 
    fetchUserProfile,
    fetchWarehouseOrders,
    fetchWarehouseDeclarations,
    fetchOrderStatuses,
    fetchDeclarationStatuses,
    fetchSingleDeclaration,
    fetchBags,
})(Warehouse);
