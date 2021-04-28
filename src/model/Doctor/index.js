import { Action, action, thunk, Thunk } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import ToastUI from "doctorportal-components/ToastUI/ToastUI.js";
import {
	getQuestionnaires,
	createQuestionnaire,
	updateQuestionnaire,
	createQuestion,
	getQuestionsByQuestionnaireId,
	deleteQuestionById,
	updateQuestion,
	updateQuestionsOrder,
} from "doctorportal-api/DoctorApi.js";

const doctorModel = {
	setQuestionnaires: action((state, payload) => {
		state.questionnaires = payload;
	}),
	setQuestions: action((state, payload) => {
		state.questions = payload;
	}),
	getQuestionnaires: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await getQuestionnaires(payload);
		console.log(response);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			toast.success(
				<ToastUI
					message={"Questionnaires loaded successfully."}
					type={"Success"}
				/>
			);
			await actions.setQuestionnaires(response.data);
		}
	}),
	createQuestionnaire: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await createQuestionnaire(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestionnaires(response.data);
			}
		}
	),
	updateQuestionnaire: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await updateQuestionnaire(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestionnaires(response.data);
			}
		}
	),
	createQuestion: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await createQuestion(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setQuestions(response.data);
		}
	}),
	getQuestionsByQuestionnaireId: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await getQuestionsByQuestionnaireId(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestions(response.data);
			}
		}
	),
	deleteQuestionById: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await deleteQuestionById(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setQuestions(response.data);
		}
	}),
	updateQuestion: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await updateQuestion(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setQuestions(response.data);
		}
	}),
	updateQuestionsOrder: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await updateQuestionsOrder(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestions(response.data);
			}
		}
	),
};

export default doctorModel;
