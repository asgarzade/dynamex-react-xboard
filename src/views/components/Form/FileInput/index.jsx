import React, { } from 'react';
import '../index.scss';

function FileInput({ name, label, error, value, currentFile, onChange, onFileRemove }) {
    return (
        <div className="form-group row">
            <label htmlFor={name} className='col-sm-4 col-form-label'>{label}</label>
            <div className="col-sm-8">
                <div className='custom-file'>
                    <input 
                        type="file" 
                        className="custom-file-input invalid"
                        id={'name'}
                        onChange={(e) => onChange(e.target.files[0])}
                        accept={`.xls,.xlsx,.pdf,.doc,.docx,.jpg,.jpeg,.png,.heic`}
                    />
                    <label className="custom-file-label" htmlFor={name}>{value.name || 'Choose file'}</label>
                    { value.name && <button className={'clear-input'} onClick={() => onChange({})}>Clear input</button> }

                </div>
                <div className={'error-message'}>{error}</div>
                { currentFile &&
                    <div className="chosen-file">
                        Current file:
                        <a href={currentFile} target={'_blank'} className={'file-link'} rel={'noopener noreferrer'}>{currentFile}</a>
                        {/*<button className={'remove-file'} onClick={onFileRemove}></button>*/}
                    </div>
                }
            </div>
        </div>
    )
}

export default FileInput
