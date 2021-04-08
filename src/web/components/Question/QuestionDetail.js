import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";

const QuestionDetail = props => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [recorderObj, setRecorderObj] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [questionType, setQuestionType] = useState("text");
  const [questionData, setQuestionData] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");

  useEffect(() => {
    if (props.question.id) {
      setQuestionData(props.question.data);
      setQuestionTitle(props.question.title);
      setQuestionType(props.question.type);
    } else {
      setQuestionData("");
      setQuestionTitle("");
      setQuestionType("text");
    }
  }, [props.question]);

  const selectQuestionType = e => {};

  const recordAudio = () =>
    new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      const start = () => mediaRecorder.start();

      const stop = () =>
        new Promise(resolve => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            localStorage.setItem("audioUrl", audioUrl);
            const actionPlayer = document
              .getElementById("audio-player")
              .setAttribute("src", audioUrl);
            setQuestionData(audioUrl);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({ audioBlob, audioUrl, play });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    });

  const sleep = time => new Promise(resolve => setTimeout(resolve, time));

  const startRecording = async () => {
    const recorder = await recordAudio();
    setRecorderObj(recorder);
    setRecordingStarted(true);

    const actionButton = document.getElementById("action");
    actionButton.disabled = true;
    recorder.start();
    actionButton.disabled = false;
  };

  const saveQuestion = async () => {
    let formData = {
      title: questionTitle,
      type: questionType,
      data: questionData
    };
    if (props.question.id) {
      formData.id = props.question.id;
    }
    await props.saveQuestion(formData);
    setQuestionData("");
    setQuestionTitle("");
    setQuestionType("text");
  };

  const stopRecording = async () => {
    await recorderObj.stop();
    setRecorderObj(null);
    setRecordingStarted(false);
  };

  return (
    <React.Fragment>
      <div className="editorOuter">
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Question</label>
          <input
            type="email"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Type Question Title"
            onChange={e => setQuestionTitle(e.target.value)}
            value={questionTitle}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleFormControlSelect1">Type of Question</label>
          <select
            onChange={e => setQuestionType(e.target.value)}
            value={questionType}
          >
            <option value="video">Record Video</option>
            <option value="audio">Record Audio</option>
            <option value="text">Record Only Text</option>
          </select>
        </div>
        {(questionType == "audio" || questionType == "video") && (
          <React.Fragment>
            <button
              id="action"
              type="button"
              className="btn btn-primary"
              onClick={() =>
                recordingStarted ? stopRecording() : startRecording()
              }
            >
              {recordingStarted ? "Stop Recording" : "Record " + questionType}{" "}
            </button>
            <audio id="audio-player" controls="controls">
              <source type="audio/mp3" src={questionData} />
            </audio>
          </React.Fragment>
        )}
        <div className="text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => saveQuestion()}
          >
            Submit
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuestionDetail;
