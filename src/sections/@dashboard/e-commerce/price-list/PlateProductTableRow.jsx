import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
// utils
import { fVietNamCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import useAuth from '../../../../hooks/useAuth';
//

// ----------------------------------------------------------------------

PlateProductTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PlateProductTableRow({ row, idx, selected, onEditRow, onSelectRow }) {
  const { name, weight, price, priceWithVAT, height } = row;

  const { user } = useAuth();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox size={'small'} checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left">{idx + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{height}</TableCell>

      <TableCell>{weight}</TableCell>

      <TableCell align="left">{fVietNamCurrency(priceWithVAT)}</TableCell>

      <TableCell align="left">{fVietNamCurrency(price)}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                disabled={
                  !(
                    user.role === 'Admin' ||
                    user.role === 'Director' ||
                    user.role === 'Manager' ||
                    user.role === 'Accountant' ||
                    user.role === 'Sales'
                  )
                }
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Sửa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
