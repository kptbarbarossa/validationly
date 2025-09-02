import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const GoogleSignInButton: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleSignIn}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 shadow-lg"
      >
        <GoogleIcon className="w-6 h-6 mr-3" />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleSignInButton;
