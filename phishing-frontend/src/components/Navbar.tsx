import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';

const Navbar: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                Phishing Simulator
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/phishing"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Phishing Attempts
                  </Link>
                  <Link
                    to="/phishing/new"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Create New Attempt
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <span className="text-white mr-4">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
