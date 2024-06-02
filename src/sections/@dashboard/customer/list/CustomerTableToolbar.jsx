import PropTypes from 'prop-types';
import { InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

CustomerTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function CustomerTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, px: 3 }}>
      <TextField
        size="small"
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm khách hàng..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
