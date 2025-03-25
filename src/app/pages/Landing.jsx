import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { useOnboarding } from '../../modules/onboarding/hooks/useOnboarding';
import AuthForm from '../../modules/auth/components/AuthForm';
import Logo from '../../shared/components/Logo';
import LoadingScreen from '../../shared/components/LoadingScreen';

const Landing = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedOnboarding, loading: onboardingLoading } = useOnboarding();
  const navigate = useNavigate();

  const loading = authLoading || onboardingLoading;

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    if (!hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Logo />
        </div>
      </header>

      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              Reflect on your past, <br />
              <span className="text-indigo-600">Set intentions</span> for your future
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Build a meaningful daily practice with guided journaling prompts and timely reminders. Track your growth and cultivate mindfulness over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="btn-primary cursor-pointer"
                onClick={() => document.getElementById('auth-container').scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </button>
              <button 
                className="btn-secondary cursor-pointer"
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div id="auth-container" className="card max-w-md mx-auto w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign in with ZAPT</h2>
            <p className="mb-6 text-center text-gray-600">
              Create an account or sign in to start your reflection journey
            </p>
            <AuthForm />
            <div className="mt-4 text-center text-sm text-gray-500">
              <a 
                href="https://www.zapt.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Learn more about ZAPT
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Reflections & Intentions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;