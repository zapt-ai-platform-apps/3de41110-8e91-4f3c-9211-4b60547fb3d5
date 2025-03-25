import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { supabase } from '../../supabaseClient';

export const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setHasCompletedOnboarding(false);
      setResponses({});
      setLoading(false);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/onboarding/status', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to check onboarding status');
      }
      
      const { completed, responses: savedResponses } = await response.json();
      setHasCompletedOnboarding(completed);
      setResponses(savedResponses || {});
    } catch (err) {
      console.error('Error checking onboarding status:', err);
      setError('Failed to check your onboarding status');
    } finally {
      setLoading(false);
    }
  };

  const saveOnboardingResponses = async (newResponses) => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: newResponses }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save onboarding responses');
      }
      
      setResponses(newResponses);
      setHasCompletedOnboarding(true);
      return true;
    } catch (err) {
      console.error('Error saving onboarding responses:', err);
      setError('Failed to save your onboarding responses');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        responses,
        loading,
        error,
        isSaving,
        saveOnboardingResponses,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}