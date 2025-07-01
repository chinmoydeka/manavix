import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Fade,
  Container
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import CompanyFormDialog from './addCompany'; // Ensure the path is correct

// Assuming your API base URL is consistently defined
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompanyProfile = () => {
  const theme = useTheme();

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null); // This holds the data for the company being edited

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [companyToDeleteId, setCompanyToDeleteId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Unified state for loading/submitting indicators, similar to CompanyFormDialog
  const [isLoading, setIsLoading] = useState(true); // For initial data fetch
  const [isActionLoading, setIsActionLoading] = useState(false); // For add/edit/delete actions

  const handleSnackbarOpen = useCallback((message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // --- Fetch Companies ---
  // This function now makes an actual API call
  const fetchCompanies = useCallback(async () => {
    setIsLoading(true); // Set loading true when fetching starts
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleSnackbarOpen('Authentication token not found. Please log in.', 'error');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}app/?action=companyDetails`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data', // This header is generally not needed for GET requests
        }
      });
      // Corrected: Set companies directly from response.data, as it's an array.
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      let errorMessage = 'Failed to fetch companies.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else {
          errorMessage = `Server Error (${error.response?.status || 'N/A'}): ${error.response?.data?.message || error.message}`;
        }
      } else {
        errorMessage = `Request Error: ${error.message}`;
      }
      handleSnackbarOpen(`Error: ${errorMessage}`, 'error');
      setCompanies([]); // Ensure companies is an empty array on error to prevent further errors
    } finally {
      setIsLoading(false); // Set loading false when fetching finishes
    }
  }, [handleSnackbarOpen]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenFormDialog = (company = null) => {
    setEditingCompany(company);
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setEditingCompany(null);
  };


  const handleCompanyFormSubmit = (submittedCompany, actionType) => {
    fetchCompanies(); // Re-fetch all companies to ensure the list is up-to-date
  };

  const handleDeleteCompany = async () => {
    setIsActionLoading(true); // Set loading for the delete action
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleSnackbarOpen('Authentication token not found. Please log in.', 'error');
        setIsActionLoading(false);
        return;
      }
      // Assuming your delete endpoint is structured like this:
      // For deletion, your backend might expect the ID in the URL, or as a parameter
      // Double-check your API documentation for the correct delete endpoint and method.
      // Example for a DELETE request with ID in URL:
      await axios.delete(`${API_BASE_URL}app/?action=deleteCompany&id=${companyToDeleteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      handleSnackbarOpen('Company deleted successfully!', 'success');
      fetchCompanies(); // Re-fetch companies to update the list
      handleCloseConfirmDialog();
    } catch (error) {
      console.error('Error deleting company:', error);
      let errorMessage = 'Failed to delete company.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else {
          errorMessage = `Server Error (${error.response?.status || 'N/A'}): ${error.response?.data?.message || error.message}`;
        }
      } else {
        errorMessage = `Request Error: ${error.message}`;
      }
      handleSnackbarOpen(`Error: ${errorMessage}`, 'error');
    } finally {
      setIsActionLoading(false); // Set loading false after action completes
    }
  };

  const handleOpenConfirmDialog = (id) => {
    setCompanyToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setCompanyToDeleteId(null);
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, md: 3 }
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Company Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenFormDialog()}
          sx={{
            borderRadius: theme.shape.borderRadius,
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.2 }
          }}
        >
          Add Company
        </Button>
      </Box>

      <Paper elevation={1} sx={{ p: { xs: 1, md: 2 }, borderRadius: theme.shape.borderRadius, overflowX: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading Companies...</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Logo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tax ID (GST)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No companies found. Click "Add Company" to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>
                      <Avatar
                        src={company.logo || ''} 
                        alt={company.com_name} 
                        sx={{ width: 48, height: 48, border: `1px solid ${theme.palette.divider}` }}
                      />
                    </TableCell>
                    <TableCell>{company.com_name}</TableCell> 
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.gst}</TableCell> 
                    <TableCell>
                      <Box>
                        <Typography variant="body2" color="textPrimary">{company.phone}</Typography>
                        <Typography variant="body2" color="textSecondary">{company.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          sx={{ color: theme.palette.primary.main }}
                          onClick={() => handleOpenFormDialog(company)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{ color: theme.palette.error.main }}
                          onClick={() => handleOpenConfirmDialog(company.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <CompanyFormDialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        onSubmit={handleCompanyFormSubmit} 
        initialCompanyData={editingCompany}
        onSnackbarOpen={handleSnackbarOpen} 
      />

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Confirm Deletion
            </Typography>
            <IconButton onClick={handleCloseConfirmDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete this company? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseConfirmDialog}
            color="inherit"
            disabled={isActionLoading}
            sx={{ borderRadius: theme.shape.borderRadius }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCompany}
            disabled={isActionLoading}
            startIcon={isActionLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: theme.shape.borderRadius }}
          >
            {isActionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Increased duration for better visibility of messages
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: theme.shape.borderRadius }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CompanyProfile;