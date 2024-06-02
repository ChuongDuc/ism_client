/* eslint-disable no-nested-ternary */
// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, MenuItem, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { fddMMYYYYWithSlash } from '../../../utils/formatTime';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { OrderStatus, Role } from '../../../constant';
import useToggle from '../../../hooks/useToggle';
import CustomerInfoPopup from '../order/list/CustomerInfoPopup';
import { formatStatus } from '../../../utils/getOrderFormat';
import UserListDialog from '../../../components/dialog/UserListDialog';
import useAuth from '../../../hooks/useAuth';
import DeliveryOrderDetailDrawer from '../general/app/DeliveryOrderDetailDrawer';

// ----------------------------------------------------------------------

DeliveryOrderTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  driverViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DeliveryOrderTableRow({ row, idx, onViewRow, onEditRow, driverViewRow, onDeleteRow }) {
  const theme = useTheme();

  const { user } = useAuth();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { toggle: openDriverDialog, onOpen: onOpenDriverDialog, onClose: onCloseDriverDialog } = useToggle();

  const { createdAt, customer, driver, deliveryDate, order } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [chosenDriver, setChosenDriver] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return (
    <>
      <TableRow hover onDoubleClick={handleOpenDetails}>
        <TableCell align="left">{idx + 1}</TableCell>

        <TableCell align="left">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
            noWrap
            onClick={() => {
              onViewRow();
            }}
          >
            {order?.invoiceNo.slice(0, 18)}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ cursor: 'pointer' }}>
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
        </TableCell>

        <TableCell align="left">
          <Stack direction="row">
            <Stack sx={{ my: 'auto' }}>
              {driver?.id ? (
                driver?.fullName
              ) : chosenDriver?.fullName ? (
                chosenDriver?.fullName
              ) : (
                <>
                  {user.role === Role.admin || user.role === Role.transporterManager || user.role === Role.director ? (
                    <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />} onClick={onOpenDriverDialog}>
                      Chọn lái xe
                    </Button>
                  ) : null}
                </>
              )}
            </Stack>

            {driver?.id &&
            (user.role === Role.admin || user.role === Role.transporterManager || user.role === Role.director) ? (
              <Tooltip title="Thay đổi lái xe">
                <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />} onClick={onOpenDriverDialog} />
              </Tooltip>
            ) : null}
          </Stack>
        </TableCell>

        <TableCell align="left">{fddMMYYYYWithSlash(createdAt)}</TableCell>

        <TableCell align="left">{fddMMYYYYWithSlash(deliveryDate)}</TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (formatStatus(order?.status) === OrderStatus.new && 'info') ||
              (formatStatus(order?.status) === OrderStatus.quotationAndDeal && 'info') ||
              (formatStatus(order?.status) === OrderStatus.newDeliverExport && 'success') ||
              (formatStatus(order?.status) === OrderStatus.inProgress && 'info') ||
              (formatStatus(order?.status) === OrderStatus.deliverSuccess && 'info') ||
              (formatStatus(order?.status) === OrderStatus.paid && 'info') ||
              (formatStatus(order?.status) === OrderStatus.confirmByAccProcessing && 'warning') ||
              (formatStatus(order?.status) === OrderStatus.completed && 'success') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {formatStatus(order?.status)}
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
                  disabled={
                    !(
                      (user.role === Role.driver &&
                        formatStatus(order?.status) !== OrderStatus.new &&
                        formatStatus(order?.status) !== OrderStatus.quotationAndDeal) ||
                      (user.role === Role.accountant &&
                        formatStatus(order?.status) !== OrderStatus.new &&
                        formatStatus(order?.status) !== OrderStatus.quotationAndDeal &&
                        formatStatus(order?.status) !== OrderStatus.newDeliverExport &&
                        formatStatus(order?.status) !== OrderStatus.inProgress)
                    )
                  }
                  onClick={() => {
                    onEditRow(row);
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Cập nhật
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleOpenDetails();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'carbon:view'} />
                  Xem chi tiết
                </MenuItem>

                {(user.role === Role.admin || user.role === Role.director || user.role === Role.transporterManager) && (
                  <MenuItem
                    onClick={() => {
                      onOpenDriverDialog();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon={'eva:edit-fill'} />
                    Chọn lái xe
                  </MenuItem>
                )}
                {(user.role === Role.admin || user.role === Role.director || user.role === Role.transporterManager) &&
                  (formatStatus(order?.status) === OrderStatus.new ||
                    formatStatus(order?.status) === OrderStatus.quotationAndDeal ||
                    formatStatus(order?.status) === OrderStatus.newDeliverExport) && (
                    <MenuItem
                      onClick={() => {
                        onDeleteRow();
                        handleCloseMenu();
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
                      Xoá
                    </MenuItem>
                  )}
              </>
            }
          />
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
      <UserListDialog
        open={openDriverDialog}
        deliverOder={row}
        onClose={onCloseDriverDialog}
        selected={(selectedId) => driver?.id === selectedId}
        onSelect={(sale) => setChosenDriver(sale)}
        role={Role.driver}
      />
      <DeliveryOrderDetailDrawer
        onClose={handleCloseDetails}
        open={openDetails}
        item={row}
        driverViewRow={driverViewRow}
      />
    </>
  );
}
