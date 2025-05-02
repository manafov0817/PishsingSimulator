import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';

const baseUrl = 'http://localhost:3000'; // NestJS backend URL

// Function to handle token format consistency
const prepareAuthHeader = (token: string): string => {
  // If token already has 'Bearer ' prefix, return as is
  if (token.startsWith('Bearer ')) {
    return token;
  }
  // Otherwise add the prefix
  return `Bearer ${token}`;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the Redux state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        // Set the Authorization header with proper format
        const authHeader = prepareAuthHeader(token);
        headers.set('Authorization', authHeader);
        
        // Log for debugging
        console.log('Token found and Authorization header set:', authHeader);
      } else {
        console.log('No auth token found in Redux state');
      }
      
      // Always set common headers
      headers.set('Content-Type', 'application/json');
      
      return headers;
    },
  }),
  tagTypes: ['PhishingAttempt', 'User'],
  endpoints: () => ({}),
});
