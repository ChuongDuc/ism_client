import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, Link, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { orderPropTypes, OrderStatus } from '../../../../constant';
import CustomerInfoPopup from './CustomerInfoPopup';
import useToggle from '../../../../hooks/useToggle';

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  row: orderPropTypes().isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function OrderTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { invoiceNumber, createDate, status, customer, totalPrice, deliverOrder } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar
            onClick={() => {
              onOpenCustomerPopup();
            }}
            alt={customer.name}
            color={createAvatar(customer.name).color}
            sx={{ mr: 2 }}
            src={customer?.avatarUrl}
          />

          <Stack>
            <Typography
              variant="subtitle2"
              sx={{ cursor: 'pointer' }}
              noWrap
              onClick={() => {
                onOpenCustomerPopup();
              }}
            >
              {customer.name}
            </Typography>

            <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
              {invoiceNumber}
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="left">{fddMMYYYYWithSlash(createDate)}</TableCell>

        <TableCell align="left">
          {deliverOrder?.deliveryDate ? fddMMYYYYWithSlash(deliverOrder?.deliveryDate) : 'Chưa có'}
        </TableCell>

        <TableCell align="left">{`${fVietNamCurrency(totalPrice)} VNĐ`}</TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (status === OrderStatus.new && 'info') ||
              (status === OrderStatus.quotationAndDeal && 'info') ||
              (status === OrderStatus.newDeliverExport && 'success') ||
              (status === OrderStatus.inProgress && 'info') ||
              (status === OrderStatus.deliverSuccess && 'info') ||
              (status === OrderStatus.unpaid && 'warning') ||
              (status === OrderStatus.paid && 'info') ||
              (status === OrderStatus.confirmByAccProcessing && 'warning') ||
              (status === OrderStatus.completed && 'success') ||
              (status === OrderStatus.overdue && 'error') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    onOpenCustomerPopup();
                  }}
                  sx={{ color: 'info.main' }}
                >
                  <Iconify icon={'mdi:person-badge'} />
                  Khách hàng
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onViewRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:eye-fill'} />
                  Xem chi tiết
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Chỉnh sửa
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Xóa
                </MenuItem>
              </>
            }
          />
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
    </>
  );
}
