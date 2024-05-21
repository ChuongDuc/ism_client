// noinspection JSValidateTypes

import PropTypes from 'prop-types';
import { Box, Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
// components
import { Link as RouterLink } from 'react-router-dom';
import Iconify from '../../../../components/Iconify';
import { Role } from '../../../../constant';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

UserTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function UserTableToolbar({ filterName, filterRole, onFilterName, onFilterRole, optionsRole }) {
  const { user } = useAuth();
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 1 }}>
      <TextField
        size={'small'}
        fullWidth
        select
        label="Chức vụ"
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size={'small'}
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm người dùng"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
      {(user?.role === Role.admin || user?.role === Role.director) && (
        <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'left' }, mb: 1, gap: 1.5 }}>
          <Button
            size={'small'}
            variant="contained"
            sx={{ minWidth: '145px' }}
            component={RouterLink}
            to={PATH_DASHBOARD.user.new}
            startIcon={<Iconify icon={'eva:plus-fill'} />}
          >
            Tạo mới
          </Button>
        </Box>
      )}
    </Stack>
  );
}
