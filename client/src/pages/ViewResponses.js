import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formsAPI } from '../utils/api';

const ViewResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [formResponse, responsesResponse] = await Promise.all([
        formsAPI.getForm(id),
        formsAPI.getResponses(id)
      ]);
      
      setForm(formResponse.data);
      setResponses(responsesResponse.data);
    } catch (error) {
      setError('Failed to fetch form data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await formsAPI.exportResponses(id);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${form.title}-responses.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export responses');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading responses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="alert alert-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="card-header">
          <div>
            <h1 className="card-title">{form.title} - Responses</h1>
            <p style={{ color: '#666', margin: '0.5rem 0' }}>
              Total responses: {responses.length}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
            {responses.length > 0 && (
              <button onClick={handleExport} className="btn btn-success">
                Export CSV
              </button>
            )}
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No responses yet</h3>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              Share your form to start collecting feedback!
            </p>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              Form URL: <code>{`${window.location.origin}/form/${form.publicUrl}`}</code>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="responses-table">
              <thead>
                <tr>
                  <th>Submitted At</th>
                  {form.questions.map((question) => (
                    <th key={question._id}>{question.text}</th>
                  ))}
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response._id}>
                    <td>{formatDate(response.submittedAt)}</td>
                    {form.questions.map((question) => {
                      const answer = response.answers.find(
                        a => a.questionId === question._id
                      );
                      return (
                        <td key={question._id}>
                          {answer ? (
                            Array.isArray(answer.answer) 
                              ? answer.answer.join(', ')
                              : answer.answer
                          ) : 'N/A'}
                        </td>
                      );
                    })}
                    <td>{response.ipAddress || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {responses.length > 0 && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Response Summary</h3>
            {form.questions.map((question) => {
              const questionResponses = responses
                .map(r => r.answers.find(a => a.questionId === question._id))
                .filter(a => a && a.answer);
              
              if (question.type === 'multiple-choice' && questionResponses.length > 0) {
                const counts = {};
                questionResponses.forEach(response => {
                  const answer = response.answer;
                  counts[answer] = (counts[answer] || 0) + 1;
                });
                
                return (
                  <div key={question._id} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                      {question.text}
                    </h4>
                    {Object.entries(counts).map(([option, count]) => (
                      <div key={option} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{option}</span>
                          <span style={{ fontWeight: 'bold' }}>
                            {count} ({Math.round((count / questionResponses.length) * 100)}%)
                          </span>
                        </div>
                        <div style={{ 
                          backgroundColor: '#e9ecef', 
                          height: '8px', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            backgroundColor: '#3498db',
                            height: '100%',
                            width: `${(count / questionResponses.length) * 100}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResponses;
