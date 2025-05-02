import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import PhishingAttemptsList from '../components/PhishingAttemptsList';

const PhishingAttemptsPage: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Phishing Attempts</h1>
        <a
          href="/phishing/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Attempt
        </a>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <PhishingAttemptsList />
      </div>
    </div>
  );
};

export default PhishingAttemptsPage;
