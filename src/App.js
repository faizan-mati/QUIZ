import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  // const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestion();
  }, [currentIndex]);

  // useEffect(() => {
  //   const timerId = setInterval(() => {
  //     if (timer > 0 && selectedOption === null) {
  //       setTimer((prevTimer) => prevTimer - 1);
  //     } else {
  //       clearInterval(timerId);
  //       handleSkip();
  //     }
  //   }, 1000);

  //   return () => clearInterval(timerId);
  // }, [timer, selectedOption]);

  function getQuestion() {
    // setTimer(15);
    setLoading(true);
    fetch("https://the-trivia-api.com/v2/questions")
      .then((res) => res.json())
      .then((res) => {
        res.forEach(function (item) {
          item.options = [...item.incorrectAnswers, item.correctAnswer];
          item.options = shuffle(item.options);
        });
        setQuestions(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function nextQuestion() {
    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedOption(null);
    setCurrentIndex(currentIndex + 1);
  }


  function resetQuestion() {
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
  }

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }

  function handleOptionClick(item) {
    if (selectedOption === item) {
      setSelectedOption(null);
    } else {
      setSelectedOption(item);
    }
  }

  // function handleSkip() {
  //   setSelectedOption(null);
  //   setCurrentIndex(currentIndex + 1);
  // }

  if (loading || !questions.length) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const quizEnd = currentIndex === questions.length;
  const currentQuestion = questions[currentIndex];

  return (
    <div>
      {!quizEnd ? (
        <div className="app-container">
          <h1>THE QUIZ</h1>
          <div className="container">
            <div className="quiz-container">
              <div className="row">
                <div className="col-lg-8 col-sm-12">
                  <h3 className="question">
                    <div className="icon-container">
                      <IoIosArrowBack className="arrow-icon" />
                      {currentIndex + 1} / 10
                      <IoIosArrowForward className="arrow-icon" />
                    </div>
                    <br />
                    {currentQuestion.question.text}
                  </h3>
                  {/* <p className="timer">Time left: {timer} seconds</p> */}
                  {/* <li>{currentQuestion.correctAnswer}</li> */}
                  <div className="options">
                    <hr />
                    {currentQuestion.options.map((item, index) => (
                      <div
                        key={index}
                        className={`option ${selectedOption === item ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(item)}
                      >
                        <input
                          type='radio'
                          value={item}
                          name='faizan'
                          checked={selectedOption === item}
                          onChange={handleOptionChange}
                        />
                        <span style={{ marginLeft: "10px" }}>{item}</span>
                        <hr />
                      </div>
                    ))}
                  </div>
                  <button onClick={nextQuestion} disabled={!selectedOption} className="next-button">
                    Next
                  </button>
                </div>
                <div className="col-lg-4  col-sm-12">
                  <img
                    src="https://pngfre.com/wp-content/uploads/question-mark-png-from-pngfre-10-1-901x1024.png"
                    alt='image'
                    width={250}
                    height={450}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="app-container-result">
          <h1>THE QUIZ</h1>
          <div className="result-container">
            <h2 className="result-heading" style={{ fontWeight: "bold" }}>Quiz Completed!</h2>
            <p className="result-score">Your Score: {score} out of {questions.length}</p>
            {score > 5 && <div> <h4 style={{ color: "green" }}>You scored more than 5! Great job!</h4></div>}
            {score <= 5 && <div> <h4 style={{ color: "red", fontWeight: "bold" }}>You scored 5 or less. Keep practicing!</h4></div>}
            <button onClick={resetQuestion} className="reset-button">
              Reset Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;