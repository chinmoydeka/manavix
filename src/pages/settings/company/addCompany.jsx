import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Avatar,
  CircularProgress,
  Divider,
  Fade
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompanyFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialCompanyData,
  onSnackbarOpen
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    address: '',
    taxId: '',
    phone: '',
    email: '',
    logo: null,
    logoPreview: ''
  });

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialCompanyData) {
        setCompanyFormData({
          name: initialCompanyData.name || '',
          address: initialCompanyData.address || '',
          taxId: initialCompanyData.taxId || '',
          phone: initialCompanyData.phone || '',
          email: initialCompanyData.email || '',
          logo: null,
          logoPreview: initialCompanyData.logo || ''
        });
      } else {
        setCompanyFormData({
          name: '',
          address: '',
          taxId: '',
          phone: '',
          email: '',
          logo: null,
          logoPreview: ''
        });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, initialCompanyData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setCompanyFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLocalSubmit = async () => {
    if (!companyFormData.name || !companyFormData.address) {
      onSnackbarOpen('Company Name and Billing Address are required.', 'warning');
      return;
    }

    setIsFormSubmitting(true);

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (!token) {
        onSnackbarOpen('Authentication token not found. Please log in.', 'error');
        setIsFormSubmitting(false);
        return;
      }

      const apiFormData = new FormData();
      apiFormData.append('company_name', companyFormData.name);
      apiFormData.append('address', companyFormData.address);
      apiFormData.append('gst', companyFormData.taxId);
      apiFormData.append('phone', companyFormData.phone);
      apiFormData.append('email', companyFormData.email);

      if (companyFormData.logo) {
        apiFormData.append('logo', companyFormData.logo);
      } else if (initialCompanyData?.logo && !companyFormData.logoPreview) {
        apiFormData.append('clear_logo', 'true');
      }

      let response;
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      };

      if (initialCompanyData) {
        response = await axios.put(`${API_BASE_URL}/updateCompany/${initialCompanyData.id}`, apiFormData, { headers });
      } else {
        response = await axios.post(`${API_BASE_URL}app/?action=addCompany`, apiFormData, { headers });
      }

      onSubmit(response.data.company, initialCompanyData ? 'edit' : 'add');
      onSnackbarOpen(response.data.message, 'success');
      onClose();

    } catch (error) {
      console.error('Error submitting company:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else {
          errorMessage = `Server Error (${error.response?.status || 'N/A'}): ${error.response?.data?.message || error.message}`;
        }
      } else {
        errorMessage = `Request Error: ${error.message}`;
      }
      onSnackbarOpen(`Error: ${errorMessage}`, 'error');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {initialCompanyData ? 'Edit Company' : 'Add New Company'}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="close dialog">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
              Company Logo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
              {companyFormData.logoPreview ? (
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar
                    src={companyFormData.logoPreview}
                    alt="Company Logo"
                    sx={{ width: 96, height: 96, border: `1px solid ${theme.palette.divider}` }}
                    variant="rounded"
                  />
                  <Tooltip title="Remove Logo">
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: theme.palette.error.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.error.dark
                        }
                      }}
                      onClick={removeLogo}
                      aria-label="remove logo"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Avatar sx={{
                  width: 96,
                  height: 96,
                  bgcolor: theme.palette.grey[100],
                  border: `1px dashed ${theme.palette.grey[400]}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0
                }} variant="rounded">
                  <CloudUpload fontSize="large" color="action" />
                </Avatar>
              )}
              <Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload-input"
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current.click()}
                  sx={{ borderRadius: theme.shape.borderRadius }}
                  component="label"
                  htmlFor="logo-upload-input"
                >
                  Upload Logo
                </Button>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Recommended size: 200x200px (PNG, JPG)
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <TextField
            required
            fullWidth
            label="Company Name"
            name="name"
            value={companyFormData.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            error={isFormSubmitting}
          />
          <TextField
            required
            fullWidth
            multiline
            rows={3}
            label="Billing Address"
            name="address"
            value={companyFormData.address}
            onChange={handleInputChange}
            helperText="This will appear on invoices and receipts"
            variant="outlined"
            size="small"
            error={isFormSubmitting}
          />
          <TextField
            fullWidth
            label="GST (Tax ID)"
            name="taxId"
            value={companyFormData.taxId}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={companyFormData.phone}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={companyFormData.email}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isFormSubmitting}
          sx={{ borderRadius: theme.shape.borderRadius, px: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleLocalSubmit}
          disabled={isFormSubmitting || !companyFormData.name || !companyFormData.address}
          startIcon={isFormSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: theme.shape.borderRadius, px: 2 }}
        >
          {isFormSubmitting ? (initialCompanyData ? 'Updating...' : 'Adding...') : (initialCompanyData ? 'Save Changes' : 'Add Company')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyFormDialog;