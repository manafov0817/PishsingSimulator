import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';
import { useGetPhishingAttemptsQuery } from '../features/phishing/phishingApiSlice';

const Dashboard: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const { data: phishingAttempts, isLoading, isError, refetch } = useGetPhishingAttemptsQuery();

  // Add debugging to see what data we're getting
  useEffect(() => {
    if (phishingAttempts) {
      console.log('Total attempts:', phishingAttempts.length);
      console.log('Raw phishing attempts data:', phishingAttempts);
      
      // Log individual statuses
      const statuses = phishingAttempts.map(attempt => attempt.status);
      console.log('All statuses:', statuses);
      
      // Check for clicked attempts - try various possible status values
      console.log('Attempts with status "clicked":', 
        phishingAttempts.filter(a => String(a.status).toLowerCase() === 'clicked').length);
      console.log('Attempts with status "CLICKED":', 
        phishingAttempts.filter(a => String(a.status).toUpperCase() === 'CLICKED').length);
      console.log('Attempts with status containing "click":', 
        phishingAttempts.filter(a => String(a.status).toLowerCase().includes('click')).length);
      
      // Check for sent attempts
      console.log('Attempts with status "sent":', 
        phishingAttempts.filter(a => String(a.status).toLowerCase() === 'sent').length);
      console.log('Attempts with status containing "sent":', 
        phishingAttempts.filter(a => String(a.status).toLowerCase().includes('sent')).length);
      
      // Force a refetch if no clicked attempts found
      const hasClicked = phishingAttempts.some(a => 
        String(a.status).toLowerCase().includes('click') || 
        a.clickedAt !== null && a.clickedAt !== undefined
      );
      console.log('Has any clicked attempts based on status or clickedAt:', hasClicked);
    }
  }, [phishingAttempts, refetch]);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Show loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }
  
  // Show error state
  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

  // Calculate statistics (if data is available)
  const totalAttempts = phishingAttempts?.length || 0;
  
  // Try to identify clicked attempts in various ways
  const clickedAttempts = phishingAttempts?.filter(attempt => {
    // Check for any variation of "clicked" status
    const status = String(attempt.status || '').toLowerCase();
    const hasClickedStatus = status === 'clicked' || status.includes('click');
    
    // Also check if clickedAt timestamp exists
    const hasClickedTimestamp = attempt.clickedAt !== null && attempt.clickedAt !== undefined;
    
    return hasClickedStatus || hasClickedTimestamp;
  }).length || 0;
  
  // Try to identify sent attempts in various ways
  const sentAttempts = phishingAttempts?.filter(attempt => {
    const status = String(attempt.status || '').toLowerCase();
    const hasSentStatus = status === 'sent' || status.includes('sent') || status === 'delivered';
    
    // Also check if sentAt timestamp exists but not clicked
    const hasSentTimestamp = attempt.sentAt !== null && attempt.sentAt !== undefined;
    const hasClickedTimestamp = attempt.clickedAt !== null && attempt.clickedAt !== undefined;
    
    // If it has a sent timestamp but no clicked timestamp, it's considered "sent"
    return hasSentStatus || (hasSentTimestamp && !hasClickedTimestamp);
  }).length || 0;
  
  // Calculate click rate with more detailed formula
  let clickRate = '0.0';
  if (totalAttempts > 0) {
    const rate = (clickedAttempts / totalAttempts) * 100;
    clickRate = rate.toFixed(1);
    console.log(`Click rate calculation: ${clickedAttempts} / ${totalAttempts} * 100 = ${rate} → ${clickRate}%`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Welcome, {user?.name || user?.email}</h2>
        <p className="text-gray-600">
          This dashboard gives you an overview of your phishing simulation activities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Total Phishing Attempts</p>
              <p className="text-2xl font-bold">{totalAttempts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Click Rate</p>
              <p className="text-2xl font-bold">{clickRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Sent Attempts</p>
              <p className="text-2xl font-bold">{sentAttempts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Clicked Attempts</p>
              <p className="text-2xl font-bold">{clickedAttempts}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <a
          href="/phishing"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          View All Phishing Attempts
        </a>
        <a
          href="/phishing/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Phishing Attempt
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
