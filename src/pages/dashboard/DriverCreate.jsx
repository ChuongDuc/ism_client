import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { users } from '../../_apis_/account';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import DriverNewEditForm from '../../sections/@dashboard/driver/DriverNewEditForm';

// ----------------------------------------------------------------------

export default function DriverCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('cap-nhat');

  const currentDriver = id ? users.find((user) => paramCase(user.id) === id) : null;

  return (
    <Page title="Lái-phụ xe: Tạo lái-phụ xe mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo lái-phụ xe mới' : 'Sửa thông tin lái-phụ xe'}
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Danh sách lái-phụ xe', href: PATH_DASHBOARD.driver.list },
            { name: !isEdit ? 'Tạo lái-phụ xe mới' : capitalCase(currentDriver.displayName) },
          ]}
        />

        <DriverNewEditForm isEdit={isEdit} currentDriver={currentDriver} />
      </Container>
    </Page>
  );
}
