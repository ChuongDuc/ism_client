import { styled } from '@mui/material/styles';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import Logo from '../../components/Logo';
import SocialsButton from '../../components/SocialsButton';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Container>
          <Logo sx={{ mb: 1, mx: 'auto', width: 80, height: 36 }} />

          <Typography variant="caption" component="p">
            © Bản quyền
            <br />
            Thuộc về &nbsp;
            <Link href="/">Công ty CP Thép Công Nghiệp HN</Link>
          </Typography>

          <Stack direction="row" justifyContent={{ xs: 'center' }} sx={{ mt: 2, mb: { xs: 5, md: 0 } }}>
            <SocialsButton sx={{ mx: 0.5 }} />
          </Stack>
        </Container>
      </Box>
    </RootStyle>
  );
}
