import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register: React.FC = () => (
  <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
    <div className="w-full max-w-sm">
      <RegisterForm />
    </div>
  </div>
);

export default Register;
