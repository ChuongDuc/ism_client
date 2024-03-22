import PropTypes from 'prop-types';
import { Avatar, Dialog, ListItemButton, Stack, Typography } from '@mui/material';
import Scrollbar from '../../../../components/Scrollbar';
import { saleUserList } from '../../../../constant';

// ----------------------------------------------------------------------

SaleListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
};

export default function SaleListDialog({ open, selected, onClose, onSelect }) {
  const handleSelect = (customer) => {
    onSelect(customer);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn nhân viên kinh doanh </Typography>
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {saleUserList.map((sale, index) => (
          <ListItemButton
            key={index}
            selected={selected(sale?.id)}
            onClick={() => handleSelect(sale)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
              <Avatar src={sale?.photoURL} sx={{ width: 60, height: 60 }} />
              <Stack>
                <Typography variant="subtitle2">{sale?.displayName}</Typography>

                <Typography variant="caption" sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}>
                  {sale?.email}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {sale?.phone}
                </Typography>
              </Stack>
            </Stack>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
