import React from 'react'
import '../../index.css';
function Input({ label, state, setState ,placeholder}) {
    return (
        <div className='wrapper-input'>
            <p className='label-input'>{label}</p>
            <input
                className='text-input'
                placeholder={placeholder}
                value={state}
                onChange={(e) => setState(e.target.value)}
            />
        </div>
    )
}

export default Input;