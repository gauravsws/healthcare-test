import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Home from "doctorportal-pages/Home/Home.js";

//console.log(this.props);
const Routes = () => {
	return (
		<Switch>
			<Route path={"/home"} component={Home} exact />

			<Route path="/" render={() => <Redirect to="/home" />} exact />
		</Switch>
	);
};

export default Routes;
