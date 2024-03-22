// noinspection JSValidateTypes

import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
import { PageNotFoundIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="Không tìm thấy trang" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Không tìm thấy trang!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>Hãy kiểm tra lại đường dẫn mà bạn muốn truy cập.</Typography>

            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              VỀ TRANG CHỦ
            </Button>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
