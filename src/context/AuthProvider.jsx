import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${api}Protected`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching user data', error);
      logOut();
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const res = await axios.post(`${api}Auth/login`, { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setLoggedIn(true);
        fetchUserData();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const signUp = async ({name,email,password,phone,gid}) => {
    try {
      const res = await axios.post(`${api}Auth/register`, {name,email,password,phone,gid});
      if (res.data.token) {
        navigate('/sign-in', { replace: true });
      }
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logOut, signIn, signUp, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
