import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import axios from "axios";


export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${api}/Protected`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching user data', error);
      logOut();
    }
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
    navigate('/login');
  };

  const checkAdmin = () => {
    if (user?.gid !== 1) {
      navigate('/')
    }else{
      return true
    }
  }
  return (
    <AuthContext.Provider value={{ loggedIn, logOut, user, checkAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;