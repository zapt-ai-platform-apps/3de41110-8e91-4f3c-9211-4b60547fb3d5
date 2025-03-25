import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../../supabaseClient';

const AuthForm = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ 
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#4f46e5',
              brandAccent: '#4338ca',
            },
          },
        },
      }}
      providers={['google', 'facebook', 'apple']}
      magicLink={true}
      view="magic_link"
      redirectTo={window.location.origin}
    />
  );
};

export default AuthForm;