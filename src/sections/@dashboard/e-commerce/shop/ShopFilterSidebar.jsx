import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { NAVBAR } from '../../../../config';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { RHFMultiCheckbox, RHFRadioGroup } from '../../../../components/hook-form';
import { FILTER_QUOTE_OPTIONS } from '../../../../_mock/steel-product';

// ----------------------------------------------------------------------
const STEEL_PRODUCT = ['All', 'Thép hình I', 'Thép hình U', 'Thép hình H', 'Thép tấm nhám', 'Thép Hòa Phát'];

ShopFilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default function ShopFilterSidebar({ isOpen, onResetAll, onOpen, onClose }) {
  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon={'ic:round-filter-list'} />} onClick={onOpen}>
        Lọc tìm kiếm
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Lọc
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Danh mục</Typography>
              <RHFRadioGroup name="category" options={STEEL_PRODUCT} row={false} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Đơn vị tính</Typography>
              <RHFMultiCheckbox name="quote" options={FILTER_QUOTE_OPTIONS} sx={{ width: 1 }} />
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetAll}
            startIcon={<Iconify icon={'ic:round-clear-all'} />}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
