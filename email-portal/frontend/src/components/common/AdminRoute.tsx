import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();

  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;