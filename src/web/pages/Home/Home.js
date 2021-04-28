import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Input from "doctorportal-components/Input/Input.js";
import Button from "doctorportal-components/Button/Button.js";
import Sidebar from "doctorportal-components/Sidebar/Sidebar.js";
import Header from "doctorportal-components/Header/Header.js";
import Question from "doctorportal-components/Question/Question.js";
import QuestionDetail from "doctorportal-components/Question/QuestionDetail.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_PASSWORD,
} from "doctorportal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = (props) => {
  const history = useHistory();
  const newQuestion = { type: "text", title: "", data: "" };
  const newQuestionSet = { questions: [], title: "" };
  const doctorId = "6066e312916fabaeea59fcbd";

  const [allQuestions, setAllQuestions] = useState([]);
  const [allQuestionSets, setAllQuestionSets] = useState([]);
  const [showQuestionnaireInput, setShowQuestionnaireInput] = useState(false);
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState(null);
  const [editQuestion, setEditQuestion] = useState(0);
  const [mode, setMode] = useState("add");
  const [loaderText, setLoaderText] = useState("Loading");
  const [showLoader, setShowLoader] = useState(false);

  const questions = useStoreState((state) => state.doctor.questions);
  const questionnaires = useStoreState((state) => state.doctor.questionnaires);
  const createQuestionnaire = useStoreActions(
    (actions) => actions.doctor.createQuestionnaire
  );
  const updateQuestionnaire = useStoreActions(
    (actions) => actions.doctor.updateQuestionnaire
  );
  const getQuestionnaires = useStoreActions(
    (actions) => actions.doctor.getQuestionnaires
  );
  const createQuestion = useStoreActions(
    (actions) => actions.doctor.createQuestion
  );
  const getQuestionsByQuestionnaireId = useStoreActions(
    (actions) => actions.doctor.getQuestionsByQuestionnaireId
  );
  const deleteQuestionById = useStoreActions(
    (actions) => actions.doctor.deleteQuestionById
  );
  const updateQuestion = useStoreActions(
    (actions) => actions.doctor.updateQuestion
  );
  const updateQuestionsOrder = useStoreActions(
    (actions) => actions.doctor.updateQuestionsOrder
  );

  useEffect(async () => {
    if (!questionnaires) {
      setShowLoader(true);
      setLoaderText("Loading doctor's data");
      await getQuestionnaires({ doctorId: doctorId });
      setShowLoader(false);
      setLoaderText("");
    }
  }, []);

  useEffect(() => {
    if (questionnaires) {
      setAllQuestionSets(questionnaires);
      if (selectedQuestionSet && selectedQuestionSet._id) {
        setSelectedQuestionSet(
          questionnaires.find((e) => (e._id = selectedQuestionSet._id))
        );
      }
    }
  }, [questionnaires]);

  useEffect(() => {
    if (questions) {
      setAllQuestions(questions);
      setSelectedQuestion(null);
      //setAllQuestions(questionnaires[0].questions);
    }
  }, [questions]);

  const addNewQuestion = () => {
    setMode("add");
    setSelectedQuestion(newQuestion);
  };

  const hideLoader = () => {
    setShowLoader(false);
    setLoaderText("");
  };
  const startLoader = (txt) => {
    setShowLoader(true);
    setLoaderText(txt);
  };

  const saveQuestion = async (question) => {
    if (mode == "add") {
      startLoader("Saving question");
      await createQuestion(question);
      hideLoader();
    } else {
      startLoader("Updating question");
      await updateQuestion(question);
      hideLoader();
    }
    /*let selectedQSet = JSON.parse(JSON.stringify(selectedQuestionSet));
    let newQ = JSON.parse(JSON.stringify(question));
    if (mode == "add") {
      newQ.id = selectedQSet.questions.length + 1;
      selectedQSet.questions.push(newQ);
    } else {
      console.log(newQ);
      let qIndex = selectedQSet.questions.findIndex((e) => e.id == question.id);
      selectedQSet.questions[qIndex] = newQ;
    }

    let index = allQuestionSets.findIndex((e) => e.title == selectedQSet.title);
    allQuestionSets[index] = selectedQSet;
    await setAllQuestions(selectedQSet.questions);
    await setSelectedQuestionSet(selectedQSet);
    await setAllQuestionSets(allQuestionSets);
    await setSelectedQuestion(null);*/
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 2,
    margin: `0 0 4px 0`,

    // change background colour if dragging
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result) => {
    // dropped outside the list

    console.log(result);

    if (!result.destination) {
      return;
    }

    const items = reorder(
      allQuestions,
      result.source.index,
      result.destination.index
    );
    let updatedOrder = [];
    await items.map((obj, idx) => {
      updatedOrder.push({ id: obj._id, order: idx + 1 });
    });
    startLoader("Updating questions order");
    setAllQuestions(items);
    await updateQuestionsOrder({
      questions: updatedOrder,
      questionnaireId: selectedQuestionSet._id,
    });
    hideLoader();
  };

  const getListStyle = (isDraggingOver) => ({});

  const selectQuestionSet = async (id) => {
    let selectedQset = allQuestionSets[id];
    setSelectedQuestionSet(selectedQset);
    startLoader("Fetching questions");
    await getQuestionsByQuestionnaireId({ questionnaireId: selectedQset._id });
    hideLoader();
    //setAllQuestions(selectedQset.questions);
  };

  const selectQuestion = (id) => {
    let selectedQ = allQuestions.find((e) => e._id == id);
    setSelectedQuestion(selectedQ);
    setMode("edit");
  };

  const deleteQuestion = async (id) => {
    startLoader("Deleting question");
    await deleteQuestionById({
      qId: id,
      questionnaireId: selectedQuestionSet._id,
    });
    hideLoader();
  };

  const createQuestionSet = async () => {
    let qSets = JSON.parse(JSON.stringify(allQuestionSets));
    let newSet = JSON.parse(JSON.stringify(newQuestionSet));

    newSet.title = "Intake Question Set " + (parseInt(qSets.length) + 1);
    newSet.doctorId = doctorId;
    startLoader("Creating Questionnaire");
    await createQuestionnaire(newSet);
    hideLoader();
  };

  const editQuestionnaireTitle = (id) => {
    setQuestionnaireTitle(selectedQuestionSet.title);
    setShowQuestionnaireInput(true);
  };

  const saveQuestionnaireTitle = async (id) => {
    startLoader("Updating questionnaire");
    await updateQuestionnaire({
      title: questionnaireTitle,
      id: selectedQuestionSet._id,
      doctorId: doctorId,
    });
    hideLoader();
    setShowQuestionnaireInput(false);
  };

  return (
    <React.Fragment>
      <Sidebar
        questionSets={allQuestionSets}
        selectQuestionSet={(id) => selectQuestionSet(id)}
        selectedQuestionSet={selectedQuestionSet}
        createQuestionSet={() => createQuestionSet()}
      />
      <Header />
      {selectedQuestionSet != null && (
        <React.Fragment>
          {showQuestionnaireInput ? (
            <>
              <div className="title-input-container">
                <input
                  className={"title"}
                  type="text"
                  placeholder="Type Questionnaire Title"
                  onChange={(e) => setQuestionnaireTitle(e.target.value)}
                  value={questionnaireTitle}
                />
                <a className="edit">
                  <i
                    className="fa fa-floppy-o"
                    onClick={() =>
                      saveQuestionnaireTitle(selectedQuestionSet._id)
                    }
                  />
                  Save
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="title">
                {selectedQuestionSet.title}
                <a className="edit ml-3">
                  <i
                    className="fa fa-pencil"
                    onClick={() =>
                      editQuestionnaireTitle(selectedQuestionSet._id)
                    }
                  />
                </a>
              </h1>
            </>
          )}
          <div className="sectionOuter">
            <section className="leftSection">
              <div className="previewContainer">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {allQuestions.map((item, index) => (
                          <Draggable
                            key={item._id}
                            draggableId={item._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <Question
                                  questionData={item}
                                  selectQuestion={(id) => selectQuestion(id)}
                                  deleteQuestion={(id) => deleteQuestion(id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {/*{allQuestions.map((obj, idx) => {
                  return (
                    <Question
                      questionData={obj}
                      selectQuestion={() => selectQuestion(idx)}
                    />
                  );
                })}*/}
              </div>
              <div className="leftFooter text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addNewQuestion()}
                >
                  Add Questions
                </button>
              </div>
            </section>
            <section className="rightSection">
              {selectedQuestion != null && (
                <QuestionDetail
                  question={selectedQuestion}
                  saveQuestion={(q) => saveQuestion(q)}
                  mode={mode}
                  questionnaireId={selectedQuestionSet._id}
                  totalQuestions={allQuestions.length}
                />
              )}
            </section>
          </div>
        </React.Fragment>
      )}
      {showLoader && (
        <div className="loaderOuter">
          <div className="loaderOuter">
            <div className="loader">
              <div className="spinner-border text-primary" role="status"></div>
              <p>{loaderText} ...</p>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default Home;
