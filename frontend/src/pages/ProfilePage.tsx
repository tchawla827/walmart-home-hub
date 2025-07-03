import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/me');
        setUser(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load user');
        if (err.response?.status === 401) {
          setToken(null);
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMe();
    } else {
      navigate('/login');
    }
  }, [token, navigate, setToken]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default ProfilePage;
