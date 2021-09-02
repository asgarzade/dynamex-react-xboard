import React from 'react';

function CheckBox({ label, onChange, name, isChecked, additionalInfo }) {
    return (
        <div className="form-group row align-items-center">
            <label htmlFor={name} className='col-sm-4 col-form-label'>{label}</label>
            <div className="col-sm-8 d-flex align-items-center">
                <input type="checkbox" name={name} id={name} onChange={onChange} checked={isChecked || false} />
                <small>{additionalInfo}</small>
            </div>
        </div>
        
    )
}

export default CheckBox;