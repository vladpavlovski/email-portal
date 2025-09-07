import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { emailService } from '../services/emails';
import CreateEmailDialog from '../components/email/CreateEmailDialog';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createdEmailInfo, setCreatedEmailInfo] = useState<{ email: string; password: string } | null>(null);

  const { data: emailStats, isLoading: statsLoading } = useQuery({
    queryKey: ['emailStats'],
    queryFn: emailService.getEmailStats,
  });

  const { data: recentEmails, isLoading: emailsLoading } = useQuery({
    queryKey: ['recentEmails'],
    queryFn: () => emailService.getMyEmails({ limit: 5 }),
  });

  const handleEmailCreated = (email: string, password: string) => {
    setCreatedEmailInfo({ email, password });
    setSuccessMessage('Email account created successfully!');
    setCreateDialogOpen(false);
  };

  const handleCloseSuccess = () => {
    setSuccessMessage('');
    setCreatedEmailInfo(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your email accounts and view statistics
        </Typography>
      </Box>

      {!user?.canCreateEmails && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your permission to create email accounts has been revoked. Please contact an administrator.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Emails
                </Typography>
              </Box>
              <Typography variant="h4">
                {statsLoading ? <CircularProgress size={24} /> : emailStats?.totalEmails || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Active Emails
                </Typography>
              </Box>
              <Typography variant="h4">
                {statsLoading ? <CircularProgress size={24} /> : emailStats?.activeEmails || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="info" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Domains Used
                </Typography>
              </Box>
              <Typography variant="h4">
                {statsLoading ? <CircularProgress size={24} /> : emailStats?.emailsByDomain?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                disabled={!user?.canCreateEmails}
                sx={{ height: '100%', minHeight: 80 }}
              >
                Create Email
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Emails */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Email Accounts</Typography>
              <Button variant="text" href="/emails">
                View All
              </Button>
            </Box>
            {emailsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : recentEmails?.data?.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                No email accounts created yet
              </Typography>
            ) : (
              <Box>
                {recentEmails?.data?.map((email) => (
                  <Box
                    key={email._id}
                    sx={{
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Typography variant="subtitle1">{email.fullEmail}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(email.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Create Email Dialog */}
      <CreateEmailDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleEmailCreated}
      />

      {/* Success Snackbar with Email Info */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={null}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
          {createdEmailInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Email: {createdEmailInfo.email}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Password: {createdEmailInfo.password}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Please save these credentials. The password won't be shown again.
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;