import { useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isEdit = pathname.includes('chinh-sua');

  return (
    <Page title="Người dùng: Tạo người dùng mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Tạo người dùng mới'}
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Người dùng', href: PATH_DASHBOARD.user.list },
            { name: 'Tạo người dùng mới' },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={null} />
      </Container>
    </Page>
  );
}
