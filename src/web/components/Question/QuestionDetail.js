import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";

// Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.

//let mediaRecorder = null;
const FPS = 60;
const ROI_X = 0;
const ROI_Y = 0;
const ROI_WIDTH = 480; // Max resolution.
const ROI_HEIGHT = 640;

let cameraStream = null;
let processingStream = null;
let mediaRecorder = null;
let processingPreviewIntervalId = null;
let shareableLink = "";
let audioStream = null;

const QuestionDetail = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recorderObj, setRecorderObj] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [mediaRecorderMain, setMediaRecorder] = useState(null);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [questionType, setQuestionType] = useState("TEXT");
  const [answerType, setAnswerType] = useState("yesno");
  const [questionData, setQuestionData] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [srcObject, setSrcObject] = useState("");

  useEffect(() => {
    if (props.question._id) {
      setQuestionData(
        props.question.type == "AUDIO"
          ? props.question.audioURL
          : props.question.videoURL
      );
      setQuestionTitle(props.question.text);
      setQuestionType(props.question.type);
    } else {
      setQuestionData("");
      setQuestionTitle("");
      setQuestionType("TEXT");
    }
  }, [props.question]);

  useEffect(() => {
    if (questionData) {
      if (questionType == "AUDIO") {
        let recordingAudioPreview = document.getElementById("audio-player");
        recordingAudioPreview.load();
        //recordingAudioPreview.play();
      } else {
        let recordingVideoPreview = document.getElementById("recordingPreview");
        recordingVideoPreview.load();
      }
    }
  }, [questionData]);

  const selectQuestionType = (e) => {};

  const processFrame = () => {
    let cameraPreview = document.getElementById("cameraPreview");

    var processingPreview = document.getElementById("processingPreview");

    if (processingPreview) {
      processingPreview
        .getContext("2d")
        .drawImage(cameraPreview, ROI_X, ROI_Y, ROI_WIDTH, ROI_HEIGHT);
    }
    processingPreviewIntervalId = window.requestAnimationFrame(processFrame);
  };

  const recordMedia = (mediaType) => {
    let constraints = {
      video: mediaType == "VIDEO" ? true : false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (mediaType == "AUDIO") {
          if (stream.getAudioTracks().length > 0) {
            const options = { mimeType: "audio/webm" };
            //const recordedChunksTmp = recordedChunks;

            let mediaRecorder = new MediaRecorder(stream, options);
            let mc = [];
            mediaRecorder.addEventListener("dataavailable", function (e) {
              if (e.data.size > 0) {
                //mc = recordedChunksTmp;
                mc.push(e.data);
                setRecordedChunks(mc);
              }
            });

            mediaRecorder.addEventListener("stop", function () {
              let recordingAudioPreview = document.getElementById(
                "audio-player"
              );
              let recordingAudioPreviewSrc = document.getElementById(
                "audio-player-src"
              );
              recordingAudioPreview.muted = false;
              recordingAudioPreview.pause();
              recordingAudioPreview.removeAttribute("src"); // empty source
              recordingAudioPreviewSrc.src = URL.createObjectURL(new Blob(mc));
              recordingAudioPreview.load();
              recordingAudioPreview.play();
            });

            mediaRecorder.start();
            setMediaRecorder(mediaRecorder);
          }
        } else {
          const constraints = {
            video: {
              width: { ideal: 4096 },
              height: { ideal: 2160 },
              facingMode: { ideal: "environment" },
              aspectRatio: { exact: 1.3333333 },
            },
            audio: true,
          };

          if (stream.getVideoTracks().length > 0) {
            let cameraStream = stream;
            /*var processingPreview = document.getElementById(
              "processingPreview"
            );

            processingStream = processingPreview.captureStream(FPS);
            processingStream.addTrack(cameraStream.getAudioTracks()[0]);*/

            try {
              window.AudioContext =
                window.AudioContext || window.webkitAudioContext;
              window.audioContext = new AudioContext();
            } catch (e) {
              console.log("Web Audio API not supported.");
            }

            /*var soundMeter = (window.soundMeter = new SoundMeter(
              window.audioContext
            ));
            soundMeter.connectToSource(cameraStream, function (e) {
              if (e) {
                console.log(e);
                return;
              } else {
              }
            });*/

            /*let cameraPreview = document.getElementById("cameraPreview");
            setSrcObject(stream);
            if (cameraPreview) {
              cameraPreview.src = stream;
              cameraPreview.style.zIndex = 2;
            }*/

            if (typeof MediaRecorder.isTypeSupported == "function") {
              if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
                var options = { mimeType: "video/webm;codecs=vp9" };
              } else if (
                MediaRecorder.isTypeSupported("video/webm;codecs=h264")
              ) {
                var options = { mimeType: "video/webm;codecs=h264" };
              } else if (MediaRecorder.isTypeSupported("video/webm")) {
                var options = { mimeType: "video/webm" };
              } else if (MediaRecorder.isTypeSupported("video/mp4")) {
                //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
                var options = { mimeType: "video/mp4" };
              }
              console.log("Using " + options.mimeType, processingStream);
              mediaRecorder = new MediaRecorder(stream, options);
            } else {
              console.log("Using ", processingStream);
              mediaRecorder = new MediaRecorder(stream);
            }

            let tmpChunks = recordedChunks;
            let mc = [];
            mediaRecorder.ondataavailable = function (event) {
              mc = tmpChunks;
              mc.push(event.data);
              setRecordedChunks(mc);
            };

            mediaRecorder.addEventListener("stop", function () {
              /*let recordingVideoPreviewSrc = document.getElementById(
                "audio-player-src"
              );*/
              let recordingPreview = document.getElementById(
                "recordingPreview"
              );
              let recordingPreviewSrc = document.getElementById(
                "recordingPreviewSrc"
              );
              if (recordingPreview) {
                recordingPreview.style.zIndex = 1;
              }
              recordingPreview.muted = false;
              recordingPreview.pause();
              recordingPreview.removeAttribute("src"); // empty source
              recordingPreviewSrc.src = URL.createObjectURL(new Blob(mc));
              recordingPreview.load();
              recordingPreview.play();
            });

            mediaRecorder.start();
            setMediaRecorder(mediaRecorder);
            //processFrame();
          }
        }
      })
      .catch((err) => {
        alert("No media device found!" + err);
      });
  };

  /* const recordAudio = () =>
    new Promise(async (resolve) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      const start = () => mediaRecorder.start();

      const stop = () =>
        new Promise((resolve) => {
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
    });*/

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const startRecording = async () => {
    recordMedia(questionType);
    /*setRecorderObj(recorder);
     */
    setRecordingStarted(true);
    const actionButton = document.getElementById("action");
    //actionButton.disabled = true;
    //recorder.start();
    //actionButton.disabled = false;
  };

  const stopRecording = () => {
    if (mediaRecorderMain != null) {
      if (mediaRecorderMain.state == "recording") {
        mediaRecorderMain.stop();
      }
    }
    setMediaRecorder(mediaRecorderMain);
    setRecordingStarted(false);
  };

  const saveQuestion = async () => {
    let mediaBlob = new Blob(recordedChunks, {
      type: questionType == "AUDIO" ? "audio/mp3" : "video/webm",
    });
    var data = new FormData();
    data.append("video", mediaBlob);
    data.append("responseType", answerType);
    data.append("text", questionTitle);
    data.append("type", questionType);
    data.append("questionnaireId", props.questionnaireId);
    if (props.question && props.question._id) {
      data.append("id", props.question._id);
      data.append("order", props.question.order);
      data.append(
        "mediaURL",
        props.question.type == "AUDIO"
          ? props.question.audioURL
          : props.question.videoURL
      );
    } else {
      data.append("order", parseInt(props.totalQuestions) + 1);
    }

    await props.saveQuestion(data);
    setQuestionData("");
    setQuestionTitle("");
    setQuestionType("TEXT");
  };
  return (
    <React.Fragment>
      <div className="editorOuter">
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Question</label>
          <input
            type="text"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Type Question Title"
            onChange={(e) => setQuestionTitle(e.target.value)}
            value={questionTitle}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleFormControlSelect1">Type of Question</label>
          <select
            onChange={(e) => setQuestionType(e.target.value)}
            value={questionType}
          >
            <option value="VIDEO">Record Video</option>
            <option value="AUDIO">Record Audio</option>
            <option value="TEXT">Record Only Text</option>
          </select>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleFormControlSelect1">Type of Answer</label>
          <select
            onChange={(e) => setAnswerType(e.target.value)}
            value={answerType}
          >
            <option value="yesno">Yes/No</option>
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="patient-response">Patient Response</option>
          </select>
        </div>
        {(questionType == "AUDIO" || questionType == "VIDEO") && (
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
            {!recordingStarted && questionType == "AUDIO" && (
              <audio id="audio-player" controls="controls">
                <source
                  id="audio-player-src"
                  type="audio/mp3"
                  src={questionData}
                />
              </audio>
            )}
            {!recordingStarted && questionType == "VIDEO" && (
              <>
                <video id="recordingPreview" width="480" height="640" controls>
                  <source
                    src={questionData}
                    id="recordingPreviewSrc"
                    type="video/webm"
                  />
                </video>
              </>
            )}
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
