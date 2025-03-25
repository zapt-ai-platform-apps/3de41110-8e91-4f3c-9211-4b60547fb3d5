import React from 'react';
import { AuthProvider } from '../modules/auth/AuthProvider';
import { JournalProvider } from '../modules/journal/JournalProvider';
import { OnboardingProvider } from '../modules/onboarding/OnboardingProvider';
import { NotificationProvider } from '../modules/notifications/NotificationProvider';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <NotificationProvider>
          <JournalProvider>
            {children}
          </JournalProvider>
        </NotificationProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}