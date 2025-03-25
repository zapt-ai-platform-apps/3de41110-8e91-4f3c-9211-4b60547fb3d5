import React, { useState, useEffect } from 'react';
import { useJournal } from '../hooks/useJournal';
import { format } from 'date-fns';

const reflectionPrompts = [
  "What went well today?",
  "What was challenging for you today?",
  "What did you learn today?",
  "What are you grateful for today?",
  "How did you take care of yourself today?",
];

const intentionPrompts = [
  "What's your main focus for tomorrow?",
  "How do you want to feel tomorrow?",
  "What's one thing you want to accomplish tomorrow?",
  "How will you take care of yourself tomorrow?",
  "What boundaries do you want to set for tomorrow?",
];

const JournalForm = ({ date = new Date() }) => {
  const { saveEntry, getEntryByDate, isLoading } = useJournal();
  const [reflections, setReflections] = useState('');
  const [intentions, setIntentions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const existingEntry = getEntryByDate(date);
    if (existingEntry) {
      setReflections(existingEntry.reflections || '');
      setIntentions(existingEntry.intentions || '');
    } else {
      setReflections('');
      setIntentions('');
    }
  }, [date, getEntryByDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await saveEntry(date, reflections, intentions);
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h2>
        
        <div className="mb-6">
          <label htmlFor="reflections" className="form-label">
            Daily Reflections
          </label>
          <div className="mb-2 text-sm text-gray-600">
            Consider these prompts:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {reflectionPrompts.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </ul>
          </div>
          <textarea
            id="reflections"
            value={reflections}
            onChange={(e) => setReflections(e.target.value)}
            className="input-field min-h-32"
            placeholder="Reflect on your day..."
            rows={6}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="intentions" className="form-label">
            Tomorrow's Intentions
          </label>
          <div className="mb-2 text-sm text-gray-600">
            Consider these prompts:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {intentionPrompts.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </ul>
          </div>
          <textarea
            id="intentions"
            value={intentions}
            onChange={(e) => setIntentions(e.target.value)}
            className="input-field min-h-32"
            placeholder="Set your intentions for tomorrow..."
            rows={6}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="btn-primary cursor-pointer flex items-center"
        >
          {isSaving ? (
            <>
              <span className="mr-2">Saving</span>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            'Save Journal Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default JournalForm;