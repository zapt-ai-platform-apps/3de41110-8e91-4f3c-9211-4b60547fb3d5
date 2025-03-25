import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { supabase } from '../../supabaseClient';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notificationTime, setNotificationTime] = useState('');
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    } else {
      setNotificationTime('');
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    if (!user) return;
    
    setIsLoadingSettings(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/notifications/settings', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load notification settings');
      }
      
      const { notificationTime } = await response.json();
      setNotificationTime(notificationTime || '');
    } catch (err) {
      console.error('Error loading notification settings:', err);
      setError('Failed to load your notification settings');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveNotificationSettings = async (time) => {
    if (!user) return;
    
    setIsSavingSettings(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationTime: time,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save notification settings');
      }
      
      setNotificationTime(time);
      return true;
    } catch (err) {
      console.error('Error saving notification settings:', err);
      setError('Failed to save your notification settings');
      return false;
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationTime,
        isLoadingSettings,
        isSavingSettings,
        error,
        saveNotificationSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}