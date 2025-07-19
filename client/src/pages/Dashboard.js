import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formsAPI } from '../utils/api';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await formsAPI.getForms();
      setForms(response.data);
    } catch (error) {
      setError('Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await formsAPI.deleteForm(formId);
        setForms(forms.filter(form => form._id !== formId));
        setSuccessMessage('Form deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Failed to delete form');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage('Link copied to clipboard! 📋');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getTotalResponses = () => {
    return forms.reduce((total, form) => total + (form.responseCount || 0), 0);
  };

  if (loading) {
    return (
      <div className="loading animate-fadeIn">
        <div className="spinner"></div>
        <p>Loading your forms...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="dashboard-header animate-fadeIn">
          <div>
            <h1>📊 My Forms Dashboard</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', margin: '0.5rem 0' }}>
              Manage your feedback forms and analyze responses
            </p>
          </div>
          <Link to="/create-form" className="btn btn-primary">
            ✨ Create New Form
          </Link>
        </div>

        {/* Stats Cards */}
        {forms.length > 0 && (
          <div className="stats-grid animate-slideIn">
            <div className="stat-card">
              <div className="stat-number">{forms.length}</div>
              <div className="stat-label">Total Forms</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{getTotalResponses()}</div>
              <div className="stat-label">Total Responses</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {forms.length > 0 ? Math.round(getTotalResponses() / forms.length) : 0}
              </div>
              <div className="stat-label">Avg per Form</div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success animate-fadeIn">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-error animate-fadeIn">
            {error}
          </div>
        )}

        {forms.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No forms yet</h3>
            <p className="empty-state-description">
              Create your first feedback form to start collecting valuable insights from your users!
            </p>
            <Link to="/create-form" className="btn btn-primary">
              🚀 Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map((form, index) => (
              <div 
                key={form._id} 
                className="form-card animate-fadeIn" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="form-card-title">📋 {form.title}</div>
                {form.description && (
                  <div className="form-card-description">{form.description}</div>
                )}
                
                <div className="form-card-stats">
                  <span>📊 {form.responseCount || 0} responses</span>
                  <span>❓ {form.questions.length} questions</span>
                </div>
                
                <div className="form-card-actions">
                  <Link 
                    to={`/forms/${form._id}/responses`} 
                    className="btn btn-primary"
                  >
                    📈 View Responses
                  </Link>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/form/${form.publicUrl}`)}
                    className="btn btn-secondary"
                  >
                    🔗 Copy Link
                  </button>
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
                
                <div 
                  style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem',
                    background: 'var(--light-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem', 
                    color: 'var(--text-light)',
                    wordBreak: 'break-all'
                  }}
                >
                  <strong>🌐 Public URL:</strong><br />
                  <code style={{ fontSize: '0.8rem' }}>
                    {`${window.location.origin}/form/${form.publicUrl}`}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
