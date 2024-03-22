import { styled } from '@mui/material/styles';
import { Card, CardHeader, Link, Stack, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { driverPropTypes } from '../../../../constant';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

DriverAbout.propTypes = {
  driver: driverPropTypes(),
};

export default function DriverAbout({ driver }) {
  if (!driver) {
    return (
      <Card sx={{ pt: 3, px: 5, minHeight: 242 }}>
        <Typography variant="h6">Chưa có thông tin lái xe</Typography>
      </Card>
    );
  }
  const { displayName, phone } = driver;

  return (
    <Card sx={{ minHeight: 242 }}>
      <CardHeader title="Thông tin lái xe" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={'healthicons:truck-driver'} />
          <Typography variant="body2">
            <Link component="span" variant="h6" color="text.primary">
              {displayName}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'wpf:iphone'} />
          <Typography variant="body2">{phone}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
