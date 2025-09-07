import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailAccountApi, userApi, domainApi } from '@/lib/api';
import { Mail, Search, Filter } from 'lucide-react';

export function AllEmailAccounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  const { data: emailAccounts, isLoading } = useQuery({
    queryKey: ['all-email-accounts', userFilter, domainFilter],
    queryFn: () => emailAccountApi.getAll({
      userId: userFilter || undefined,
      domainId: domainFilter || undefined,
    }),
  });

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => userApi.getAll(),
  });

  const { data: domains } = useQuery({
    queryKey: ['domains-list'],
    queryFn: () => domainApi.getAll(false),
  });

  const filteredAccounts = emailAccounts?.filter((account) =>
    account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalAccounts: emailAccounts?.length || 0,
    totalQuota: emailAccounts?.reduce((sum, acc) => sum + acc.quota, 0) || 0,
    uniqueUsers: new Set(emailAccounts?.map(acc => acc.userId)).size,
    uniqueDomains: new Set(emailAccounts?.map(acc => acc.domainId)).size,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">All Email Accounts</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all email accounts across the system
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Total Accounts</dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {stats.totalAccounts}
              </dd>
            </dl>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Total Quota</dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {(stats.totalQuota / 1024).toFixed(1)} GB
              </dd>
            </dl>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Unique Users</dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {stats.uniqueUsers}
              </dd>
            </dl>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Active Domains</dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {stats.uniqueDomains}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Search</label>
              <div className="relative mt-1">
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

            <div>
              <label className="label">User</label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="mt-1 input"
              >
                <option value="">All Users</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Domain</label>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="mt-1 input"
              >
                <option value="">All Domains</option>
                {domains?.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Email Accounts Table */}
      <div className="card">
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : filteredAccounts && filteredAccounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
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
                        <div>
                          <div className="text-sm text-gray-900">
                            {account.user?.firstName} {account.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.user?.email}
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
            </div>
          ) : (
            <div className="p-6 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No email accounts found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || userFilter || domainFilter
                  ? 'Try adjusting your search or filter criteria'
                  : 'No email accounts have been created yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}