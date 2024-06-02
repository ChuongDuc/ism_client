import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import Iconify from '../../../../components/Iconify';
import useAuth from '../../../../hooks/useAuth';
import { Role } from '../../../../constant';
// ----------------------------------------------------------------------

DeliverOrderToolbar.propTypes = {
  sales: PropTypes.any,
  drivers: PropTypes.any,
  filterName: PropTypes.string,
  filterSales: PropTypes.string,
  filterDrivers: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterSales: PropTypes.func,
  onFilterDrivers: PropTypes.func,
  handleGetSaleId: PropTypes.func,
  handleGetDriverId: PropTypes.func,
};

export default function DeliverOrderToolbar({
  handleGetSaleId,
  sales,
  filterName,
  onFilterName,
  filterSales,
  onFilterSales,
  handleGetDriverId,
  onFilterDrivers,
  filterDrivers,
  drivers,
}) {
  const [arrSale, setArrSale] = useState([]);
  const [arrDriver, setArrDriver] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (sales) {
      const allUser = { id: 0, fullName: 'Tất cả' };
      const newSales = [allUser, ...sales];
      setArrSale(newSales);
    }
  }, [sales]);
  useEffect(() => {
    if (drivers) {
      const allUser = { id: 0, fullName: 'Tất cả' };
      const newDrivers = [allUser, ...drivers];
      setArrDriver(newDrivers);
    }
  }, [drivers]);
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2, px: 1 }}>
      <TextField
        fullWidth
        size="small"
        label="NV bán hàng"
        value={filterSales}
        onChange={onFilterSales}
        select
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
        <MenuItem value="Tất cả" defaultValue onClick={() => handleGetSaleId(null)} />
        {arrSale?.map((option) => (
          <MenuItem
            key={option.id}
            value={option.fullName}
            onClick={() => handleGetSaleId(option.id)}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            <>{option.fullName}</>
          </MenuItem>
        ))}
      </TextField>
      {user.role !== Role.driver && user.role !== Role.sales && (
        <TextField
          fullWidth
          size="small"
          label="NV lái xe"
          value={filterDrivers}
          onChange={onFilterDrivers}
          select
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
          <MenuItem value="Tất cả" defaultValue onClick={() => handleGetDriverId(null)} />
          {arrDriver?.map((option) => (
            <MenuItem
              key={option.id}
              value={option.fullName}
              onClick={() => handleGetDriverId(option.id)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              <>{option.fullName}</>
            </MenuItem>
          ))}
        </TextField>
      )}

      <TextField
        fullWidth
        size="small"
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm theo mã đơn hàng, khách hàng, số điện thoại..."
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
