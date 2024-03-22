import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import cssStyles from '../../../../utils/cssStyles';
import Image from '../../../../components/Image';
import Avatar from '../../../../components/Avatar';
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
    top: 0,
    position: 'absolute',
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

PersonInChargeProfile.propTypes = {
  sale: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default function PersonInChargeProfile({ sale }) {
  const { photoURL, displayName } = sale;
  return (
    <RootStyle>
      <InfoStyle>
        <Avatar
          src={photoURL}
          alt={displayName}
          color={photoURL ? 'default' : createAvatar(displayName).color}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        >
          {createAvatar(displayName).name}
        </Avatar>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{`Phụ trách: ${sale?.displayName}`}</Typography>
          <Typography sx={{ opacity: 0.72 }}>Nhân viên kinh doanh</Typography>
        </Box>
      </InfoStyle>
      <Image
        alt="cover"
        src={'/static/mock-images/covers/cover_26.jpg'}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
