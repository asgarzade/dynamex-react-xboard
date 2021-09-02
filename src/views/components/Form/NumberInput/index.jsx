import React from 'react';
import '../index.scss'

function NumberInput({ name, label, placeholder, onChange, error, className, append = '', value, required }) {
    return (
        <div className="form-group row">
            <label htmlFor={name} className='col-sm-4 col-form-label'>{label} {required && <span className='required-star'>*</span>}</label>
            <div className="col-sm-8">
                <div className="input-group">
                    <input 
                        name={name}
                        value={value || 0}
                        id={name}
                        type="number"
                        className={`form-control ${(error && error.length) ? "invalid" : ''} ${className || ''}`}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                    { append.length ? 
                        <div className="input-group-append">
                            <div className="input-group-text">{append}</div>
                        </div>
                    : null}
                </div>
                <div className={'error-message'}>{error}</div>
            </div>
        </div>
    )
}

export default NumberInput;