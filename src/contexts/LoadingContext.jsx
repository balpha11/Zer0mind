import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/ui/preloader';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}; 