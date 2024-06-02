import PropTypes from 'prop-types';
import { Avatar, TableCell, TableRow, Typography } from '@mui/material';

// ----------------------------------------------------------------------

CustomerTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  selectRow: PropTypes.func,
};

export default function CustomerTableRow({ row, idx, selected, selectRow }) {
  const { name, avatarURL, phoneNumber, email, company } = row;

  return (
    <TableRow hover selected={selected} onClick={selectRow}>
      <TableCell align="left">{idx + 1}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatarURL} sx={{ mr: 2, width: '28px', height: '28px' }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {phoneNumber}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {email}
      </TableCell>

      <TableCell align="left">{company}</TableCell>
    </TableRow>
  );
}
