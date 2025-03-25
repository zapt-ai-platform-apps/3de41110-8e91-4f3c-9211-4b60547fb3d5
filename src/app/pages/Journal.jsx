import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid, startOfToday } from 'date-fns';
import JournalForm from '../../modules/journal/components/JournalForm';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Layout from '../../shared/components/Layout';

const Journal = () => {
  const { date: dateParam } = useParams();
  const navigate = useNavigate();
  
  // If date param exists and is valid, use it, otherwise use today
  const initialDate = dateParam && isValid(parseISO(dateParam)) 
    ? parseISO(dateParam) 
    : startOfToday();
  
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    if (isValid(date)) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      navigate(`/journal/${formattedDate}`, { replace: true });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Journal Entry</h1>
          
          <div className="bg-white p-2 rounded-md border border-gray-300 shadow-sm">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              maxDate={new Date()}
              className="text-center"
              customInput={
                <button className="font-medium text-gray-700 focus:outline-none cursor-pointer">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </button>
              }
            />
          </div>
        </div>
        
        <div className="card">
          <JournalForm date={selectedDate} />
        </div>
      </div>
    </Layout>
  );
};

export default Journal;