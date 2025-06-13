import React, { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { useLocation } from 'react-router-dom';

const withPageLoader = (WrappedComponent) => {
  return function WithPageLoaderComponent(props) {
    const { setIsLoading } = useLoading();
    const location = useLocation();

    useEffect(() => {
      // Show loader when component mounts
      setIsLoading(true);

      // Hide loader after a delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // You can adjust this timing

      return () => clearTimeout(timer);
    }, [location.pathname, setIsLoading]); // Re-run when route changes

    return <WrappedComponent {...props} />;
  };
};

export default withPageLoader; 