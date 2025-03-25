import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../modules/onboarding/hooks/useOnboarding';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import Layout from '../../shared/components/Layout';

// Onboarding questions to guide user reflections
const questions = [
  {
    id: 'journalGoal',
    question: 'Why do you want to start a reflection and intention practice?',
    options: [
      'Self-improvement',
      'Stress management',
      'Achieve specific goals',
      'Increase mindfulness',
      'Track my progress',
      'Other'
    ],
    type: 'select',
    allowOther: true
  },
  {
    id: 'reflectionStyle',
    question: 'How do you prefer to reflect on your day?',
    options: [
      'Free writing/stream of consciousness',
      'Answer specific questions',
      'Focus on gratitude',
      'Problem-solving approach',
      'Focus on emotions',
      'Other'
    ],
    type: 'select',
    allowOther: true
  },
  {
    id: 'preferredTime',
    question: 'When do you prefer to journal?',
    options: [
      'Morning',
      'Afternoon',
      'Evening',
      'Before bed'
    ],
    type: 'select'
  },
  {
    id: 'notificationTime',
    question: 'What time would you like to receive your daily reminder?',
    type: 'time'
  }
];

const Onboarding = () => {
  const { saveOnboardingResponses, isSaving } = useOnboarding();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [otherInput, setOtherInput] = useState('');
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleOptionSelect = (option) => {
    setResponses({
      ...responses,
      [questions[currentQuestion].id]: option === 'Other' ? otherInput : option
    });
    setOtherInput('');
  };
  
  const handleOtherInputChange = (e) => {
    setOtherInput(e.target.value);
  };
  
  const handleTimeChange = (time) => {
    setResponses({
      ...responses,
      [questions[currentQuestion].id]: time
    });
  };
  
  const handleSubmit = async () => {
    if (isSaving) return;
    
    const success = await saveOnboardingResponses(responses);
    if (success) {
      navigate('/dashboard');
    }
  };
  
  const currentQ = questions[currentQuestion];
  const isOtherSelected = responses[currentQ.id] === 'Other' || 
                         (currentQ.options && 
                          !currentQ.options.includes(responses[currentQ.id]) && 
                          responses[currentQ.id]);
  
  const isComplete = currentQ.type === 'time' 
    ? !!responses[currentQ.id]
    : isOtherSelected 
      ? !!otherInput
      : !!responses[currentQ.id];
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Reflections & Intentions</h1>
          <p className="mt-4 text-lg text-gray-600">
            Let's personalize your journaling experience
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>
          
          {currentQ.type === 'select' && (
            <div className="space-y-4">
              {currentQ.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-3 rounded-md border ${
                    responses[currentQ.id] === option 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-300 hover:border-indigo-300'
                  } transition-colors cursor-pointer`}
                >
                  {option}
                </button>
              ))}
              
              {currentQ.allowOther && (
                <div className={`w-full p-3 rounded-md border ${
                  isOtherSelected 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300'
                }`}>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="otherOption"
                      checked={isOtherSelected}
                      onChange={() => handleOptionSelect('Other')}
                      className="mr-2"
                    />
                    <label htmlFor="otherOption" className="cursor-pointer">Other (please specify)</label>
                  </div>
                  
                  {(isOtherSelected || responses[currentQ.id] === 'Other') && (
                    <input
                      type="text"
                      value={otherInput || (isOtherSelected ? responses[currentQ.id] : '')}
                      onChange={handleOtherInputChange}
                      onBlur={() => {
                        if (otherInput) {
                          setResponses({
                            ...responses,
                            [currentQ.id]: otherInput
                          });
                        }
                      }}
                      className="input-field mt-2"
                      placeholder="Please specify"
                    />
                  )}
                </div>
              )}
            </div>
          )}
          
          {currentQ.type === 'time' && (
            <div className="py-4">
              <TimePicker
                onChange={handleTimeChange}
                value={responses[currentQ.id] || ''}
                clearIcon={null}
                disableClock
                format="h:mm a"
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`${
                currentQuestion === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              } btn-secondary`}
            >
              Previous
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={!isComplete || isSaving}
              className={`${
                !isComplete 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              } btn-primary`}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;