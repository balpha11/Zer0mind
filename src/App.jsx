// src/App.jsx

import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext'; // ✅ import
import { ThemeProvider } from './lib/ThemeContext';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <LoadingProvider>
            <AuthProvider>
              <MaintenanceProvider> {/* ✅ wrap AppRoutes */}
                <TooltipProvider>
                  <Toaster />
                  <AppRoutes />
                </TooltipProvider>
              </MaintenanceProvider>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
