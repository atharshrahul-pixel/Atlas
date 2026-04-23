import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';

// Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import RoutePlanning from './pages/RoutePlanning';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <div className="h-full">
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/home" element={<Home />} />
                <Route path="/route/plan" element={<RoutePlanning />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="top-center" />
            </div>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;