import { useState } from 'react';
import { Box, Grid, Typography, Divider, useTheme } from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import CompanyProfile from './company';


const SettingsPage = () => {
  const theme = useTheme();

  const [activeMenu, setActiveMenu] = useState('general');
  const [activeSection, setActiveSection] = useState('app');

  

  const menuItems = {
    app: {
      title: 'App Settings',
      icon: <SettingsIcon />,
      items: [
        { id: 'general', label: 'General', icon: <DashboardIcon /> },
        { id: 'notification', label: 'Notification', icon: <NotificationsIcon /> },
        { id: 'emails', label: 'Emails', icon: <EmailIcon /> },
        { id: 'others', label: 'Others', icon: <SettingsIcon /> }
      ]
    },
    company: {
      title: 'Company Management',
      icon: <BusinessIcon />,
      items: [
        { id: 'profile', label: 'Company Profile' },
        { id: 'team', label: 'Team Members' },
        { id: 'billing', label: 'Billing' }
      ]
    },
    access: {
      title: 'Access & Roles',
      icon: <LockIcon />,
      items: [
        { id: 'roles', label: 'Roles' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'audit', label: 'Audit Log' }
      ]
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'general':
        return <GeneralSettings />;
      case 'notification':
        return <NotificationSettings />;
      case 'emails':
        return <EmailSettings />;
      case 'others':
        return <OtherSettings />;
      case 'profile':
        return <CompanyProfile />;
      case 'team':
        return <TeamManagement />;
      case 'billing':
        return <BillingSettings />;
      case 'roles':
        return <RoleManagement />;
      case 'permissions':
        return <PermissionSettings />;
      case 'audit':
        return <AuditLog />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={1}>
        {/* Left Sidebar - Menu */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
               minHeight: '86vh'
            }}
          >
            {Object.entries(menuItems).map(([key, section]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    color: activeSection === key ? theme.palette.primary.main : 'inherit'
                  }}
                  onClick={() => setActiveSection(key)}
                >
                  {section.icon}
                  {section.title}
                </Typography>
                
                {activeSection === key && (
                  <Box>
                    {section.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 1.5,
                          pl: 3,
                          mb: 0.5,
                          borderRadius: theme.shape.borderRadius,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          backgroundColor: activeMenu === item.id ? theme.palette.action.selected : 'transparent',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                        onClick={() => {
                          setActiveMenu(item.id);
                          setActiveSection(key);
                        }}
                      >
                        {item.icon && item.icon}
                        <Typography variant="body2">{item.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Grid>
        
        {/* Right Content Area */}
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              p: 0,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              minHeight: '86vh'
            }}
          >
            {renderContent()}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Example settings components
const GeneralSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>General Settings</Typography>
    <Typography variant="body1">Configure your naming project preferences and default behaviors.</Typography>
    {/* Add actual form components here */}
  </Box>
);

const NotificationSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Notification Settings</Typography>
    <Typography variant="body1">Manage how you receive alerts about your naming projects.</Typography>
  </Box>
);

const EmailSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Email Settings</Typography>
    <Typography variant="body1">Configure email templates and delivery options.</Typography>
  </Box>
);

const OtherSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Other Settings</Typography>
    <Typography variant="body1">Additional configuration options.</Typography>
  </Box>
);



const TeamManagement = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Team Management</Typography>
    <Typography variant="body1">Add or remove team members from your naming projects.</Typography>
  </Box>
);

const BillingSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Billing Settings</Typography>
    <Typography variant="body1">Manage your subscription and payment methods.</Typography>
  </Box>
);

const RoleManagement = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Role Management</Typography>
    <Typography variant="body1">Define roles for your naming project team.</Typography>
  </Box>
);

const PermissionSettings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Permission Settings</Typography>
    <Typography variant="body1">Configure access levels for different features.</Typography>
  </Box>
);

const AuditLog = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Audit Log</Typography>
    <Typography variant="body1">View all changes made to your naming projects.</Typography>
  </Box>
);

export default SettingsPage;