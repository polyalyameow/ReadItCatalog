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
      console.error("Utloggning misslyckades:", error);
    }
  };


  return (
    <Box display="flex" justifyContent="space-between" pt={8} mb={6}>
      {token && 
      <Link to="/">
        <Button>Mina sidor</Button>
      </Link>}
      <Box>
        {!token &&
        <>
          <Link to="/login">
            <Button mr={2}>Logga in</Button>
          </Link>
          <Link to="/register">
            <Button>Registrera</Button>
          </Link>
        </>}
        {token &&
        <Button ml={4} onClick={handleLogout}>Logga ut</Button>}
      </Box>
    </Box>
  );
};

export default Navbar;
