import React from 'react';
import '../index.scss'

function GenericInput({ label, name, error, children, required }) {
    return (
        <div className="form-group row">
            <label htmlFor={name} className='col-sm-4 col-form-label'>{label} {required && <span className='required-star'>*</span>} </label>
            <div className="col-sm-8">
                {children}
                <div className={'error-message'}>{error}</div>
            </div>
        </div>
    )
}

export default GenericInput;