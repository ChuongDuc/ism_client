// noinspection JSValidateTypes

import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
import Page from '../components/Page';
import { SeverErrorIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <Page title="Lỗi máy chủ nội bộ" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" paragraph>
              500 Lỗi máy chủ nội bộ!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Xảy ra lỗi máy chủ nội bộ. Hãy thử lại hoặc báo cho quản trị viên.
            </Typography>

            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              VỀ TRANG CHỦ
            </Button>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
