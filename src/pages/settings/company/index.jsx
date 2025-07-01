import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Chip,
  Divider
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Close } from '@mui/icons-material';

const CompanyProfile = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Naming Pro Inc.',
      address: '123 Brand Street, San Francisco, CA 94110',
      taxId: 'US123456789',
      phone: '+1 (415) 555-0123',
      email: 'contact@namingpro.com',
      logo: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'BrandWorks LLC',
      address: '456 Creative Ave, New York, NY 10001',
      taxId: 'US987654321',
      phone: '+1 (212) 555-0456',
      email: 'info@brandworks.com',
      logo: 'https://via.placeholder.com/150'
    }
  ]);
  const [newCompany, setNewCompany] = useState({
    name: '',
    address: '',
    taxId: '',
    phone: '',
    email: '',
    logo: null,
    logoPreview: ''
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCompany({
      name: '',
      address: '',
      taxId: '',
      phone: '',
      email: '',
      logo: null,
      logoPreview: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCompany(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setNewCompany(prev => ({
      ...prev,
      logo: null,
      logoPreview: ''
    }));
  };

  const handleAddCompany = async () => {
    if (newCompany.name && newCompany.address) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompanies(prev => [
        ...prev,
        {
          ...newCompany,
          id: Math.max(...prev.map(c => c.id), 0) + 1,
          logo: newCompany.logoPreview || 'https://via.placeholder.com/150'
        }
      ]);
      
      setIsSubmitting(false);
      handleCloseDialog();
    }
  };

  const handleDeleteCompany = (id) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Company Profile</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Add Company
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Tax ID</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Avatar src={company.logo} alt={company.name} sx={{ width: 40, height: 40 }} />
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.taxId}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{company.phone}</Typography>
                    <Typography variant="body2">{company.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      sx={{ color: theme.palette.error.main }}
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add Company Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Company</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Logo Upload Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Company Logo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {newCompany.logoPreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={newCompany.logoPreview}
                      alt="Company Logo"
                      sx={{ width: 80, height: 80 }}
                    />
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
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.grey[200] }}>
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
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload Logo
                  </Button>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Recommended size: 200x200px (PNG, JPG)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Company Details */}
            <TextField
              required
              fullWidth
              label="Company Name"
              name="name"
              value={newCompany.name}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Billing Address"
              name="address"
              value={newCompany.address}
              onChange={handleInputChange}
              helperText="This will appear on invoices and receipts"
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Tax ID/VAT Number"
              name="taxId"
              value={newCompany.taxId}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={newCompany.phone}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={newCompany.email}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCompany}
            disabled={!newCompany.name || !newCompany.address || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Adding...' : 'Add Company'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyProfile;