import { Link } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";
import { logoutUser } from "../api/auth";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {

  const { token, logout } = useAuth();

  const handleLogout = async () => {
    if (!token) return;
    try {
      await logoutUser(token);
      logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // const handleLogout = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.log("No token was found");
  //     return;
  //   }
  //   try {
  //     const response = await logoutUser(token);
  //     console.log("Logout successful:", response);
  //     localStorage.removeItem("token");
  //     window.location.href = "/login";
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  return (
    <Box display="flex" justifyContent="space-between" pt={8} mb={6}>
      {token &&
      <Link to="/">
        <Button>My Books</Button>
      </Link>}
      <Box>
        {!token &&
        <>
          <Link to="/login">
            <Button mr={2}>Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </>}
        {token &&
        <Button ml={4} onClick={handleLogout}>Logout</Button>}
      </Box>
    </Box>
  );
};

export default Navbar;
