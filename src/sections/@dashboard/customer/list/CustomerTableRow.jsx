import PropTypes from 'prop-types';
import { useState } from 'react';
import { Checkbox, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import useToggle from '../../../../hooks/useToggle';
import UpdateOfCustomerListDialog from './UpdateOfCustomerListDialog';
// ----------------------------------------------------------------------
const DELETE_CUSTOMER = loader('../../../../graphql/mutations/customer/deleteCustomer.graphql');
const LIST_ALL_CUSTOMER = loader('../../../../graphql/queries/customer/listAllCustomer.graphql');
// ----------------------------------------------------------------------

CustomerTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  refetchData: PropTypes.func,
};

export default function CustomerTableRow({ row, onSelectRow, selected, idx, refetchData }) {
  const { enqueueSnackbar } = useSnackbar();

  const { name, company, phoneNumber, address, email, id } = row;
  const [openMenu, setOpenMenuActions] = useState(null);

  const { toggle: openUpdateDialog, onOpen: onOpenUpdateDialog, onClose: onCloseUpdateDialog } = useToggle();

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => {
      enqueueSnackbar('Xóa khách hàng thành công.', {
        variant: 'success',
      });
    },
    onError: (error) => {
      let errMessage = `Xóa khách hàng không thành công: ${error.message ?? error}`;
      if (error.message && error.message.includes('a foreign key constraint fails')) {
        errMessage = 'Không thể xoá khách hàng đã hoặc đang có đơn hàng';
      }
      enqueueSnackbar(`${errMessage}`, {
        variant: 'error',
        autoHideDuration: 15000,
      });
    },
  });

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleDeleteCustomer = async (rowId) => {
    await deleteCustomer({
      variables: {
        input: {
          ids: Number(rowId),
        },
      },
    });
    await refetchData();
  };

  const onRefetchFunc = () => [
    {
      query: LIST_ALL_CUSTOMER,
      variables: {
        input: {},
      },
    },
  ];

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox size="small" checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell align="left">{idx + 1}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell sx={{ alignItems: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle2" noWrap>
              {company || 'Chưa có thông tin'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Typography variant="subtitle2" noWrap>
            {phoneNumber}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {address || 'Chưa có thông tin'}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {email || ''}
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
                    onOpenUpdateDialog();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Chỉnh sửa
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    handleDeleteCustomer(id).catch((e) => {
                      console.error('Lỗi khi thực hiện xóa khách hàng: ', e);
                    });
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

      <UpdateOfCustomerListDialog
        open={openUpdateDialog}
        onClose={onCloseUpdateDialog}
        row={row}
        onRefetchFunc={onRefetchFunc}
        isReload={false}
      />
    </>
  );
}
