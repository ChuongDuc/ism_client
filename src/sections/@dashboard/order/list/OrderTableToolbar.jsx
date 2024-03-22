import PropTypes from 'prop-types';
import { InputAdornment, Stack, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

OrderTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  customSearchStr: PropTypes.string,
};

export default function OrderTableToolbar({
  filterStartDate,
  filterEndDate,
  filterName,
  onFilterName,
  onFilterStartDate,
  onFilterEndDate,
  customSearchStr = '',
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 1.2 }}>
      <DatePicker
        label="Ngày bắt đầu"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="Ngày kết thúc"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={customSearchStr !== '' ? customSearchStr : 'Tìm theo khách hàng hoặc đơn hàng...'}
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
