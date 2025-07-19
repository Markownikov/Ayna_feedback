import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="main-content">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center animate-fadeIn" style={{ padding: '5rem 0' }}>
          <div 
            style={{ 
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '4rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}
          >
            ✨ Feedback Collection Platform
          </div>
          <p 
            style={{ 
              fontSize: '1.3rem', 
              color: 'var(--text-light)', 
              marginBottom: '3rem', 
              maxWidth: '700px', 
              margin: '0 auto 3rem',
              lineHeight: '1.6'
            }}
          >
            Create beautiful, responsive feedback forms with advanced analytics. 
            Collect insights, engage your audience, and make data-driven decisions with ease.
          </p>
          
          {isAuthenticated ? (
            <div className="flex gap-4 justify-center animate-slideIn">
              <Link 
                to="/dashboard" 
                className="btn btn-primary"
                style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', minWidth: '200px' }}
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/create-form" 
                className="btn btn-success"
                style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', minWidth: '200px' }}
              >
                ✨ Create Form
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center animate-slideIn">
              <Link 
                to="/register" 
                className="btn btn-primary"
                style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', minWidth: '200px' }}
              >
                🚀 Get Started
              </Link>
              <Link 
                to="/login" 
                className="btn btn-outline"
                style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', minWidth: '200px' }}
              >
                🔐 Login
              </Link>
            </div>
          )}
        </div>
        
        {/* Features Section */}
        <div className="forms-grid" style={{ marginTop: '5rem' }}>
          <div className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>📝</div>
            <h3 className="text-gradient" style={{ marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center' }}>
              Easy Form Creation
            </h3>
            <p style={{ color: 'var(--text-light)', textAlign: 'center', lineHeight: '1.6' }}>
              Build sophisticated feedback forms with our intuitive drag-and-drop interface. 
              Support for text, multiple-choice, and custom question types.
            </p>
          </div>
          
          <div className="card animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>🔗</div>
            <h3 className="text-gradient" style={{ marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center' }}>
              Public Sharing
            </h3>
            <p style={{ color: 'var(--text-light)', textAlign: 'center', lineHeight: '1.6' }}>
              Share your forms instantly with secure public URLs. Mobile-responsive design 
              ensures perfect experience across all devices.
            </p>
          </div>
          
          <div className="card animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>📊</div>
            <h3 className="text-gradient" style={{ marginBottom: '1rem', fontSize: '1.5rem', textAlign: 'center' }}>
              Advanced Analytics
            </h3>
            <p style={{ color: 'var(--text-light)', textAlign: 'center', lineHeight: '1.6' }}>
              Visualize responses with beautiful charts and graphs. Export data as CSV, 
              track trends, and gain actionable insights.
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-4">
          <div className="card animate-fadeIn" style={{ animationDelay: '0.8s', textAlign: 'center', padding: '3rem' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
              Ready to Start Collecting Feedback?
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-light)', 
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Join thousands of businesses already using our platform to gather valuable customer insights.
            </p>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="btn btn-primary animate-pulse"
                style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}
              >
                🎯 Start Free Today
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
