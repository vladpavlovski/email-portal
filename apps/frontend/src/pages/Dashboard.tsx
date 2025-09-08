import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { emailAccountApi } from '@/lib/api';
import { Mail, Plus, Users, Globe } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  
  const { data: emailAccounts } = useQuery({
    queryKey: ['my-email-accounts'],
    queryFn: emailAccountApi.getMyAccounts,
  });

  const emailCount = emailAccounts?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your email accounts and create new ones.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Email Accounts
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {emailCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Account Status
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-green-600">
                      Active
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Email Creation
                  </dt>
                  <dd className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${
                      user?.canCreateEmails ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user?.canCreateEmails ? 'Enabled' : 'Disabled'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user?.canCreateEmails && (
              <Link
                to="/emails/new"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <div className="flex-shrink-0">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    Create New Email Account
                  </p>
                  <p className="text-sm text-gray-500">
                    Set up a new email address on available domains
                  </p>
                </div>
              </Link>
            )}

            <Link
              to="/emails"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  View Email Accounts
                </p>
                <p className="text-sm text-gray-500">
                  See all your created email accounts
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Email Accounts */}
      {emailAccounts && emailAccounts.length > 0 && (
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Email Accounts</h2>
            <Link to="/emails" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {emailAccounts.slice(0, 5).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.email}</p>
                    <p className="text-sm text-gray-500">
                      Created {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {account.quota} MB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}