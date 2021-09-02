import React, { useRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchAutocompleteUsers, fetchAutocompleteUsersSuccess } from 'state/reducers/autocomplete/actions';
import { updateParams, removeParams } from 'helpers/functions';
import './index.scss';
import queryString from "query-string";

const staticText = {
    tip: 'Type at least 3 characters to start the search',
    clearBtn: 'Clear search',
};

const Search = props => {

    const formRef = useRef(null);
    const inputRef = useRef(null);
    useOutsideClickHandler(formRef, () => {
        clearResults();
        setShowTip(false);
    });
    const { className, placeholder, searchResults, clearBtn, query } = props;
    const params = queryString.parse(props.location.search);

    const [loading, setLoading] = useState(false);
    const [showTip, setShowTip] = useState(false);
    let searchTimer;

    const handleInputChange = e => {
        clearTimeout(searchTimer);
        const searchString = e.target.value.trim();

        if (searchString.length >= 3) {
            setShowTip(false);
            searchTimer = setTimeout(() => {
                setLoading(true);
                props.fetchAutocompleteUsers({
                    query: searchString,
                    defaultCallback: () => setLoading(false)
                });
            }, 500);
        } else {
            setShowTip(true);
            if (searchResults.length) {
                searchTimer = setTimeout(() => {
                    clearResults();
                }, 500);
            }
        }
    };

    const clearResults = () => { props.fetchAutocompleteUsersSuccess([]); };

    const onItemClick = value => {
        clearResults();
        updateParams(props, query, value);
        inputRef.current.value = '';
    };

    return (
        <form 
            autoComplete="off" 
            className={`search-form ${className} d-flex`}
            ref={formRef}
            >
            <div className="autocomplete" >
                <input ref={inputRef} type="text" onChange={handleInputChange} placeholder={placeholder}/>
                { showTip && <span className={'d-inline-block p-2 text-secondary position-absolute'}>{staticText.tip}</span> }
                {
                    searchResults.length ? 
                    <ul className='autocomplete-items'>
                        {
                            searchResults.map((item, index) => (
                                <li 
                                    role='button'
                                    key={index} 
                                    className="item"
                                    onClick={() => onItemClick(item.value)}
                                    >
                                    {item.label}
                                </li>
                            ))
                        }
                    </ul> : ''
                }
                { loading &&
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                }
            </div>
            { clearBtn && params[query] && <button className={'btn btn-outline-info ml-1'} onClick={() => removeParams(props, [query])}>{staticText.clearBtn}</button> }
        </form>
    )
};

const useOutsideClickHandler = (ref, callback) => {
    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    });
};

const mapStateToProps = state => ({
    searchResults: state.autocomplete.users,
});

export default withRouter(connect(mapStateToProps, {
    fetchAutocompleteUsers,
    fetchAutocompleteUsersSuccess
})(Search));