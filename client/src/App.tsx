
import { JSX } from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import StatsPage from './pages/StatsPage';
import ProtectedRoute from './utils/ProtectedRoute';
import UnprotectedRoute from './utils/UnprotectedRoute';
import { Box } from '@chakra-ui/react';
import MainPage from './pages/MainPage';
import SessionExpired from './pages/SessionExpired';
import { SessionWatcher } from './components/SessionWatcher';


  const App = (): JSX.Element => {
    const location = useLocation();

    const hideNavbarRoutes = ["/session-expired"];
    const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  
    return (
      <Box height="100%" width="100%" display="flex" flexDirection="column" py={4} px={10}>
        {shouldShowNavbar && <Navbar />}
        <Box flex="1" overflow="auto">
        <SessionWatcher />
        <Routes>
          <Route path="/register" element={<UnprotectedRoute><RegisterPage /></UnprotectedRoute>} />
          <Route path="/login" element={<UnprotectedRoute><LoginPage /></UnprotectedRoute>} />
          <Route path="/session-expired" element={<UnprotectedRoute><SessionExpired /></UnprotectedRoute>} />
          <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        </Routes>
        </Box>
      </Box>
    );
  };

export default App
