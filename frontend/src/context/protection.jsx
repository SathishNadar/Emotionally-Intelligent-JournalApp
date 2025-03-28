import React from "react";
import { Navigate } from "react-router-dom";
<<<<<<< Updated upstream:frontend/src/context/protection.jsx
import { Auth } from "../../../backend/firebase"; // Import Firebase Auth instance
=======
import { Auth } from "../backend/firebase"; 
>>>>>>> Stashed changes:src/pages/protection.jsx

const ProtectedRoute = ({ children }) => {
  return Auth.currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
