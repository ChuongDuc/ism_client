import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../../../components/Iconify';

// ----------------------------------------------------------------------
QuotationCustomerInfo.propTypes = {
  handleClick: PropTypes.func,
  customer: PropTypes.object,
  isCreateByDetail: PropTypes.bool,
};

export default function QuotationCustomerInfo({ handleClick, customer, isCreateByDetail }) {
  return (
    <Card sx={{ mb: 1, height: '90%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={1.1}>
            <Typography variant="body2">Tên Khách hàng: {customer?.name}</Typography>
            <Typography variant="body2">Điện thoại: {customer?.phoneNumber}</Typography>
            <Typography variant="body2">Công ty: {customer?.company}</Typography>
            <Typography variant="body2">Địa chỉ: {customer?.address}</Typography>
          </Stack>
          {!isCreateByDetail && (
            <Box>
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={handleClick}
                startIcon={
                  <Iconify icon={customer?.name ? 'icon-park-outline:edit-name' : 'icon-park-outline:customer'} />
                }
                sx={{ height: '20px' }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
