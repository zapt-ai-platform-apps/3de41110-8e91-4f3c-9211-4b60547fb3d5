import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJournal } from '../../modules/journal/hooks/useJournal';
import { useNotifications } from '../../modules/notifications/hooks/useNotifications';
import { format, parseISO, isToday, startOfToday } from 'date-fns';
import Layout from '../../shared/components/Layout';

const Dashboard = () => {
  const { entries, isLoading } = useJournal();
  const { notificationTime } = useNotifications();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  
  const todayEntry = entries.find(entry => 
    isToday(parseISO(entry.date))
  );

  const recentEntries = entries
    .filter(entry => !isToday(parseISO(entry.date)))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {showWelcome && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-indigo-700">
                  Welcome to Reflections & Intentions! Start your daily journaling practice today.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex bg-indigo-50 rounded-md p-1.5 text-indigo-500 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => setShowWelcome(false)}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Today's Journal</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : todayEntry ? (
              <div>
                <p className="text-gray-600 mb-4">You've already written your journal for today!</p>
                <button 
                  className="btn-primary cursor-pointer"
                  onClick={() => navigate('/journal')}
                >
                  View or Edit Today's Entry
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">You haven't written your journal for today yet.</p>
                <button 
                  className="btn-primary cursor-pointer"
                  onClick={() => navigate('/journal')}
                >
                  Start Today's Journal
                </button>
              </div>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Daily Notifications</h2>
            <div>
              {notificationTime ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    Your daily reminder is set for <span className="font-semibold">{notificationTime}</span>
                  </p>
                  <button 
                    className="btn-secondary cursor-pointer"
                    onClick={() => navigate('/settings')}
                  >
                    Change Time
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">You haven't set up daily reminders yet.</p>
                  <button 
                    className="btn-primary cursor-pointer"
                    onClick={() => navigate('/settings')}
                  >
                    Set Reminder Time
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Journal Entries</h2>
            {entries.length > 5 && (
              <Link 
                to="/journal/history" 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View all entries
              </Link>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentEntries.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentEntries.map(entry => (
                <div key={entry.date} className="py-3">
                  <Link 
                    to={`/journal/${entry.date}`}
                    className="block hover:bg-gray-50 rounded-md -mx-4 px-4 py-2 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                      </span>
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 truncate">
                      {entry.reflections.substring(0, 100)}
                      {entry.reflections.length > 100 ? '...' : ''}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You don't have any journal entries yet.</p>
              <p className="mt-2">Start your journaling practice today!</p>
            </div>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              className="btn-secondary cursor-pointer flex items-center justify-center"
              onClick={() => navigate('/journal')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Write Today's Journal
            </button>
            <button 
              className="btn-secondary cursor-pointer flex items-center justify-center"
              onClick={() => navigate('/settings')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;