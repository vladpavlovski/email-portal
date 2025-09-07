import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { EmailAccounts } from './pages/EmailAccounts';
import { CreateEmail } from './pages/CreateEmail';
import { UserManagement } from './pages/admin/UserManagement';
import { DomainManagement } from './pages/admin/DomainManagement';
import { AllEmailAccounts } from './pages/admin/AllEmailAccounts';
import { UserRole } from '@mailportal/shared';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="emails" element={<EmailAccounts />} />
        <Route path="emails/new" element={<CreateEmail />} />

        {/* Admin routes */}
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="admin/domains"
          element={
            <AdminRoute>
              <DomainManagement />
            </AdminRoute>
          }
        />
        <Route
          path="admin/emails"
          element={
            <AdminRoute>
              <AllEmailAccounts />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;