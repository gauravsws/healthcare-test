import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "healthcare-test-routes";
import history from "healthcare-test-history";
import "./index.scss";

const App = () => {
	useEffect(() => {}, []);
	return (
		<React.Fragment>
			<Router history={history}>
				<Routes />
			</Router>
		</React.Fragment>
	);
};

export default App;
