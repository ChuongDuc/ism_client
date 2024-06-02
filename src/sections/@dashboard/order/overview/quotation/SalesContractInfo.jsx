import { Card, CardContent, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useAuth from '../../../../../hooks/useAuth';
import { Role } from '../../../../../constant';

// ----------------------------------------------------------------------
SalesContractInfo.propTypes = {
  invoiceNo: PropTypes.string,
  sale: PropTypes.object,
};

export default function SalesContractInfo({ invoiceNo, sale }) {
  const { user } = useAuth();

  return (
    <>
      <Card sx={{ mb: 1, height: '90%' }}>
        <CardContent>
          <Stack spacing={1.1}>
            <Typography variant="body2">Hợp đồng số: {invoiceNo ?? ''}</Typography>
            <Typography variant="body2">
              Kinh doanh: {user.role === Role.sales ? user?.displayName : sale.fullName}
            </Typography>
            <Typography variant="body2">
              Điện thoại: {user.role === Role.sales ? user?.phoneNumber : sale.phoneNumber}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
