import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { formatISO } from 'date-fns';
import toast from 'react-hot-toast';

export const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/journal/entries', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load journal entries');
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error('Error loading journal entries:', err);
      setError('Failed to load your journal entries');
      toast.error('Could not load your journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async (date, reflections, intentions) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formattedDate = formatISO(date, { representation: 'date' });
      
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
          reflections,
          intentions,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }
      
      const savedEntry = await response.json();
      
      setEntries(prev => {
        // Replace entry if it exists for this date, otherwise add it
        const exists = prev.some(entry => entry.date === formattedDate);
        if (exists) {
          return prev.map(entry => 
            entry.date === formattedDate ? savedEntry : entry
          );
        } else {
          return [...prev, savedEntry];
        }
      });
      
      toast.success('Journal entry saved successfully');
      return savedEntry;
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save your journal entry');
      toast.error('Could not save your journal entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEntryByDate = (date) => {
    const formattedDate = formatISO(date, { representation: 'date' });
    return entries.find(entry => entry.date === formattedDate) || null;
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        isLoading,
        error,
        loadEntries,
        saveEntry,
        getEntryByDate,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}