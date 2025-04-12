import React from 'react';
import "./progressfilter.css";

const ProgressFilter = ({title, count}) => {
  return (
    <div className='progressfilter'>
        <div className="progressfilter-text-container">
        <input
          type="radio"
          className="progressfilter-radio"
        />
        <div className='progressfilter-text'>
            <p>{title}</p>
        </div>
        </div>
       
        <div className='progressfilter-count'>
            <p>{count}</p>
        </div>
    </div>
  )
}

export default ProgressFilter