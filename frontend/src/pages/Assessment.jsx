import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentsAPI } from '../services/api';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await assessmentsAPI.getQuestions('phq9');
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: currentQuestion + 1,
      questionText: questions[currentQuestion].text,
      answer: answerIndex,
      points: answerIndex
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    try {
      await assessmentsAPI.submit({
        type: 'phq9',
        answers: answers
      });
      navigate('/dashboard'); // You might want to navigate to results page instead
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>No Questions Available</h2>
          <p>Unable to load assessment questions. Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="assessment-container">
      <div className="container">
        <div className="question-container card">
          <div className="question-text">
            {currentQ.text}
          </div>
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`option ${answers[currentQuestion]?.answer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="assessment-nav">
            <button 
              className="btn btn-outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <i className="fas fa-arrow-left"></i> Previous
            </button>
            <div className="progress">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
