import React from 'react';
import { withRouter } from "react-router";
import './index.scss';
import { updateParams } from 'helpers/functions';

const Pagination = props => {
    const { pageCount, currentPage, type } = props;

    const createPaginationItems = () => {
        let paginationItems = [];

        for (let i = 1; i <= pageCount; i++) {
            paginationItems.push(
                <li
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => updateParams(props, `${type}page`, i)}
                >
                    {i}
                </li>
            )
        }

        return paginationItems
    };

    return (
        <ul className="pagination">
            {createPaginationItems()}
        </ul>
    )
};

export default withRouter(Pagination);