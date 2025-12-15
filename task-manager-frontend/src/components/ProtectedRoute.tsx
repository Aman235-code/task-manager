/* eslint-disable react-hooks/set-state-in-effect */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait until the user from localStorage is loaded
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    // You can show a loader here
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return children;
}
