import React from 'react';
import './index.scss';

const Loading = () => {
    return (
        <div className="p-5 text-center bg-white">
            <div className="spinner-border text-secondary">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
};

export default Loading;