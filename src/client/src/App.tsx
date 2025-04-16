
import { JSX } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import MyBooks from './pages/MyBooks';
import RegisterPage from './pages/RegisterPage';
import StatsPage from './pages/StatsPage';
import ProtectedRoute from './utils/ProtectedRoute';
import UnprotectedRoute from './utils/UnprotectedRoute';
import { Box } from '@chakra-ui/react';


  const App = (): JSX.Element => {
  
    return (
      <Box height="100%" width="100%" display="flex" flexDirection="column" py={4} px={10}>
        <Router>
        <Navbar />
        <Box flex="1" overflow="auto">
        <Routes>
          <Route path="/register" element={<UnprotectedRoute><RegisterPage /></UnprotectedRoute>} />
          <Route path="/login" element={<UnprotectedRoute><LoginPage /></UnprotectedRoute>} />
          <Route path="/" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        </Routes>
        </Box>
      </Router>
      </Box>
    );
  };

export default App
