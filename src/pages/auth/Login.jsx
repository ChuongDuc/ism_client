// noinspection JSValidateTypes,DuplicatedCode

import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {useState} from 'react';
import {  Box, Card, Container, Link, Stack, Typography,Radio,RadioGroup,FormControlLabel,FormControl,FormLabel } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';

import useResponsive from '../../hooks/useResponsive';
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
import { LoginForm } from '../../sections/auth/login';
import { AdminAccount, DirectorAccount,Sale1Account,TransporterManagerAccount,Driver1ManagerAccount} from '../../constant';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const [email,setEmail]= useState(AdminAccount.email);
  const [pass,setPass] = useState(AdminAccount.password);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    switch (e.target.value) {
      case AdminAccount.email:
        setPass(AdminAccount.password);
        break;
      case DirectorAccount.email:
        setPass(DirectorAccount.password);
        break;
      case Sale1Account.email:
        setPass(Sale1Account.password);
        break;
      case Driver1ManagerAccount.email:
        setPass(Driver1ManagerAccount.password);
        break;
      case TransporterManagerAccount.email:
        setPass(TransporterManagerAccount.password);
        break;
      default:
        setPass(AdminAccount.password);
        break;
    }
  }

  return (
    <Page title="Đăng nhập">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Bạn chưa có tài khoản? {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Đăng ký ngay
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Image visibleByDefault disabledEffect alt="login" src="/static/illustrations/security.png" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Đăng nhập hệ thống
                </Typography>
              </Box>
            </Stack>
            <FormControl sx={{ mb: 2 }} >
              <FormLabel >Chọn tài khoản</FormLabel>
              <RadioGroup
                defaultValue={AdminAccount.email}
                onChange={handleChangeEmail}
              >
                <FormControlLabel value={AdminAccount.email} control={<Radio />} label="admin-demo@tcn.com.vn" />
                <FormControlLabel value={DirectorAccount.email} control={<Radio />} label="giamdoc-demo@tcn.com.vn" />
                <FormControlLabel value={Sale1Account.email} control={<Radio />} label="kinhdoanh1-demo@tcn.com.vn" />
                <FormControlLabel value={TransporterManagerAccount.email} control={<Radio />} label="dieuvan-demo@tcn.com.vn" />
                <FormControlLabel value={Driver1ManagerAccount.email} control={<Radio />} label="laixe1-demo@tcn.com.vn" />
              </RadioGroup>
            </FormControl>
            <LoginForm radioEmail={email} radioPass={pass}/>
            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Bạn chưa có tài khoản?{' '}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  Đăng ký ngay
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
