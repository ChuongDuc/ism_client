import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Label from '../Label';
import { fddMMYYYYWithSlash } from '../../utils/formatTime';
import { fVietNamCurrency } from '../../utils/formatNumber';
import { TableMoreMenu } from '../table';
import Iconify from '../Iconify';
import Image from '../Image';

// ----------------------------------------------------------------------

ProductDialogTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onAddSingleRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function ProductDialogTableRow({ row, selected, onAddSingleRow, onSelectRow }) {
  const theme = useTheme();

  const { name, cover, createdAt, inventoryType, price } = row;

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
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image disabledEffect alt={name} src={cover} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{fddMMYYYYWithSlash(createdAt)}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(inventoryType === 'Hết hàng' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {inventoryType}
        </Label>
      </TableCell>

      <TableCell align="right">{`${fVietNamCurrency(price)} VNĐ`}</TableCell>

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
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
