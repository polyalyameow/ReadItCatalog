import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setIsValid(result);
    };
    checkAuth();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>
  };
  if (!isValid) {
    return <Navigate to="/login" replace />
  };

  return children;
};

export default ProtectedRoute;
