import PropTypes from 'prop-types';
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import Scrollbar from '../../../../components/Scrollbar';

import Iconify from '../../../../components/Iconify';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import useAuth from '../../../../hooks/useAuth';
import { OrderStatus, Role } from '../../../../constant';
import { formatStatus } from '../../../../utils/getOrderFormat';

DeliveryOrderDetailDrawer.propTypes = {
  open: PropTypes.bool,
  item: PropTypes.object,
  onClose: PropTypes.func,
  driverViewRow: PropTypes.func,
};

export default function DeliveryOrderDetailDrawer({ open, item, onClose, driverViewRow }) {
  const { user } = useAuth();

  const { description, receivingNote, cranesNote, driver, deliveryDate, order, customer } = item;
  const [toggleDelivery, setToggleDelivery] = useState(true);
  const [toggleDriver, setToggleDriver] = useState(true);
  const [toggleSale, setToggleSale] = useState(true);
  const [toggleCustomer, setToggleCustomer] = useState(true);

  const handleToggleDelivery = () => {
    setToggleDelivery(!toggleDelivery);
  };

  const handleToggleDriver = () => {
    setToggleDriver(!toggleDriver);
  };

  const handleToggleSale = () => {
    setToggleSale(!toggleSale);
  };

  const handleToggleCustomer = () => {
    setToggleCustomer(!toggleCustomer);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      BackdropProps={{
        invisible: true,
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> Thông tin vận chuyển </Typography>
        </Stack>

        <Stack spacing={4} justifyContent="center" sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
          <Stack spacing={1}>
            <Panel label="Thông tin xuất hàng" toggle={toggleDelivery} onToggle={handleToggleDelivery} />

            {toggleDelivery && (
              <Stack spacing={1.5}>
                <Row label="Hàng đã giao: " value={receivingNote || ''} />

                <Row label="Mô tả: " value={description || ''} />

                <Row label="Cầu hạ cảng: " value={cranesNote || ''} />

                <Row label="Ngày xuất hàng: " value={deliveryDate ? fddMMYYYYWithSlash(deliveryDate) : ''} />
              </Stack>
            )}
          </Stack>

          <Stack spacing={1}>
            <Panel label="Lái xe" toggle={toggleDriver} onToggle={handleToggleDriver} />

            {toggleDriver && (
              <Stack spacing={1.5}>
                <Row label="Tên lái xe: " value={driver ? driver?.fullName : ''} />

                <Row label="Điện thoại: " value={driver ? driver?.phoneNumber : ''} />
              </Stack>
            )}
          </Stack>

          <Stack spacing={1}>
            <Panel label="Kinh doanh" toggle={toggleSale} onToggle={handleToggleSale} />

            {toggleSale && (
              <Stack spacing={1.5}>
                <Row label="Tên kinh doanh: " value={order ? order?.sale?.fullName : ''} />

                <Row label="Điện thoại: " value={order ? order?.sale?.phoneNumber : ''} />
              </Stack>
            )}
          </Stack>
          <Stack spacing={1}>
            <Panel label="Khách hàng" toggle={toggleCustomer} onToggle={handleToggleCustomer} />

            {toggleCustomer && (
              <Stack spacing={1.5}>
                <Row label="Tên KH: " value={customer ? customer?.name : ''} />

                <Row label="Điện thoại: " value={customer ? customer?.phoneNumber : ''} />

                <Row label="Địa chỉ: " value={customer ? customer?.address : ''} />
              </Stack>
            )}
          </Stack>
        </Stack>
        {((user.role === Role.driver &&
          formatStatus(order?.status) !== OrderStatus.new &&
          formatStatus(order?.status) !== OrderStatus.quotationAndDeal) ||
          (user.role === Role.accountant &&
            formatStatus(order?.status) !== OrderStatus.new &&
            formatStatus(order?.status) !== OrderStatus.quotationAndDeal &&
            formatStatus(order?.status) !== OrderStatus.newDeliverExport &&
            formatStatus(order?.status) !== OrderStatus.inProgress)) && (
          <Stack alignItems="center" justifyContent="center" sx={{ p: 2.5 }}>
            <Button
              size="small"
              color="inherit"
              variant="text"
              onClick={() => {
                driverViewRow(item);
                onClose();
              }}
            >
              Cập nhật đơn hàng
            </Button>
          </Stack>
        )}
      </Scrollbar>
    </Drawer>
  );
}
// ----------------------------------------------------------------------

Panel.propTypes = {
  toggle: PropTypes.bool,
  label: PropTypes.string,
  onToggle: PropTypes.func,
};

function Panel({ label, toggle, onToggle, ...other }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
      <Typography variant="subtitle2"> {label} </Typography>

      <IconButton size="small" onClick={onToggle}>
        <Iconify icon={toggle ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
      </IconButton>
    </Stack>
  );
}

// ----------------------------------------------------------------------

Row.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

function Row({ label, value = '' }) {
  return (
    <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
      <Box component="span" sx={{ width: 100, color: 'text.secondary', mr: 2 }}>
        {label}
      </Box>

      {value}
    </Stack>
  );
}
