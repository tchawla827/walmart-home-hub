import React from 'react';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => (
  <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
);

export default Login;
