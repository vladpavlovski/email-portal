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
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/users';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page + 1, rowsPerPage, search],
    queryFn: () => userService.getUsers({
      page: page + 1,
      limit: rowsPerPage,
      search: search || undefined,
    }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteUser(null);
    },
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

  const handleQuickToggle = (user: User, field: 'isActive' | 'canCreateEmails') => {
    updateUserMutation.mutate({
      id: user.id,
      data: { [field]: !user[field] },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ mb: 3, display: 'flex', gap: 2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by username or email..."
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
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Can Create Emails</TableCell>
                <TableCell>Email Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">
                      {search ? 'No users found matching your search' : 'No users found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? 'Admin' : 'User'}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isActive}
                        onChange={() => handleQuickToggle(user, 'isActive')}
                        disabled={user.id === currentUser?.id}
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.canCreateEmails}
                        onChange={() => handleQuickToggle(user, 'canCreateEmails')}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{user.emailCount || 0}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => setEditUser(user)}
                          disabled={user.id === currentUser?.id && user.role === 'admin'}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteUser(user)}
                          disabled={user.id === currentUser?.id}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User: {editUser?.username}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editUser?.role || 'user'}
                onChange={(e) => setEditUser(editUser ? { ...editUser, role: e.target.value as 'user' | 'admin' } : null)}
                disabled={editUser?.id === currentUser?.id}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={editUser?.isActive || false}
                  onChange={(e) => setEditUser(editUser ? { ...editUser, isActive: e.target.checked } : null)}
                  disabled={editUser?.id === currentUser?.id}
                />
              }
              label="Account Active"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editUser?.canCreateEmails || false}
                  onChange={(e) => setEditUser(editUser ? { ...editUser, canCreateEmails: e.target.checked } : null)}
                />
              }
              label="Can Create Email Accounts"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (editUser) {
                updateUserMutation.mutate({
                  id: editUser.id,
                  data: {
                    role: editUser.role,
                    isActive: editUser.isActive,
                    canCreateEmails: editUser.canCreateEmails,
                  },
                });
              }
            }}
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{deleteUser?.username}"?
          </Typography>
          {deleteUser?.emailCount && deleteUser.emailCount > 0 && (
            <Typography color="error" sx={{ mt: 2 }}>
              Warning: This user has created {deleteUser.emailCount} email accounts.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteUser) {
                deleteUserMutation.mutate(deleteUser.id);
              }
            }}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;