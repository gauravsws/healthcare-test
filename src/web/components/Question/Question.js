import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";

const Question = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [iconClass, setIconClass] = useState("fa-font");

  useEffect(() => {
    if (props.questionData) {
      if (props.questionData.type == "AUDIO") {
        setIconClass("fa-music");
      } else if (props.questionData.type == "VIDEO") {
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
          <i className={`fa ${iconClass}`}></i> {props.questionData.order}
        </div>
        <i className="fa fa-arrow-down arrowDown"></i>
        <a className="edit" title="Edit">
          <i
            className="fa fa-pencil"
            onClick={() => props.selectQuestion(props.questionData._id)}
          />
        </a>
        <a className="delete" title="Delete">
          <i
            className="fa fa-trash"
            onClick={() => props.deleteQuestion(props.questionData._id)}
          />
        </a>
        {props.questionData.type == "AUDIO" && (
          <audio controls="controls">
            <source type="audio/mp3" src={props.questionData.audioURL} />
          </audio>
        )}
        {props.questionData.type == "VIDEO" && (
          <video controls>
            <source type="video/webm" src={props.questionData.videoURL} />
          </video>
        )}
        <div className="previewQuestion">{props.questionData.text}</div>
      </div>
    </React.Fragment>
  );
};

export default Question;
