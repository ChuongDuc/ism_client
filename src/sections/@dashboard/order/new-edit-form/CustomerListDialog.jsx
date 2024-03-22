import PropTypes from 'prop-types';
import { Button, Dialog, ListItemButton, Stack, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { _customerList } from '../../../../_mock';

// ----------------------------------------------------------------------

CustomerListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
};

export default function CustomerListDialog({ open, selected, onClose, onSelect }) {
  const handleSelect = (customer) => {
    onSelect(customer);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn khách hàng </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
        >
          Tạo khách hàng mới
        </Button>
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {_customerList.map((customer, index) => (
          <ListItemButton
            key={index}
            selected={selected(customer?.id)}
            onClick={() => handleSelect(customer)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">{customer?.name}</Typography>

            <Typography variant="caption" sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}>
              {customer?.company?.companyName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {customer?.company?.address}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
