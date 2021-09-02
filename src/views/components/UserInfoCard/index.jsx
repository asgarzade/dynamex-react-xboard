import React, { useState } from 'react';
import { connect } from 'react-redux';
import Balance from 'views/components/Balance';
import BalanceModal from './BalanceModal';
import Loading from "views/components/Loading";
import './index.scss';

const UserInfoCard = props => {
    const staticText = {
        clientCode: 'Client code',
        email: 'Email',
        phoneNumber: 'Phone number',
        last30days: 'Last 30 days',
        balances: 'Balances',
        successMessage: 'Balance Successfully Updated',
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, className, loading, mobileOperators, currentOperator } = props;

    return (
        <>
            {isModalOpen &&
                <BalanceModal 
                    isModalOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                    }}
                />
            }
            <div className={`user-card ${className}`}>
                {
                    loading ? <Loading/> :
                        <>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h4 className='m-0'>{user.fullName}</h4>
                                {
                                    currentOperator.canMakeBalanceOperations &&
                                    <button className='btn btn-outline-info' onClick={() => setIsModalOpen(true)}>
                                        Balance Operations
                                    </button>
                                }
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <ul className='font-weight-bold'>
                                        <li>{staticText.clientCode}: #{user.clientCode}</li>
                                        <li>{staticText.email}: {user.email}</li>
                                        <li>{staticText.phoneNumber}: {mobileOperators.find(operator => operator.id === user.phoneOperator)?.prefix}{user.phoneNumber}</li>
                                        <li>{staticText.last30days}: {user.last30DaysDecExpenses} USD</li>
                                    </ul>
                                </div>
                                <div className="col-6">
                                    {/* <h6>{staticText.balances}:</h6> */}
                                    <ul className='d-flex flex-column align-items-end'>
                                        {
                                            user.wallets.map((wallet, index) => (
                                                <li key={index}>
                                                    <Balance wallet={wallet}/>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </>
                }
            </div>
        </>
    )
};

const mapStateToProps = state => ({
    user: state.user.userProfile,
    loading: state.loading.userLoading,
    mobileOperators: state.choices.mobileOperators,
    currentOperator: state.operator.operatorProfile,
});

export default connect(mapStateToProps)(UserInfoCard);