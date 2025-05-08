import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider } from './utils/AuthContext';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
