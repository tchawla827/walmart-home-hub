import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const Login: React.FC = () => (
  <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 md:p-8">
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-primary-100 mt-1">Sign in to your account</p>
      </div>
      
      <div className="p-6 md:p-8">
        <LoginForm />
        
        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Login;