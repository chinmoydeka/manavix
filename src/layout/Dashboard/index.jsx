import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import RequireAuth from '../../components/RequireAuth';

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  // Handle drawer open based on screen size
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <RequireAuth>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header />
        <Drawer />

        <Box
          component="main"
          sx={{
            width: { xs: '100%', xl: 'calc(100% - 260px)' },
            flexGrow: 1,
            p: { xs: 1, sm: 1, md: 2 }, // reduced padding for mobile
            mt: { xs: '56px', sm: '0px' } // add top margin on mobile to prevent header overlap
          }}
        >
          {/* Toolbar spacer for larger screens */}
          <Toolbar sx={{ display: { xs: 'none', sm: 'block' } }} />

          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'calc(100vh - 100px)', // adjusted for Footer
              px: { xs: 0, sm: 1 },
              pb: { xs: 6, sm: 4 }
            }}
          >
            <Outlet />
            <Footer />
          </Box>
        </Box>

      </Box>
    </RequireAuth>
  );
}
