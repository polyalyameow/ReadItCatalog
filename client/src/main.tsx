import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider } from './utils/AuthContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>
)
