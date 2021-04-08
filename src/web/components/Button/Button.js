import React, { useState, useEffect } from 'react';

const Button = (props) => {  

  const [btnClass, setBtnClass] = useState("blueBtn");
  const [loadingMsg, setLoadingMsg] = useState("Processing...");

  useEffect(() => {
    let className = '';
    if(props.type == 'line-button') {
      className += 'lineBtn ';
    } else if(props.type == 'blue-button') {
      className += 'blueBtn ';
    } else if(props.type == 'theme-button') {
      className += 'themeBtn ';
    } else if(props.type == 'top-button') {
      className += 'topButton ';
    }

    if(props.extraClasses) {
      className = className+' '+props.extraClasses
    }
    setBtnClass(className)
  }, [props])

  return (
    <React.Fragment>
      <button type="button" className={btnClass} onClick={() =>  props.onClick()}>
        {props.label}
        {props.disableBtn && 
          <div class="spinner-border " role="status">
            <span class="sr-only">Loading...</span>
          </div>
        }
      </button>
    </React.Fragment>
  );
};

export default Button;
