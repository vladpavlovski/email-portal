import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmailList from './pages/EmailList';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DomainManagement from './pages/admin/DomainManagement';
import Profile from './pages/Profile';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Private routes */}
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="emails" element={<EmailList />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Admin routes */}
                <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="admin/domains" element={<AdminRoute><DomainManagement /></AdminRoute>} />
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;