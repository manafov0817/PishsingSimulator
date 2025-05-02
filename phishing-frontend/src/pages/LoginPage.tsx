import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
