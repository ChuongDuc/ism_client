import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
  isOrderSale: PropTypes.bool,
};

const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role;
};

export default function RoleBasedGuard({ accessibleRoles, children, isOrderSale = false }) {
  const currentRole = useCurrentRole();

  if (accessibleRoles && !accessibleRoles.includes(currentRole)) {
    return (
      <Container sx={{ paddingTop: 15 }}>
        <Alert severity="error">
          <AlertTitle>Quyền truy cập bị từ chối</AlertTitle>
          Bạn không có quyền truy cập vào chức năng này
        </Alert>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center', paddingTop: 10 }}>
          <Button to="/" size="small" variant="contained" component={RouterLink}>
            VỀ TRANG CHỦ
          </Button>
        </Box>
      </Container>
    );
  }

  if (isOrderSale) {
    return (
      <Container sx={{ paddingTop: 15 }}>
        <Alert severity="error">
          <AlertTitle>Quyền truy cập bị từ chối</AlertTitle>
          Bạn không có quyền truy cập vào đơn hàng này
        </Alert>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center', paddingTop: 10 }}>
          <Button to="/" size="small" variant="contained" component={RouterLink}>
            VỀ TRANG CHỦ
          </Button>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}
