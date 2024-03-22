// noinspection JSUnresolvedVariable

import { memo } from 'react';
import { styled } from '@mui/material/styles';
import { Container, AppBar } from '@mui/material';
import { HEADER } from '../../../config';
import { NavSectionHorizontal } from '../../../components/nav-section';
import navConfig from './NavConfig';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: '100%',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

function NavbarHorizontal() {
  const { user } = useAuth();
  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={navConfig(user)} />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
