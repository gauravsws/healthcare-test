import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Input from "healthcare-test-components/Input/Input.js";
import Button from "healthcare-test-components/Button/Button.js";
import Sidebar from "healthcare-test-components/Sidebar/Sidebar.js";
import Header from "healthcare-test-components/Header/Header.js";
import Question from "healthcare-test-components/Question/Question.js";
import QuestionDetail from "healthcare-test-components/Question/QuestionDetail.js";
import { useStoreActions } from "easy-peasy";
import {
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_PASSWORD
} from "healthcare-test-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = props => {
  const history = useHistory();
  const newQuestion = { type: "text", title: "", data: "" };
  const newQuestionSet = { questions: [], title: "" };
  const questionSets = localStorage.getItem("questionSets")
    ? JSON.parse(JSON.stringify(localStorage.getItem("questionSets")))
    : [];
  const questions = localStorage.getItem("questions")
    ? JSON.parse(JSON.stringify(localStorage.getItem("questions")))
    : [];

  const [allQuestions, setAllQuestions] = useState([]);
  const [allQuestionSets, setAllQuestionSets] = useState(questionSets);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState(null);
  const [editQuestion, setEditQuestion] = useState(0);
  const [mode, setMode] = useState("add");

  const addNewQuestion = () => {
    setMode("add");
    setSelectedQuestion(newQuestion);
  };

  const saveQuestion = async question => {
    let selectedQSet = JSON.parse(JSON.stringify(selectedQuestionSet));
    let newQ = JSON.parse(JSON.stringify(question));
    if (mode == "add") {
      newQ.id = selectedQSet.questions.length + 1;
      selectedQSet.questions.push(newQ);
    } else {
      console.log(newQ);
      let qIndex = selectedQSet.questions.findIndex(e => e.id == question.id);
      selectedQSet.questions[qIndex] = newQ;
    }

    let index = allQuestionSets.findIndex(e => e.title == selectedQSet.title);
    allQuestionSets[index] = selectedQSet;
    await setAllQuestions(selectedQSet.questions);
    await setSelectedQuestionSet(selectedQSet);
    await setAllQuestionSets(allQuestionSets);
    await setSelectedQuestion(null);
  };

  const selectQuestionSet = id => {
    let selectedQset = allQuestionSets[id];
    setSelectedQuestionSet(selectedQset);
    setAllQuestions(selectedQset.questions);
  };
  const selectQuestion = id => {
    let selectedQ = allQuestions[id];
    console.log(selectedQ);
    setSelectedQuestion(selectedQ);
    setMode("edit");
  };

  const createQuestionSet = () => {
    let qSets = JSON.parse(JSON.stringify(allQuestionSets));
    let newSet = JSON.parse(JSON.stringify(newQuestionSet));

    newSet.title = "Intake Question Set " + (parseInt(qSets.length) + 1);
    qSets.push(newSet);
    setAllQuestionSets(qSets);
  };
  return (
    <React.Fragment>
      <Sidebar
        questionSets={allQuestionSets}
        selectQuestionSet={id => selectQuestionSet(id)}
        selectedQuestionSet={selectedQuestionSet}
        createQuestionSet={() => createQuestionSet()}
      />
      <Header />
      {selectedQuestionSet != null && (
        <React.Fragment>
          <h1 className="title">{selectedQuestionSet.title}</h1>
          <div className="sectionOuter">
            <section className="leftSection">
              <div className="previewContainer">
                {allQuestions.map((obj, idx) => {
                  return (
                    <Question
                      questionData={obj}
                      selectQuestion={() => selectQuestion(idx)}
                    />
                  );
                })}
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
                  saveQuestion={q => saveQuestion(q)}
                  mode={mode}
                />
              )}
            </section>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Home;
