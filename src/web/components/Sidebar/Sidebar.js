import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";

const Sidebar = props => {
  const history = useHistory();
  const location = useLocation();

  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(false);

  const toggleMenu = () => {
    setShowSubMenu(!showSubmenu);
  };

  return (
    <React.Fragment>
      <div className="sideBar">
        <div className="logo">
          <img src="images/logo.png" />
        </div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <h6>Dr. Todd Grande</h6>
              <li className="nav-item active">
                <a className="nav-link" href="#">
                  <i className="fa fa-stethoscope" />
                  Intakes
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  onClick={() => toggleMenu()}
                >
                  <i className="fa fa-question" />
                  Manage Questionaire {showSubmenu}
                </a>
                {showSubmenu && (
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    {props.questionSets &&
                      props.questionSets.map((obj, idx) => {
                        return (
                          <a
                            className={`dropdown-item ${
                              props.selectedQuestionSet &&
                              props.selectedQuestionSet.title == obj.title
                                ? "active"
                                : ""
                            }`}
                            onClick={() => props.selectQuestionSet(idx)}
                          >
                            {obj.title}
                          </a>
                        );
                      })}
                    <a
                      className="dropdown-item"
                      onClick={() => props.createQuestionSet()}
                    >
                      Add new question set
                    </a>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <i className="fa fa-user" />
                  Profile
                </a>
              </li>
              <li className="nav-item li-mobile notifi-li">
                <a
                  className="nav-link"
                  href="#"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <i className="fa fa-bell" />
                  Notifications
                  <span>23</span>
                </a>
              </li>
              <li className="nav-item border-top pt-3 mt-2">
                <div className="patientEmail">
                  <input type="text" name placeholder="Patients Email" />
                  <i className="fa fa-envelope" />
                </div>
              </li>
              <li className="nav-item mt-auto">
                <a className="nav-link" href="#">
                  <i className="fa fa-sign-out" />
                  Logout
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="fa fa-question-circle" />
                  Help
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
