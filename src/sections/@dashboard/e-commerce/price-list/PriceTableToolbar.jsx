import PropTypes from 'prop-types';
import { InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

PriceTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function PriceTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 1.5, px: 1.5 }}>
      <TextField
        fullWidth
        size="small"
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm thép"
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
