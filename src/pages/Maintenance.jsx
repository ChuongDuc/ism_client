import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
import Page from '../components/Page';
import { MaintenanceIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Maintenance() {
  return (
    <Page title="Maintenance" sx={{ height: 1 }}>
      <RootStyle>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Chức năng đang được phát triển
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Chúng tôi đang cố gắng làm việc để hoàn thành chức năng này!
          </Typography>

          <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

          <Button variant="contained" size="large" component={RouterLink} to="/">
            VỀ TRANG CHỦ
          </Button>
        </Container>
      </RootStyle>
    </Page>
  );
}
