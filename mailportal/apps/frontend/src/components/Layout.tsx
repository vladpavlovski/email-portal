import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/contexts/AuthContext';
import { Mail, Users, Globe, LogOut, User, Home } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <Mail className="h-8 w-8 text-primary-600 mr-3" />
            <span className="text-xl font-semibold">MailPortal</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>

            <Link
              to="/emails"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <Mail className="mr-3 h-5 w-5" />
              My Email Accounts
            </Link>

            {isAdmin && (
              <>
                <div className="pt-4">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </p>
                </div>

                <Link
                  to="/admin/users"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  <Users className="mr-3 h-5 w-5" />
                  User Management
                </Link>

                <Link
                  to="/admin/domains"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  <Globe className="mr-3 h-5 w-5" />
                  Domain Management
                </Link>

                <Link
                  to="/admin/emails"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  <Mail className="mr-3 h-5 w-5" />
                  All Email Accounts
                </Link>
              </>
            )}
          </nav>

          {/* User menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}