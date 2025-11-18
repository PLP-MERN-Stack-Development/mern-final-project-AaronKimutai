import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader"; 

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Verifying access..." />
      </div>
    );
  }

  if (!isSignedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

