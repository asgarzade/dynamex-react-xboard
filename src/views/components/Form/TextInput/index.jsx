import React from 'react';
import '../index.scss'

function TextInput({ name, label, placeholder, onChange, error, className, append = '', value, required, disabled }) {
    return (
        <div className="form-group row">
            <label htmlFor={name} className='col-sm-4 col-form-label'>{label} {required && <span className='required-star'>*</span>}</label>
            <div className="col-sm-8">
                <div className="input-group">
                    <input 
                        name={name}
                        value={value || ''}
                        id={name}
                        disabled={disabled ? true : false}
                        readOnly={disabled ? true : false}
                        type="text"
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

export default TextInput;