// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Checkbox, IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import Iconify from '../../../../components/Iconify';
import useAuth from '../../../../hooks/useAuth';
import MenuPopover from '../../../../components/MenuPopover';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------
const LIST_ALL_INVENTORY = loader('../../../../graphql/queries/inventory/listAllInventory.graphql');
// ----------------------------------------------------------------------

PriceListTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PriceListTableRow({ row, selected, idx, onEditRow, onSelectRow }) {
  const { name, weight, priceWithoutVAT, priceWithVAT, height, shipment } = row;
  console.log(row);

  const { user } = useAuth();

  const [openMenu, setOpenMenuActions] = useState(null);

  const [inventory, setInventory] = useState([]);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { data: allInventory } = useQuery(LIST_ALL_INVENTORY, {
    variables: {
      input: {
        searchQuery: name,
      },
    },
  });

  useEffect(() => {
    if (allInventory) {
      setInventory(allInventory.listAllInventory?.edges.map((edge) => edge.node)[0]);
    }
  }, [allInventory]);

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
        <Typography variant="caption">{height}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{weight}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{fVietNamCurrency(priceWithoutVAT)}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{fVietNamCurrency(Number(priceWithoutVAT) * Number(weight))}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{fVietNamCurrency(priceWithVAT)}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{fVietNamCurrency(Number(priceWithVAT) * Number(weight))}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{inventory ? inventory.quantity : 0}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{shipment?.shimentCode ?? 'Chưa có'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="caption">{fddMMYYYYWithSlash(shipment?.receivedDate)}</Typography>
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
