import React from 'react';
import '../index.scss';

function TextArea({ name, label, placeholder, onChange, error, className, value, required, rows = 7, noMargin }) {
    return (
        <div className={`form-group row ${noMargin && 'my-0'}`}>
            <label htmlFor={name} className='col-sm-4 col-form-label'>{label} {required && <span className='required-star'>*</span>}</label>
            <div className="col-sm-8">
                <textarea
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    className={`form-control  ${error && error.length && 'invalid'} ${className}`}
                    name={name}
                    id={name}
                    placeholder={placeholder}
                />
                <div className={'error-message'}>{error}</div>
            </div>
        </div>
    )
}

export default TextArea;
