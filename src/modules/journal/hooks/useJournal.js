import { useContext } from 'react';
import { JournalContext } from '../JournalProvider';

export function useJournal() {
  const context = useContext(JournalContext);
  
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  
  return context;
}