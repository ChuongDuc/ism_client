import { styled } from '@mui/material/styles';
import { Card, CardHeader, Link, Stack, Typography } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { customerPropTypes } from '../../../../constant';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

CustomerAbout.propTypes = {
  customer: customerPropTypes().isRequired,
};

export default function CustomerAbout({ customer }) {
  if (!customer) {
    return null;
  }
  const { company, phoneNumber, name } = customer;

  return (
    <Card>
      <CardHeader title="Thông tin khách hàng" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={'wpf:name'} />
          <Typography variant="body2">
            <Link component="span" variant="h6" color="text.primary">
              {name}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'wpf:iphone'} />
          <Typography variant="body2">{phoneNumber}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Địa chỉ &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {company?.address}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            <Link component="span" variant="subtitle2" color="text.primary">
              {company?.companyName}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
