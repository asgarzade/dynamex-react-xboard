import React, { useEffect } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCountries } from 'state/reducers/country/actions';
import { fetchCurrencies } from 'state/reducers/currency/actions';
import { fetchWarehouses } from 'state/reducers/warehouse/actions';
import { fetchChoices } from 'state/reducers/choice/actions';
import { fetchOperatorProfile } from "state/reducers/operator/actions";
import PayDesk from './PayDesk';
import Warehouse from './Warehouse';
import AssignedOrders from './AssignedOrders';
import Pickups from "./Pickups";

const Routes = props => {
    const { fetchCountries, fetchCurrencies, fetchWarehouses, fetchChoices, fetchOperatorProfile } = props;

    useEffect(() => {
        fetchCountries();
        fetchCurrencies();
        fetchWarehouses();
        fetchChoices();
        fetchOperatorProfile();
    }, [fetchCountries, fetchCurrencies, fetchWarehouses, fetchChoices, fetchOperatorProfile]);

    return (
        <>
            <ToastContainer/>
            <HashRouter>
                <Switch>
                    <Route path={'/pay-desk'} component={PayDesk}/>
                    <Route path={'/warehouse'} component={Warehouse}/>
                    <Route path={'/assigned-orders'} component={AssignedOrders}/>
                    <Route path={'/pickups'} component={Pickups}/>
                </Switch>
            </HashRouter>
        </>
    )
};

export default connect(null, {
    fetchCountries,
    fetchCurrencies,
    fetchWarehouses,
    fetchChoices,
    fetchOperatorProfile,
})(Routes);
