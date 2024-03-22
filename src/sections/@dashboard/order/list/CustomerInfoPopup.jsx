import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Avatar, DialogContent, Stack, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';

// ----------------------------------------------------------------------

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(1.5),
}));

// ----------------------------------------------------------------------

CustomerInfoPopup.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    company: PropTypes.shape({
      companyName: PropTypes.string,
      companyPhoneNumber: PropTypes.string,
      address: PropTypes.string,
    }),
  }).isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function CustomerInfoPopup({ customer, isOpen, onClose }) {
  return (
    <DialogAnimate fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogContent sx={{ pb: 5, textAlign: 'center' }}>
        <Avatar
          alt={customer?.name}
          src={customer?.avatarUrl}
          sx={{
            mt: 5,
            mb: 2,
            mx: 'auto',
            width: 96,
            height: 96,
          }}
        />
        <Typography variant="h6">{customer?.name}</Typography>
        <Stack
          direction={'row'}
          onClick={() => {
            window.open(`tel:${customer?.phoneNumber}`);
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Iconify icon="ic:baseline-phone-iphone" sx={{ mr: 0, width: 20, height: 20, color: 'info.main' }} />
          <Typography sx={{ color: 'text.secondary' }} paragraph variant="body2">
            {customer?.phoneNumber}
          </Typography>
        </Stack>

        <RowStyle>
          <Iconify icon="eva:email-fill" sx={{ mr: 1, width: 16, height: 16, color: 'info.main' }} />
          <Typography variant="body2">{customer?.email}</Typography>
        </RowStyle>

        <RowStyle>
          <Iconify icon="mdi:company" sx={{ mr: 1, width: 16, height: 16, color: 'info.main' }} />
          <Typography variant="body2">{customer?.company?.companyName}</Typography>
        </RowStyle>

        <RowStyle>
          <Iconify icon={'eva:pin-fill'} sx={{ mr: 1, width: 16, height: 16, color: 'info.main' }} />
          <Typography variant="body2">{customer?.company?.address}</Typography>
        </RowStyle>
      </DialogContent>
    </DialogAnimate>
  );
}
