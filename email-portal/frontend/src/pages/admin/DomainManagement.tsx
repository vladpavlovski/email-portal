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
  TextField,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainService } from '../../services/domains';
import { Domain, CreateDomainRequest } from '../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const createDomainSchema = yup.object({
  name: yup
    .string()
    .required('Domain name is required')
    .matches(
      /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}$/,
      'Please provide a valid domain name (e.g., example.com)'
    ),
  description: yup.string().max(200, 'Description must be less than 200 characters'),
}).required();

const DomainManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDomain, setEditDomain] = useState<Domain | null>(null);
  const [deleteDomain, setDeleteDomain] = useState<Domain | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDomainRequest>({
    resolver: yupResolver(createDomainSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['domains', page + 1, rowsPerPage],
    queryFn: () => domainService.getDomains({
      page: page + 1,
      limit: rowsPerPage,
    }),
  });

  const createDomainMutation = useMutation({
    mutationFn: domainService.createDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setCreateDialogOpen(false);
      reset();
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create domain');
    },
  });

  const updateDomainMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Domain> }) => 
      domainService.updateDomain(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setEditDomain(null);
    },
  });

  const deleteDomainMutation = useMutation({
    mutationFn: domainService.deleteDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setDeleteDomain(null);
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleQuickToggle = (domain: Domain) => {
    updateDomainMutation.mutate({
      id: domain._id,
      data: { isActive: !domain.isActive },
    });
  };

  const onCreateSubmit = (data: CreateDomainRequest) => {
    setError('');
    createDomainMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Domain Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Domain
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Domain Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
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
                      No domains configured yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((domain) => (
                  <TableRow key={domain._id}>
                    <TableCell>
                      <Typography variant="body1">{domain.name}</Typography>
                    </TableCell>
                    <TableCell>{domain.description || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          checked={domain.isActive}
                          onChange={() => handleQuickToggle(domain)}
                          color="success"
                        />
                        <Chip
                          label={domain.isActive ? 'Active' : 'Inactive'}
                          color={domain.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {typeof domain.createdBy === 'object' 
                        ? domain.createdBy.username 
                        : 'System'}
                    </TableCell>
                    <TableCell>{formatDate(domain.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => setEditDomain(domain)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDomain(domain)}
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

      {/* Create Domain Dialog */}
      <Dialog open={createDialogOpen} onClose={() => {
        setCreateDialogOpen(false);
        reset();
        setError('');
      }} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onCreateSubmit)}>
          <DialogTitle>Add New Domain</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Domain Name"
                placeholder="example.com"
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name')}
              />
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={2}
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register('description')}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setCreateDialogOpen(false);
              reset();
              setError('');
            }}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createDomainMutation.isPending}
            >
              {createDomainMutation.isPending ? 'Creating...' : 'Create Domain'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Domain Dialog */}
      <Dialog open={!!editDomain} onClose={() => setEditDomain(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Domain: {editDomain?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              margin="normal"
              value={editDomain?.description || ''}
              onChange={(e) => setEditDomain(editDomain ? { ...editDomain, description: e.target.value } : null)}
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Switch
                checked={editDomain?.isActive || false}
                onChange={(e) => setEditDomain(editDomain ? { ...editDomain, isActive: e.target.checked } : null)}
              />
              <Typography>Domain Active</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDomain(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (editDomain) {
                updateDomainMutation.mutate({
                  id: editDomain._id,
                  data: {
                    description: editDomain.description,
                    isActive: editDomain.isActive,
                  },
                });
              }
            }}
            disabled={updateDomainMutation.isPending}
          >
            {updateDomainMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDomain} onClose={() => setDeleteDomain(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the domain "{deleteDomain?.name}"?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. Any email accounts associated with this domain will be affected.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDomain(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteDomain) {
                deleteDomainMutation.mutate(deleteDomain._id);
              }
            }}
            disabled={deleteDomainMutation.isPending}
          >
            {deleteDomainMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DomainManagement;