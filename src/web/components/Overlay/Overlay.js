import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "healthcare-test-components/Button/Button.js";

const Overlay = props => {
  const { title, closeOverlay, subTitle, submitOverlay } = props;
  return (
    <React.Fragment>
      <div className="popupOverlay">
        <div className="popupWrapper">
          <a className="cross" onClick={() => closeOverlay()}>
            <i className="fa fa-times" />
          </a>
          <h1 className="popupTitle">{title}</h1>
          <p className="popupSubTitle mb-4">{subTitle}</p>
          {props.children}
          <div className="text-center pt-2 d-block">
            <button className="lineBtn" onClick={() => closeOverlay()}>
              Cancel
            </button>
            <Button
              type={"blue-button"}
              extraClasses={`${
                props.disableBtn ? "loaderBtn disable ml-2" : "ml-2"
              }`}
              onClick={() => (props.disableBtn ? "" : submitOverlay())}
              label={props.isDelete ? "Delete" : "Save"}
              disableBtn={props.disableBtn}
            />
            {/*<button className="blueBtn ml-2" onClick={() => submitOverlay()}>Save</button>*/}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Overlay;
