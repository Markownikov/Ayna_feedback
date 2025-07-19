import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formsAPI } from '../utils/api';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (error) {
        setError('Failed to delete form');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading your forms...
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Forms</h1>
          <Link to="/create-form" className="btn btn-primary">
            Create New Form
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {forms.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No forms yet</h3>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              Create your first feedback form to get started!
            </p>
            <Link to="/create-form" className="btn btn-primary">
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map((form) => (
              <div key={form._id} className="form-card">
                <div className="form-card-title">{form.title}</div>
                {form.description && (
                  <div className="form-card-description">{form.description}</div>
                )}
                
                <div className="form-card-stats">
                  <span>{form.responseCount || 0} responses</span>
                  <span>{form.questions.length} questions</span>
                </div>
                
                <div className="form-card-actions">
                  <Link 
                    to={`/forms/${form._id}/responses`} 
                    className="btn btn-primary"
                  >
                    View Responses
                  </Link>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/form/${form.publicUrl}`)}
                    className="btn btn-secondary"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
                
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
                  Public URL: <code>{`${window.location.origin}/form/${form.publicUrl}`}</code>
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
