import PropTypes from 'prop-types';
import { InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

CustomerToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  // onDownloadExcel: PropTypes.func,
};

export default function CustomerToolbar({
  filterName,
  onFilterName,
  // onDownloadExcel
}) {
  // const { user } = useAuth();
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ pb: 2.5, px: 0, py: 1, p: 2 }}>
      <TextField
        size="small"
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm theo khách hàng theo tên, số điện thoại..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 18, height: 18 }} />
            </InputAdornment>
          ),
        }}
      />
      {/* {(user?.role === Role.director || user?.role === Role.admin) && ( */}
      {/*  <Button size="small" onClick={onDownloadExcel} variant="contained" sx={{ minWidth: 180 }}> */}
      {/*    <Iconify icon={'material-symbols:download-rounded'} sx={{ width: 18, height: 18 }} /> */}
      {/*    Xuất excel KH */}
      {/*  </Button> */}
      {/* )} */}
    </Stack>
  );
}
