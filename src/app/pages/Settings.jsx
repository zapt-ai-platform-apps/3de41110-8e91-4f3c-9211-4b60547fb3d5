import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../modules/notifications/hooks/useNotifications';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import toast from 'react-hot-toast';
import Layout from '../../shared/components/Layout';

const Settings = () => {
  const { notificationTime, saveNotificationSettings, isSavingSettings } = useNotifications();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const [newTime, setNewTime] = useState(notificationTime || '');
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleSaveNotificationTime = async () => {
    if (isSavingSettings) return;
    
    const success = await saveNotificationSettings(newTime);
    if (success) {
      toast.success('Notification time updated successfully!');
    } else {
      toast.error('Failed to update notification time');
    }
  };
  
  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      setIsSigningOut(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Daily Reminder</h2>
          <p className="text-gray-600 mb-4">
            Choose the time you'd like to receive your daily journaling reminder.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <TimePicker
              onChange={setNewTime}
              value={newTime}
              clearIcon={null}
              disableClock
              format="h:mm a"
              className="p-2 border border-gray-300 rounded-md"
            />
            
            <button
              type="button"
              onClick={handleSaveNotificationTime}
              disabled={isSavingSettings || !newTime}
              className={`${
                isSavingSettings || !newTime 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              } btn-primary`}
            >
              {isSavingSettings ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : 'Save Reminder Time'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            You'll receive a notification at this time every day to write your reflections and intentions.
          </p>
        </div>
        
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Management</h2>
          
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="btn-secondary cursor-pointer text-gray-700 hover:text-red-700 border-gray-300 hover:border-red-300"
          >
            {isSigningOut ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing out...
              </div>
            ) : 'Sign Out'}
          </button>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">About Reflections & Intentions</h2>
          
          <p className="text-gray-600 mb-4">
            Reflections & Intentions is a daily journaling app that helps you reflect on your past and set intentions for your future.
          </p>
          
          <p className="text-gray-600 mb-4">
            Regular journaling has been shown to improve mental clarity, reduce stress, and increase mindfulness. By making this a daily practice, you're investing in your wellbeing and personal growth.
          </p>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>
              Version 1.0.0
            </p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} Reflections & Intentions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;