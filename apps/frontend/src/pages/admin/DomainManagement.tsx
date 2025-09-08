import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDomainSchema } from '@mailportal/shared';
import { domainApi } from '@/lib/api';
import { z } from 'zod';
import { 
  Globe, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';

type CreateDomainForm = z.infer<typeof createDomainSchema>;

export function DomainManagement() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);

  const { data: domains, isLoading } = useQuery({
    queryKey: ['domains', 'all'],
    queryFn: () => domainApi.getAll(false),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDomainForm>({
    resolver: zodResolver(createDomainSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const createDomainMutation = useMutation({
    mutationFn: domainApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setShowCreateForm(false);
      reset();
    },
  });

  const updateDomainMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      domainApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setEditingDomain(null);
    },
  });

  const deleteDomainMutation = useMutation({
    mutationFn: domainApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });

  const onSubmit = (data: CreateDomainForm) => {
    createDomainMutation.mutate(data);
  };

  const handleToggleStatus = (domain: any) => {
    updateDomainMutation.mutate({
      id: domain.id,
      data: { isActive: !domain.isActive },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this domain? This will also delete all email accounts associated with this domain.')) {
      deleteDomainMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Domain Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage available domains for email creation
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </button>
        </div>
      </div>

      {/* Create Domain Form */}
      {showCreateForm && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Add New Domain</h3>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {createDomainMutation.isError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        {(createDomainMutation.error as any)?.response?.data?.error ||
                          'Failed to create domain'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="name" className="label">
                  Domain Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="mt-1 input"
                  placeholder="example.com"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (available for email creation)
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="btn btn-secondary btn-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDomainMutation.isPending}
                  className="btn btn-primary btn-md"
                >
                  {createDomainMutation.isPending ? 'Creating...' : 'Create Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Domains List */}
      <div className="card">
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : domains && domains.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {domains.map((domain) => (
                  <tr key={domain.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">
                          {domain.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(domain)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          domain.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        } hover:opacity-80 cursor-pointer`}
                      >
                        {domain.isActive ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(domain.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(domain.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No domains</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new domain.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary btn-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}