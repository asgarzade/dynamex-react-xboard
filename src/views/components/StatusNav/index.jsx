import React from 'react';
import { withRouter } from "react-router";
import './index.scss';
import { updateParams } from 'helpers/functions';

const StatusNav = props => {
    const { statuses, selectedStatus } = props;

    return (
        <ul className='status-nav'>
            {
                statuses.map(status => (
                    <li
                        key={status.id}
                        role='button' 
                        className={status.id === parseInt(selectedStatus) ? 'active' : ''}
                        onClick={() => updateParams(props, 'status', status.id)}
                        >
                        {status.name}
                    </li>

                ))
            }
        </ul>
    )
}

export default withRouter(StatusNav);