import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Email as EmailIcon,
  Domain as DomainIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/users';
import { emailService } from '../../services/emails';
import { domainService } from '../../services/domains';

const AdminDashboard: React.FC = () => {
  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: userService.getUserStats,
  });

  const { data: emailStats, isLoading: emailStatsLoading } = useQuery({
    queryKey: ['emailStatsAdmin'],
    queryFn: emailService.getEmailStats,
  });

  const { data: domainStats, isLoading: domainStatsLoading } = useQuery({
    queryKey: ['domainStats'],
    queryFn: domainService.getDomainStats,
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System overview and statistics
      </Typography>

      <Grid container spacing={3}>
        {/* User Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4">
                {userStatsLoading ? <CircularProgress size={24} /> : userStats?.totalUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Active: {userStats?.activeUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="success" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Emails
                </Typography>
              </Box>
              <Typography variant="h4">
                {emailStatsLoading ? <CircularProgress size={24} /> : emailStats?.totalEmails || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Active: {emailStats?.activeEmails || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DomainIcon color="info" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Domains
                </Typography>
              </Box>
              <Typography variant="h4">
                {domainStatsLoading ? <CircularProgress size={24} /> : domainStats?.totalDomains || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Active: {domainStats?.activeDomains || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="warning" sx={{ mr: 2 }} />
                <Typography color="text.secondary" variant="body2">
                  Admin Users
                </Typography>
              </Box>
              <Typography variant="h4">
                {userStatsLoading ? <CircularProgress size={24} /> : userStats?.adminUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Users by Email Creation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Users by Email Creation
            </Typography>
            {userStatsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {userStats?.topUsers?.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                    No data available
                  </Typography>
                ) : (
                  userStats?.topUsers?.map((user: any, index: number) => (
                    <React.Fragment key={user._id}>
                      <ListItem>
                        <ListItemText
                          primary={user.username}
                          secondary={`${user.email} - ${user.emailCount} emails`}
                        />
                      </ListItem>
                      {index < userStats.topUsers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Domain Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Domain Usage
            </Typography>
            {domainStatsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {domainStats?.domainStats?.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                    No domains available
                  </Typography>
                ) : (
                  domainStats?.domainStats?.map((domain: any, index: number) => (
                    <React.Fragment key={domain._id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {domain.name}
                              {domain.isActive ? (
                                <CheckCircleIcon color="success" fontSize="small" />
                              ) : (
                                <CancelIcon color="error" fontSize="small" />
                              )}
                            </Box>
                          }
                          secondary={`${domain.emailCount} email accounts`}
                        />
                      </ListItem>
                      {index < domainStats.domainStats.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;