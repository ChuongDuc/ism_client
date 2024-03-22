import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Card, Divider, IconButton, MenuItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import cssStyles from '../../../../utils/cssStyles';
import Image from '../../../../components/Image';
import SvgIconStyle from '../../../../components/SvgIconStyle';
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
import { fddMMYYYYWithSlash, getNextNDay } from '../../../../utils/formatTime';
import ZaloAndPhone from '../../../../components/ZaloAndPhone';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 3, opacity: 0.5, color: theme.palette.background.paper }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

CustomerCard.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    totalOrder: PropTypes.number.isRequired,
    nextOrder: PropTypes.number.isRequired,
    company: PropTypes.shape({
      companyName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      companyPhoneNumber: PropTypes.string.isRequired,
    }),
  }),
};

export default function CustomerCard({ customer }) {
  const { name, cover, totalOrder, nextOrder, avatarUrl, company, phoneNumber } = customer;

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}>
        <CustomerCardMoreMenuButton />
      </Box>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="/static/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            // color: !nextOrder || nextOrder === 0 ? 'background.paper' : 'background.neutral',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <OverlayStyle />
        <Image src={cover} alt={cover} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6 }}>
        {name}
      </Typography>

      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {company.companyName}
      </Typography>

      <Stack alignItems="center">
        <ZaloAndPhone
          initialColor
          simple={false}
          sx={{ my: 2.5 }}
          links={{ zalo: 'https://zalo.me/0983.436.161', phoneNumber }}
        />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Trạng thái
          </Typography>
          {!nextOrder || nextOrder === 0 ? (
            <Typography variant="subtitle1">KH cũ</Typography>
          ) : (
            <Typography variant="subtitle1">Đơn mới</Typography>
          )}
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Đơn hàng tiếp theo
          </Typography>
          {!nextOrder || nextOrder === 0 ? (
            <Typography variant="subtitle1">Chưa có</Typography>
          ) : (
            <Typography variant="subtitle1">{fddMMYYYYWithSlash(getNextNDay(3))}</Typography>
          )}
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Tổng số đơn hàng
          </Typography>
          <Typography variant="subtitle1">{totalOrder}</Typography>
        </div>
      </Box>
    </Card>
  );
}

function CustomerCardMoreMenuButton() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" color="inherit" sx={{ opacity: 0.99 }} onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 'auto',
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ color: 'success.main' }}>
          <Iconify icon={'ion:share-social-sharp'} sx={{ ...ICON }} />
          Chia sẻ
        </MenuItem>

        <MenuItem onClick={handleClose} sx={{ color: 'primary.main' }}>
          <Iconify icon={'bxs:file-pdf'} sx={{ ...ICON }} />
          Export thông tin
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
          Chỉnh sửa
        </MenuItem>
      </MenuPopover>
    </>
  );
}
