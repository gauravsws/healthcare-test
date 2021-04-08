import React, { useState, useEffect } from 'react';

const Input = (props) => { 
  
  return (
    <React.Fragment>
      <div className="formFieldOuter">
        <label className="fieldLabel">{props.label}</label>

        <div className="formField">
            <input 
              type={props.type} 
              className={props.error ? "fieldInput error" : "fieldInput"} 
              name={props.name}
              value={props.value} 
              onChange={(e) => props.handleInputChange(e)}
              placeholder={props.placeholder}
            />
            {props.error && 
                <div className="errorMsg">
                  <span>!</span> 
                  <label>{props.errorMessage}</label>
                </div>
            }
            {props.children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Input;
