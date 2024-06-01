// noinspection JSUnusedLocalSymbols

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Link, MenuItem, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { fDateTimeVer2 } from '../../../../utils/formatTime';
import { convertStringToNumber, fVietNamCurrency } from '../../../../utils/formatNumber';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { OrderStatus, Role } from '../../../../constant';
import CustomerInfoPopup from './CustomerInfoPopup';
import useToggle from '../../../../hooks/useToggle';
import { formatStatus } from '../../../../utils/getOrderFormat';
import useAuth from '../../../../hooks/useAuth';
import TextMaxLine from '../../../../components/TextMaxLine';

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function OrderTableRow({ row, selected, idx, onViewRow, onDeleteRow }) {
  const theme = useTheme();
  const { user } = useAuth();

  const { toggle: isOpenCustomerPopup, onOpen: onOpenCustomerPopup, onClose: onCloseCustomerPopup } = useToggle();

  const { invoiceNo, createdAt, status, customer, totalMoney, VAT, freightPrice } = row;

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
        <TableCell align="left">{idx + 1}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Stack spacing={0.2}>
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
              {invoiceNo?.slice(0, 17)}
            </Link>
          </Stack>
        </TableCell>

        <Tooltip placement="top" title={customer?.company ?? 'Chưa có thông tin cty'}>
          <TableCell align="left">
            <TextMaxLine variant={'subtitle2'} line={1} persistent>
              {customer?.company ?? '-'}
            </TextMaxLine>
          </TableCell>
        </Tooltip>

        <TableCell align="left">{`${fVietNamCurrency(
          Math.round(Number(totalMoney)) +
            Number(convertStringToNumber(freightPrice)) +
            Math.round(Number((totalMoney * VAT) / 100))
        )} Đ`}</TableCell>

        <TableCell align="left">{`${fVietNamCurrency(
          Math.round(Number(totalMoney)) +
            Number(convertStringToNumber(freightPrice)) +
            Math.round(Number((totalMoney * VAT) / 100))
        )} Đ`}</TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (formatStatus(status) === OrderStatus.new && 'info') ||
              (formatStatus(status) === OrderStatus.quotationAndDeal && 'info') ||
              (formatStatus(status) === OrderStatus.newDeliverExport && 'success') ||
              (formatStatus(status) === OrderStatus.inProgress && 'info') ||
              (formatStatus(status) === OrderStatus.deliverSuccess && 'info') ||
              (formatStatus(status) === OrderStatus.paid && 'info') ||
              (formatStatus(status) === OrderStatus.confirmByAccProcessing && 'warning') ||
              (formatStatus(status) === OrderStatus.completed && 'success') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {formatStatus(status)}
          </Label>
        </TableCell>

        <TableCell align="left">{createdAt ? fDateTimeVer2(createdAt) : '-'}</TableCell>

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
                {(user.role === Role.admin || user.role === Role.director) && (
                  <>
                    <MenuItem
                      onClick={() => {
                        onDeleteRow();
                        handleCloseMenu();
                      }}
                      sx={{ color: 'error.main' }}
                      disabled={formatStatus(status) === OrderStatus.completed}
                    >
                      <Iconify icon={'eva:trash-2-outline'} />
                      Xóa đơn hàng
                    </MenuItem>
                  </>
                )}
              </>
            }
          />
        </TableCell>
      </TableRow>
      <CustomerInfoPopup isOpen={isOpenCustomerPopup} onClose={onCloseCustomerPopup} customer={customer} />
    </>
  );
}
