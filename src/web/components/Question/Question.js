import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";

const Question = props => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [iconClass, setIconClass] = useState("fa-font");

  useEffect(() => {
    if (props.questionData) {
      if (props.questionData.type == "audio") {
        setIconClass("fa-music");
      } else if (props.questionData.type == "video") {
        setIconClass("fa-play-circle");
      } else {
        setIconClass("fa-font");
      }
    }
  }, [props.questionData]);

  return (
    <React.Fragment>
      <div className="previewRow">
        <div className="questionNumber">
          <i className={`fa ${iconClass}`}></i> {props.questionData.id}
        </div>
        <i className="fa fa-arrow-down arrowDown"></i>
        <a className="edit">
          <i className="fa fa-pencil" onClick={() => props.selectQuestion()} />
        </a>
        {props.questionData.type == "audio" ? (
          <img src="images/audio.png" />
        ) : (
          <img src="images/meditation-23.jpg" />
        )}
        <div className="previewQuestion">{props.questionData.title}</div>
      </div>
    </React.Fragment>
  );
};

export default Question;
