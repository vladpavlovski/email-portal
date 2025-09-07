import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { UpdatePasswordRequest } from '../types';

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

interface PasswordFormData extends UpdatePasswordRequest {
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setPasswordError('');
      setPasswordSuccess('');
      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess('Password updated successfully!');
      reset();
      await refreshUser();
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Username
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user?.username}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user?.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Chip
                label={user?.role === 'admin' ? 'Administrator' : 'User'}
                color={user?.role === 'admin' ? 'primary' : 'default'}
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                Account Status
              </Typography>
              <Chip
                label={user?.isActive ? 'Active' : 'Inactive'}
                color={user?.isActive ? 'success' : 'error'}
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                Email Creation Permission
              </Typography>
              <Chip
                label={user?.canCreateEmails ? 'Allowed' : 'Denied'}
                color={user?.canCreateEmails ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>

            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordSuccess}
              </Alert>
            )}

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onPasswordSubmit)}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                margin="normal"
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                margin="normal"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;