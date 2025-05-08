import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SessionWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("sessionExpired") === "true") {
        localStorage.removeItem("sessionExpired");
        navigate("/session-expired");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};
