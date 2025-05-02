import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import CreatePhishingAttemptForm from '../components/CreatePhishingAttemptForm';

const CreatePhishingAttemptPage: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Create New Phishing Attempt</h1>
        <a
          href="/phishing"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to All Attempts
        </a>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <CreatePhishingAttemptForm />
      </div>
    </div>
  );
};

export default CreatePhishingAttemptPage;
