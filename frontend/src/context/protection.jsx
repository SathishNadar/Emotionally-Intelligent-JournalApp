import React from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../../../backend/firebase"; // Import Firebase Auth instance

const ProtectedRoute = ({ children }) => {
  return Auth.currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
