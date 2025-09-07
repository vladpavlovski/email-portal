import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmailSchema } from '@mailportal/shared';
import { domainApi, emailAccountApi } from '@/lib/api';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';

type CreateEmailForm = {
  username: string;
  domainId: string;
};

export function CreateEmail() {
  const navigate = useNavigate();
  const [createdEmail, setCreatedEmail] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { data: domains } = useQuery({
    queryKey: ['domains', 'active'],
    queryFn: () => domainApi.getAll(true),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmailForm>({
    resolver: zodResolver(createEmailSchema),
  });

  const createEmailMutation = useMutation({
    mutationFn: emailAccountApi.create,
    onSuccess: (data) => {
      setCreatedEmail({
        email: data.email,
        password: data.password,
      });
    },
  });

  const onSubmit = (data: CreateEmailForm) => {
    createEmailMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (createdEmail) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-content space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                Email Account Created Successfully!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please save the password below. It will not be shown again.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={createdEmail.email}
                    className="input flex-1"
                  />
                  <button
                    onClick={() => copyToClipboard(createdEmail.email)}
                    className="ml-2 btn btn-secondary btn-sm"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={createdEmail.password}
                    className="input flex-1 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(createdEmail.password)}
                    className="ml-2 btn btn-secondary btn-sm"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Save this password now. For security reasons,
                    it cannot be retrieved later.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('/emails')}
                className="btn btn-primary btn-md"
              >
                View My Email Accounts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="card-header">
          <h1 className="text-xl font-semibold text-gray-900">
            Create New Email Account
          </h1>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {createEmailMutation.isError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">
                      {(createEmailMutation.error as any)?.response?.data?.error ||
                        'Failed to create email account'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                {...register('username')}
                type="text"
                className="mt-1 input"
                placeholder="john.doe"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Only letters, numbers, dots, underscores, and hyphens are allowed.
              </p>
            </div>

            <div>
              <label htmlFor="domainId" className="label">
                Domain
              </label>
              <select {...register('domainId')} className="mt-1 input">
                <option value="">Select a domain</option>
                {domains?.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    @{domain.name}
                  </option>
                ))}
              </select>
              {errors.domainId && (
                <p className="mt-1 text-sm text-red-600">{errors.domainId.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/emails')}
                className="btn btn-secondary btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createEmailMutation.isPending}
                className="btn btn-primary btn-md"
              >
                {createEmailMutation.isPending ? 'Creating...' : 'Create Email Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}