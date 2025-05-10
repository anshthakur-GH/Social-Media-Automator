import React from 'react';
import Login from '../components/auth/Login';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSocialLogin: (provider: 'google' | 'github') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSocialLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto">
        <Login onLogin={onLogin} onSocialLogin={onSocialLogin} />
      </div>
    </div>
  );
};

export default LoginPage;