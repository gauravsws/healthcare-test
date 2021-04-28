import axios from "axios";
import {
	getToken,
	setToken,
	handleInvalidToken,
} from "doctorportal-utils/Service.js";
const AdminInstance = axios.create();
AdminInstance.interceptors.response.use(
	function (response) {
		if (response.headers) {
			//localStorage.setItem('api_token', response.headers.api_token);
		}
		let msg = response.data.message;
		// console.log(msg)
		if (
			msg == "Unauthenticated" ||
			msg == "session_timeout" ||
			msg == "server_error" ||
			msg == "token_not_found"
		) {
			handleInvalidToken();
		}
		return response;
	},
	function (error) {
		if (!error.response) {
			return { data: { data: "", message: "server_error", status: 500 } };
		} else {
			if (error.response.status == 500) {
				return {
					data: { data: "", message: "server_error", status: 500 },
				};
			}
			let msg = error.response.data.message;
			console.log(msg);
			if (
				msg == "Unauthenticated" ||
				msg == "session_timeout" ||
				msg == "server_error" ||
				msg == "token_not_found"
			) {
				handleInvalidToken();
			}

			return Promise.reject(error);
		}
	}
);

const apiUrl = process.env.REACT_APP_DOCTORPORTAL_API;

export const getQuestionnaires = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/get-questionnaires",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getQuestionsByQuestionnaireId = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/get-questions-by-questionnaireId",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const createQuestionnaire = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/create-questionnaire",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateQuestionnaire = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-questionnaire",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const createQuestion = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/create-question",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateQuestion = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-question",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const deleteQuestionById = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/delete-question",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateQuestionsOrder = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-question-order",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
