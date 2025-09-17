import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("authToken"); // check token
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
