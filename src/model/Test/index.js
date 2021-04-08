import { Action, action, thunk, Thunk } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";

const testModel = {
	setShowProgressBar: action((state, payload) => {
		state.showProgressBar = payload;
	})
};

export default testModel;
