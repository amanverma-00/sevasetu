// App.tsx (updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

// Page Imports
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Patient Routes
import PatientDashboard from './pages/Patient/Dashboard';
import HealthRecords from './pages/Patient/HealthRecords';
import SymptomChecker from './pages/Patient/SymptomChecker';
import VideoConsultation from './pages/Patient/videoConsultation';

// Doctor Routes
import DoctorDashboard from './pages/doctor/Dashboad';

// Pharmacy Routes
import PharmacyDashboard from './pages/pharmacy/Dashboard';

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Patient Routes */}
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/consultation" element={<VideoConsultation />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/appointments" element={<DoctorDashboard />} />
          <Route path="/patients" element={<DoctorDashboard />} />
          <Route path="/consultations" element={<DoctorDashboard />} />
          
          {/* Pharmacy Routes */}
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          <Route path="/inventory" element={<PharmacyDashboard />} />
          <Route path="/orders" element={<PharmacyDashboard />} />
          <Route path="/pharmacies" element={<PharmacyDashboard />} />
        </Routes>
      </Router>
    </StyledThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

export default App;