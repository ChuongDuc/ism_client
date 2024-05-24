import { capitalCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CustomerNewEditForm from '../../sections/@dashboard/customer/CustomerNewEditForm';

// ----------------------------------------------------------------------

export default function CustomerCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('cap-nhat');

  return (
    <Page title="Khách hàng mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo khách hàng mới' : 'Cập nhật'}
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Khách hàng', href: PATH_DASHBOARD.customer.list },
            { name: !isEdit ? 'Khách hàng mới' : capitalCase(name) },
          ]}
        />

        <CustomerNewEditForm isEdit={isEdit} currentCustomer={null} />
      </Container>
    </Page>
  );
}
