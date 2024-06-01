import PropTypes from 'prop-types';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { useCallback, useEffect, useState } from 'react';
import Iconify from '../../../../components/Iconify';
import useAuth from '../../../../hooks/useAuth';
import { getDateRange, Role } from '../../../../constant';
import { ssmDebounce } from '../../../../utils/utilities';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

OrderTableToolbar.propTypes = {
  sales: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
      userName: PropTypes.string,
      email: PropTypes.string,
      avatarURL: PropTypes.string,
      phoneNumber: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    })
  ).isRequired,
  filterName: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  customSearchStr: PropTypes.string,
  filterSales: PropTypes.string.isRequired,
  onFilterSales: PropTypes.func.isRequired,
  handleGetSaleId: PropTypes.func.isRequired,
};

export default function OrderTableToolbar({
  filterStartDate,
  filterEndDate,
  onFilterName,
  onFilterStartDate,
  onFilterEndDate,
  customSearchStr = '',
  sales,
  filterSales,
  onFilterSales,
  handleGetSaleId,
}) {
  const { user } = useAuth();
  const [arrSale, setArrSale] = useState([]);
  const [orderName, setOrderName] = useState('');
  const { startDate, endDate } = getDateRange();

  const handleDebouncedChange = ssmDebounce((value) => {
    onFilterName(value);
  }, 1000);

  useEffect(() => {
    if (sales) {
      const allUser = { id: 0, fullName: 'Tất cả' };
      const newSales = [allUser, ...sales];
      setArrSale(newSales);
    }
  }, [sales]);

  const handleChangeSearchInput = useCallback(
    (event) => {
      const { value } = event.target;
      setOrderName(value);
      handleDebouncedChange(value);
    },
    [handleDebouncedChange]
  );

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 2 }}>
      <DatePicker
        label="Ngày bắt đầu"
        inputFormat="dd/MM/yyyy"
        value={filterStartDate || startDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="Ngày kết thúc"
        inputFormat="dd/MM/yyyy"
        value={filterEndDate || endDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      {user?.role === Role.director && (
        <TextField
          fullWidth
          size="small"
          label="Kinh doanh"
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
      )}

      <TextField
        fullWidth
        size="small"
        value={orderName}
        onChange={handleChangeSearchInput}
        placeholder={
          customSearchStr !== '' ? customSearchStr : 'Tìm đơn hàng theo tên, số đt khách hàng hoặc tên công ty...'
        }
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
