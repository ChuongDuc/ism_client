// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { TableCell, TableRow, Typography } from '@mui/material';

// ----------------------------------------------------------------------

InventoryListTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
};

export default function InventoryListTableRow({ row, idx }) {
  const { code, productName, unit, quantity, weight } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography variant="caption">{idx + 1}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption">{code}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{productName}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{unit}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{quantity}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="caption">{weight}</Typography>
      </TableCell>
    </TableRow>
  );
}
