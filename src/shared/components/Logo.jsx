import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=40&height=40" 
        alt="Reflections & Intentions Logo" 
        className="h-10 w-10 mr-2"
      />
      <span className="text-xl font-bold text-indigo-600">Reflections & Intentions</span>
    </Link>
  );
};

export default Logo;