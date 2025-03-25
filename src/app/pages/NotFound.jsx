import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="btn-primary cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;