import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import PublicForm from './pages/PublicForm';
import ViewResponses from './pages/ViewResponses';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/form/:publicUrl" element={<PublicForm />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/create-form" 
              element={
                <PrivateRoute>
                  <CreateForm />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/forms/:id/responses" 
              element={
                <PrivateRoute>
                  <ViewResponses />
                </PrivateRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="main-content">
                  <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                      <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Page Not Found</h2>
                      <p style={{ color: '#666' }}>The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
