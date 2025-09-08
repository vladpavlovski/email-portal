import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { emailAccountApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Plus, Search } from 'lucide-react';

export function EmailAccounts() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: emailAccounts, isLoading } = useQuery({
    queryKey: ['my-email-accounts'],
    queryFn: emailAccountApi.getMyAccounts,
  });

  const filteredAccounts = emailAccounts?.filter((account) =>
    account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Email Accounts</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your email accounts
          </p>
        </div>
        {user?.canCreateEmails && (
          <div className="mt-4 sm:mt-0">
            <Link to="/emails/new" className="btn btn-primary btn-md">
              <Plus className="h-4 w-4 mr-2" />
              Create New Email
            </Link>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-content">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
              placeholder="Search email accounts..."
            />
          </div>
        </div>
      </div>

      {/* Email Accounts List */}
      <div className="card">
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : filteredAccounts && filteredAccounts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">
                          {account.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {account.domain?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{account.quota} MB</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No email accounts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'No email accounts found matching your search.'
                  : 'Get started by creating a new email account.'}
              </p>
              {user?.canCreateEmails && !searchTerm && (
                <div className="mt-6">
                  <Link to="/emails/new" className="btn btn-primary btn-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Email
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}