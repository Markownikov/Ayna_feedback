import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formsAPI } from '../utils/api';

const PublicForm = () => {
  const { publicUrl } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [publicUrl]);

  const fetchForm = async () => {
    try {
      const response = await formsAPI.getPublicForm(publicUrl);
      setForm(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach(question => {
        initialAnswers[question._id] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      setError('Form not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate required questions
    const formattedAnswers = form.questions.map(question => {
      const answer = answers[question._id];
      
      if (question.required && (!answer || answer.trim() === '')) {
        throw new Error(`Please answer: ${question.text}`);
      }
      
      return {
        questionId: question._id,
        questionText: question.text,
        answer: answer
      };
    });
    
    setSubmitting(true);
    
    try {
      await formsAPI.submitResponse(publicUrl, { answers: formattedAnswers });
      setSubmitted(true);
    } catch (error) {
      if (error.message.includes('Please answer:')) {
        setError(error.message);
      } else {
        setError('Failed to submit response. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading form...
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Form Not Found</h2>
            <p style={{ color: '#666' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#27ae60', marginBottom: '1rem' }}>Thank You!</h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Your feedback has been submitted successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="public-form-container">
        <div className="public-form-header">
          <h1 className="public-form-title">{form.title}</h1>
          {form.description && (
            <p className="public-form-description">{form.description}</p>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {form.questions.map((question, index) => (
            <div key={question._id} className="public-question">
              <div className="public-question-text">
                {index + 1}. {question.text}
                {question.required && <span style={{ color: '#e74c3c' }}> *</span>}
              </div>
              
              {question.type === 'text' ? (
                <textarea
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  className="form-textarea"
                  placeholder="Enter your answer..."
                  rows="4"
                />
              ) : (
                <div className="radio-group">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="radio-option">
                      <input
                        type="radio"
                        id={`${question._id}-${optionIndex}`}
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      />
                      <label htmlFor={`${question._id}-${optionIndex}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;
