import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
