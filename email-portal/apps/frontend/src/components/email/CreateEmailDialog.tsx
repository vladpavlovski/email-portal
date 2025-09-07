import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainService } from '../../services/domains';
import { emailService } from '../../services/emails';
import { CreateEmailRequest } from '@email-portal/shared-types';

const schema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .matches(
      /^[a-z0-9._-]+$/,
      'Username can only contain lowercase letters, numbers, dots, hyphens, and underscores'
    )
    .min(1, 'Username must be at least 1 character')
    .max(64, 'Username must be less than 64 characters'),
  domainId: yup.string().required('Please select a domain'),
}).required();

interface CreateEmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (email: string, password: string) => void;
}

const CreateEmailDialog: React.FC<CreateEmailDialogProps> = ({ open, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmailRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      domainId: '',
    },
  });

  const { data: domainsData, isLoading: domainsLoading } = useQuery({
    queryKey: ['domains', 'active'],
    queryFn: () => domainService.getDomains({ limit: 100 }),
    enabled: open,
  });

  const createEmailMutation = useMutation({
    mutationFn: emailService.createEmail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['emailStats'] });
      onSuccess(data.email, data.password);
      handleClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create email account');
    },
  });

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  const onSubmit = (data: CreateEmailRequest) => {
    setError('');
    createEmailMutation.mutate(data);
  };

  const activeDomains = domainsData?.data?.filter(domain => domain.isActive) || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create New Email Account</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Username"
                  placeholder="john.doe"
                  error={!!errors.username}
                  helperText={errors.username?.message || 'The part before @ in the email address'}
                  margin="normal"
                  autoFocus
                />
              )}
            />

            <Controller
              name="domainId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.domainId}>
                  <InputLabel>Domain</InputLabel>
                  <Select
                    {...field}
                    label="Domain"
                    disabled={domainsLoading}
                  >
                    {domainsLoading ? (
                      <MenuItem value="">
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : activeDomains.length === 0 ? (
                      <MenuItem value="" disabled>
                        No domains available
                      </MenuItem>
                    ) : (
                      activeDomains.map((domain) => (
                        <MenuItem key={domain._id} value={domain._id}>
                          @{domain.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <FormHelperText>
                    {errors.domainId?.message || 'Select the domain for your email address'}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {activeDomains.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                A secure password will be automatically generated for this email account.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createEmailMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createEmailMutation.isPending || activeDomains.length === 0}
          >
            {createEmailMutation.isPending ? 'Creating...' : 'Create Email'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateEmailDialog;