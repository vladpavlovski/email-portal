import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { emailService } from '../services/emails';
import { useAuth } from '../contexts/AuthContext';
import CreateEmailDialog from '../components/email/CreateEmailDialog';

const EmailList: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['myEmails', page + 1, rowsPerPage, search],
    queryFn: () => emailService.getMyEmails({
      page: page + 1,
      limit: rowsPerPage,
      search: search || undefined,
    }),
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleEmailCreated = () => {
    setCreateDialogOpen(false);
    refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatQuota = (quota: number) => {
    if (quota >= 1024) {
      return `${(quota / 1024).toFixed(1)} GB`;
    }
    return `${quota} MB`;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">My Email Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          disabled={!user?.canCreateEmails}
        >
          Create Email
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ mb: 3, display: 'flex', gap: 2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search email accounts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email Address</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Quota</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      {search ? 'No email accounts found matching your search' : 'No email accounts created yet'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((email) => (
                  <TableRow key={email._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{email.fullEmail}</Typography>
                        <Tooltip title={copiedEmail === email.fullEmail ? 'Copied!' : 'Copy email'}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyEmail(email.fullEmail)}
                          >
                            {copiedEmail === email.fullEmail ? (
                              <CheckCircleIcon fontSize="small" color="success" />
                            ) : (
                              <CopyIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {typeof email.domain === 'object' ? email.domain.name : email.domain}
                    </TableCell>
                    <TableCell>{formatQuota(email.quota)}</TableCell>
                    <TableCell>
                      <Chip
                        label={email.status}
                        color={email.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(email.createdAt)}</TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        No actions available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {data && data.total > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <CreateEmailDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleEmailCreated}
      />
    </Box>
  );
};

export default EmailList;