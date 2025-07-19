import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formsAPI } from '../utils/api';

const CreateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [
      { text: '', type: 'text', options: [], required: true },
      { text: '', type: 'text', options: [], required: true },
      { text: '', type: 'text', options: [], required: true }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    
    // Clear options if changing from multiple-choice to text
    if (field === 'type' && value === 'text') {
      newQuestions[index].options = [];
    }
    
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex].options = newOptions;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    if (formData.questions.length < 5) {
      setFormData({
        ...formData,
        questions: [...formData.questions, { text: '', type: 'text', options: [], required: true }]
      });
    }
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 3) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.title.trim()) {
      setError('Form title is required');
      return;
    }
    
    const validQuestions = formData.questions.filter(q => q.text.trim());
    if (validQuestions.length < 3) {
      setError('At least 3 questions are required');
      return;
    }
    
    // Validate multiple-choice questions have options
    for (const question of validQuestions) {
      if (question.type === 'multiple-choice') {
        const validOptions = question.options.filter(option => option.trim());
        if (validOptions.length < 2) {
          setError('Multiple-choice questions must have at least 2 options');
          return;
        }
        question.options = validOptions;
      }
    }
    
    setLoading(true);
    
    try {
      const response = await formsAPI.createForm({
        ...formData,
        questions: validQuestions
      });
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header">
            <h1 className="card-title">Create New Feedback Form</h1>
          </div>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Form Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Customer Satisfaction Survey"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Brief description of your feedback form"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Questions ({formData.questions.length}/5)</label>
              
              {formData.questions.map((question, index) => (
                <div key={index} className="question-item">
                  <div className="question-header">
                    <span style={{ fontWeight: 'bold' }}>Question {index + 1}</span>
                    {formData.questions.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                      className="form-input"
                      placeholder="Enter your question"
                    />
                  </div>
                  
                  <div className="form-group">
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                      className="form-select"
                    >
                      <option value="text">Text Answer</option>
                      <option value="multiple-choice">Multiple Choice</option>
                    </select>
                  </div>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="form-group">
                      <label className="form-label">Options:</label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                            className="form-input"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="btn btn-danger"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {formData.questions.length < 5 && (
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Add Question
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Form...' : 'Create Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
