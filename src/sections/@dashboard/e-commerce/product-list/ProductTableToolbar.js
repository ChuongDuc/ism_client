import PropTypes from 'prop-types';
// @mui
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { DEFAULT_CATEGORY } from '../../../../components/dialog/ProductsDialog';

// ----------------------------------------------------------------------

ProductTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterCategory: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  onFilterCategory: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default function ProductTableToolbar({
  filterName,
  onFilterName,
  categories,
  onFilterCategory,
  filterCategory,
}) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems="center"
      spacing={2}
      justifyContent="flex-start"
      sx={{ py: 1, px: 2 }}
    >
      <FormControl
        sx={{
          width: { xs: 1, md: 240 },
        }}
      >
        <InputLabel sx={{ '&.Mui-focused': { color: 'text.primary' } }}>Danh mục</InputLabel>
        <Select
          size="small"
          value={filterCategory}
          onChange={onFilterCategory}
          input={<OutlinedInput label="Danh mục" />}
        >
          {[DEFAULT_CATEGORY, ...categories].map((option, idx) => (
            <MenuItem
              key={idx}
              value={option}
              sx={{
                p: 0,
                mx: 1,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        sx={{
          width: { xs: 1, md: 240 },
        }}
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
