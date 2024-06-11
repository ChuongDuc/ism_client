import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Avatar, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
// import Image from '../../../../components/Image';
import { Role } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

TransportationTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function TransportationTableRow({ row, selected, idx, onEditRow, onSelectRow, onDeleteRow }) {
  const { user } = useAuth();

  const { driver, typeVehicle, weight, licensePlates } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  return (
    <TableRow hover selected={selected}>
      {(user.role === Role.admin || user.role === Role.director || user.role === Role.transporterManager) && (
        <TableCell padding="checkbox">
          <Checkbox size="small" checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      <TableCell align="left">{idx + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={driver?.fullName} src={driver.photoURL} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {driver?.fullName}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {typeVehicle === 'truck' ? 'Xe tải' : 'Xe container'}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {weight} TẤN
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {licensePlates}
      </TableCell>

      {(user.role === Role.admin || user.role === Role.director || user.role === Role.transporterManager) && (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
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
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Sửa thông tin
                </MenuItem>
              </>
            }
          />
        </TableCell>
      )}
    </TableRow>
  );
}
