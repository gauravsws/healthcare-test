import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";

const Header = props => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(false);

  return (
    <React.Fragment>
      <header>
        <div className="search">
          <i className="fa fa-search" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="headerUser">
          {/* style="background-image:url('images/user.png')" */}
          <img src="images/user.png" />
        </div>
        <div className="notification">
          <i className="fa fa-bell" />
          <span>29</span>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
