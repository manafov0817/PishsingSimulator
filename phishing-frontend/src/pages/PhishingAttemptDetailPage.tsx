import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPhishingAttemptByIdQuery, useGetPhishingAttemptsQuery } from '../features/phishing/phishingApiSlice';
import { formatDistance } from 'date-fns';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';

const PhishingAttemptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Try to get the specific phishing attempt by ID
  const {
    data: phishingAttempt,
    isLoading: isLoadingById,
    isError: isErrorById,
    error: errorById
  } = useGetPhishingAttemptByIdQuery(id as string, {
    // Skip this query if there are backend issues with the getById endpoint
    skip: false
  });

  // Also get all phishing attempts as a fallback
  const {
    data: phishingAttempts,
    isLoading: isLoadingAll
  } = useGetPhishingAttemptsQuery(undefined, {
    // Only run this query if the getById fails
    skip: !isErrorById
  });

  // Find the matching attempt from the list if getById failed
  const foundAttempt = React.useMemo(() => {
    if (isErrorById && phishingAttempts) {
      return phishingAttempts.find(attempt => attempt.id === id);
    }
    return null;
  }, [isErrorById, phishingAttempts, id]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const isLoading = isLoadingById || (isErrorById && isLoadingAll);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-indigo-600">Loading phishing attempt details...</div>
      </div>
    );
  }

  // If we can't find the attempt in either query
  if (!phishingAttempt && !foundAttempt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <h2 className="font-medium">Phishing attempt not found</h2>
          <p className="mt-2">
            {isErrorById ? 
              `Error: ${(errorById as any)?.data?.message || "API endpoint returned an error"}` :
              "The requested phishing attempt could not be found or may have been deleted."}
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={() => navigate('/phishing')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Use either the found attempt or the one from getById
  const attempt = phishingAttempt || foundAttempt;

  // Helper function to get status badge style
  const getStatusStyle = (status: string) => {
    switch (String(status).toLowerCase()) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'clicked':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format the status for display
  const formatStatus = (status: string) => {
    const statusStr = String(status);
    return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Phishing Attempt Details</h1>
        <button
          onClick={() => navigate('/phishing')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
        >
          Back to List
        </button>
      </div>

      {isErrorById && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                The direct API for fetching this phishing attempt returned an error. 
                Displaying data from the phishing attempts list instead.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Email to: {attempt?.targetEmail}
              </h2>
              <p className="text-sm text-gray-500">
                Created: {attempt?.createdAt ? formatDistance(new Date(attempt.createdAt), new Date(), { addSuffix: true }) : 'Unknown'}
              </p>
            </div>
            <span 
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(attempt?.status || '')}`}
            >
              {formatStatus(String(attempt?.status || 'Unknown'))}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Subject</dt>
              <dd className="mt-1 text-sm text-gray-900">{attempt?.emailSubject || "(No subject)"}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Tracking ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{attempt?.trackingId || "Not available"}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Sent At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {attempt?.sentAt 
                  ? formatDistance(new Date(attempt.sentAt), new Date(), { addSuffix: true })
                  : "Not sent yet"}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Clicked At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {attempt?.clickedAt
                  ? formatDistance(new Date(attempt.clickedAt), new Date(), { addSuffix: true })
                  : "Not clicked"}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Email Content</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">
                {attempt?.emailContent || "(No content)"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
            onClick={() => navigate('/phishing')}
          >
            Back
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default PhishingAttemptDetailPage;
