// noinspection JSValidateTypes

import PropTypes from 'prop-types';
import { Button, Dialog, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Scrollbar from '../../../../../components/Scrollbar';
import Iconify from '../../../../../components/Iconify';
import { fddMMYYYYWithSlash } from '../../../../../utils/formatTime';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

OrderOfQuotationListDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  orders: PropTypes.arrayOf(PropTypes.object),
};

export default function OrderOfQuotationListDialog({ open, onClose, orders }) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Danh sách hợp đồng gần đây </Typography>
      </Stack>

      <Scrollbar sx={{ px: 1.5, pt: 0, pb: 3, maxHeight: 80 * 8 }}>
        {orders && orders.length > 0 ? (
          orders.map((order, index) => (
            <Stack key={index} direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
              <Button
                variant="text"
                component={RouterLink}
                to={PATH_DASHBOARD.saleAndMarketing.view(order?.id)}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                {`Mã đơn: ${order?.invoiceNo?.slice(0, 17)}`}
              </Button>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{`Ngày tạo: ${fddMMYYYYWithSlash(
                order?.createdAt
              )}`}</Typography>
            </Stack>
          ))
        ) : (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography variant="subtitle2">Không có hợp đồng nào gần đây</Typography>
          </Stack>
        )}
      </Scrollbar>
    </Dialog>
  );
}
