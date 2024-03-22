/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { fddMMYYYYWithSlash } from '../../../utils/formatTime';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { orderPropTypes, OrderStatus } from '../../../constant';
import useToggle from '../../../hooks/useToggle';
import CustomerInfoPopup from '../order/list/CustomerInfoPopup';
import DriverListDialog from './DriverListDialog';

// ----------------------------------------------------------------------

DeliveryOrderTableRow.propTypes = {
  row: orderPropTypes().isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function DeliveryOrderTableRow({ row, selected, onSelectRow, onViewRow }) {
  const theme = useTheme();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { toggle: openDriverDialog, onOpen: onOpenDriverDialog, onClose: onCloseDriverDialog } = useToggle();

  const { invoiceNumber, createDate, status, customer, deliverOrder, driver } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [chosenDriver, setChosenDriver] = useState(null);

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

        <TableCell align="left">
          <Typography variant="subtitle2" sx={{ cursor: 'pointer' }} noWrap onClick={onViewRow}>
            {invoiceNumber}
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
          {driver?.id ? (
            driver.displayName
          ) : chosenDriver?.displayName ? (
            chosenDriver?.displayName
          ) : (
            <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />} onClick={onOpenDriverDialog}>
              Chọn lái xe
            </Button>
          )}
        </TableCell>

        <TableCell align="left">{fddMMYYYYWithSlash(createDate)}</TableCell>

        <TableCell align="left">
          {deliverOrder?.deliveryDate ? fddMMYYYYWithSlash(deliverOrder?.deliveryDate) : 'Chưa có'}
        </TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (status === OrderStatus.newDeliverExport && 'info') ||
              (status === OrderStatus.inProgress && 'warning') ||
              (status === OrderStatus.deliverSuccess && 'warning') ||
              (status === OrderStatus.paid && 'warning') ||
              (status === OrderStatus.confirmByAccProcessing && 'warning') ||
              (status === OrderStatus.completed && 'success') ||
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

                {!driver?.id && (
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
              </>
            }
          />
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
      <DriverListDialog
        open={openDriverDialog}
        onClose={onCloseDriverDialog}
        selected={(selectedId) => driver?.id === selectedId}
        onSelect={(sale) => setChosenDriver(sale)}
      />
    </>
  );
}
