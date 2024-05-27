// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Checkbox, IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import Iconify from '../../../../components/Iconify';
import useAuth from '../../../../hooks/useAuth';
import MenuPopover from '../../../../components/MenuPopover';

// ----------------------------------------------------------------------

PriceListTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PriceListTableRow({ row, selected, idx, onEditRow, onSelectRow }) {
  const { name, weight, code, price, height } = row;

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
        <Checkbox size="small" checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left">
        <Typography variant="caption">{idx + 1}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{name}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{code}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{height}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{weight}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{price}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{fVietNamCurrency(Number(price) * Number(weight))}</Typography>
      </TableCell>

      <TableCell align="right">
        <PriceListTableRowTableMoreMenu
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

PriceListTableRowTableMoreMenu.propTypes = {
  actions: PropTypes.node,
  open: PropTypes.object,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

function PriceListTableRowTableMoreMenu({ actions, open, onClose, onOpen }) {
  return (
    <>
      <IconButton onClick={onOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={12} height={12} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}
