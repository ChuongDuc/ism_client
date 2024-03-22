import { styled } from '@mui/material/styles';
import { Box, Button, Stack, Container, Typography, InputAdornment } from '@mui/material';
import useCountdown from '../hooks/useCountdown';
import Page from '../components/Page';
import InputStyle from '../components/InputStyle';
import SocialsButton from '../components/SocialsButton';
import { ComingSoonIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(10),
}));

const CountdownStyle = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, 2.5),
  },
}));

// ----------------------------------------------------------------------

export default function ComingSoon() {
  const countdown = useCountdown(new Date('02/01/2023 21:30'));

  return (
    <Page title="Sắp ra mắt hãy theo dõi" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" paragraph>
              Săp hoàn thành!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Chức năng đang được phát triển và sắp ra mắt trong!
            </Typography>

            <ComingSoonIllustration sx={{ my: 10, height: 240 }} />

            <CountdownStyle>
              <div>
                <Typography variant="h2">{countdown.days}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Ngày</Typography>
              </div>

              <SeparatorStyle variant="h2">:</SeparatorStyle>

              <div>
                <Typography variant="h2">{countdown.hours}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Giờ</Typography>
              </div>

              <SeparatorStyle variant="h2">:</SeparatorStyle>

              <div>
                <Typography variant="h2">{countdown.minutes}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Phút</Typography>
              </div>

              <SeparatorStyle variant="h2">:</SeparatorStyle>

              <div>
                <Typography variant="h2">{countdown.seconds}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Giây</Typography>
              </div>
            </CountdownStyle>

            <InputStyle
              fullWidth
              placeholder="Nhập email của bạn"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" size="large">
                      Nhận thông báo
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ my: 5, '& .MuiOutlinedInput-root': { pr: 0.5 } }}
            />

            <Stack alignItems="center">
              <SocialsButton size="large" initialColor />
            </Stack>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
