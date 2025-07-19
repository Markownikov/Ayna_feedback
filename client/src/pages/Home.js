import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="main-content">
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#2c3e50' }}>
            Feedback Collection Platform
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Create beautiful feedback forms, collect responses, and analyze data with ease. 
            Perfect for businesses looking to gather customer insights.
          </p>
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Go to Dashboard
              </Link>
              <Link to="/create-form" className="btn btn-success" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Create New Form
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Login
              </Link>
            </div>
          )}
        </div>
        
        <div className="forms-grid" style={{ marginTop: '4rem' }}>
          <div className="card">
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>📝 Easy Form Creation</h3>
            <p style={{ color: '#666' }}>
              Create custom feedback forms with text and multiple-choice questions in minutes.
            </p>
          </div>
          
          <div className="card">
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🔗 Public Sharing</h3>
            <p style={{ color: '#666' }}>
              Share your forms with a simple public URL. No login required for respondents.
            </p>
          </div>
          
          <div className="card">
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>📊 Response Analytics</h3>
            <p style={{ color: '#666' }}>
              View all responses in a clean dashboard and export data as CSV files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
