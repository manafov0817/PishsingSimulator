import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { User } from '../../models/user';
import { LoginResponse } from '../../models/loginResponse';

// Define the interface for auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
} 
const getInitialToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const getInitialUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Initial state
const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { user } = action.payload;
      const token = action.payload.token || action.payload.access_token || action.payload.accessToken;
      
      if (!token) {
        console.error('No token found in login response:', action.payload);
        return;
      }
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Store in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // For debugging - log the token to console
      console.log('Token stored:', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Create selectors with proper typing
export const selectCurrentUser = (state: RootState): User | null => state.auth.user;
export const selectCurrentToken = (state: RootState): string | null => state.auth.token;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export default authSlice.reducer;
