import PropTypes from 'prop-types';
import { Avatar, Dialog, ListItemButton, Stack, Typography } from '@mui/material';
import Scrollbar from '../../../components/Scrollbar';
import { onlyDriverUserList } from '../../../constant';

// ----------------------------------------------------------------------

DriverListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
};

export default function DriverListDialog({ open, selected, onClose, onSelect }) {
  const handleSelect = (driver) => {
    onSelect(driver);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn lái xe </Typography>
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {onlyDriverUserList.map((driver, index) => (
          <ListItemButton
            key={index}
            selected={selected(driver?.id)}
            onClick={() => handleSelect(driver)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
              <Avatar src={driver?.photoURL} sx={{ width: 60, height: 60 }} />
              <Stack>
                <Typography variant="subtitle2">{driver?.displayName}</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {driver?.phone}
                </Typography>
              </Stack>
            </Stack>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}
