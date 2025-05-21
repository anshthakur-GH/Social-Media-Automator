import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeProps } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface LoginPageProps extends ThemeProps {
  onLogin: (email: string, password: string) => void;
  onSocialLogin: (provider: 'google' | 'github') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSocialLogin, isDarkMode, onToggleTheme }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/how-to-connect" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              learn how to connect your social media accounts
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Email address"
              type="email"
              name="email"
              required
              fullWidth
              className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              required
              fullWidth
              className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          <div>
            <Button type="submit" fullWidth>
              Sign in
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={onToggleTheme}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => onSocialLogin('google')}
                variant="outline"
                className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                Google
              </Button>
              <Button
                type="button"
                onClick={() => onSocialLogin('github')}
                variant="outline"
                className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                GitHub
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;