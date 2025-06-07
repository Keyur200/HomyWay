import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

const HostRoute = ({ children }) => {
  const { user, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn || !user) return;
    if (user.gid !== 2) {
      navigate('/');
    }
  }, [user, loggedIn, navigate]);

  if (!loggedIn || !user) {
    return <div>Loading...</div>; 
  }

  return user.gid === 1 ? children : null;
};

export default HostRoute;
