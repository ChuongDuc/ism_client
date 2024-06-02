import PropTypes from 'prop-types';
import { useState } from 'react';
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { fVietNamCurrency } from '../../utils/formatNumber';
import { TableMoreMenu } from '../table';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

ProductDialogTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onAddSingleRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selectRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function ProductDialogTableRow({
  row,
  idx,
  selected,
  onAddSingleRow,
  onSelectRow,
  selectRow,
  onEditRow,
}) {
  const { name, height, weight, priceWithVAT, priceWithoutVAT } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected} onDoubleClick={selectRow}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} size="small" />
      </TableCell>
      <TableCell align="left">{idx + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{height}</TableCell>

      <TableCell>{weight}</TableCell>

      <TableCell align="left">{fVietNamCurrency(priceWithoutVAT)}</TableCell>

      <TableCell align="left">{fVietNamCurrency(Number(priceWithoutVAT) * Number(weight))}</TableCell>

      <TableCell align="left">{fVietNamCurrency(priceWithVAT)} </TableCell>

      <TableCell align="left">{fVietNamCurrency(Number(priceWithVAT) * Number(weight))}</TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onAddSingleRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Thêm SP
              </MenuItem>
              <MenuItem
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
