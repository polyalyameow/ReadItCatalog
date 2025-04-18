import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";


const UnprotectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setIsLoggedIn(result);
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) return <div>Loading...</div>;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return children;
};

export default UnprotectedRoute;
