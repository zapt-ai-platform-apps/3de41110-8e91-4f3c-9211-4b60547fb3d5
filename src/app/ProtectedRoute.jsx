import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { useOnboarding } from '../modules/onboarding/hooks/useOnboarding';
import LoadingScreen from '../shared/components/LoadingScreen';

const ProtectedRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedOnboarding, loading: onboardingLoading } = useOnboarding();
  const location = useLocation();

  const loading = authLoading || onboardingLoading;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user hasn't completed onboarding and isn't already on the onboarding page
  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is on onboarding page but has completed it, redirect to dashboard
  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;