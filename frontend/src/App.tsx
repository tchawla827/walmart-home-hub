import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/`)
      .then((res) => {
        setBackendMessage(res.data.message);
      })
      .catch((err) => {
        console.error('Backend error:', err);
        setBackendMessage('❌ Failed to connect to Flask backend');
      });
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">
        🚀 SmartPantry + GiftGenius
      </h1>
      <p className="text-lg text-gray-700">{backendMessage || 'Loading...'}</p>
    </div>
  );
}

export default App;
