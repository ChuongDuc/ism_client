import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import OrderNewEditForm from '../../sections/@dashboard/order/new-edit-form';

// ----------------------------------------------------------------------

export default function OrderCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Đơn hàng mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo đơn hàng mới"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Đơn hàng', href: PATH_DASHBOARD.saleAndMarketing.list },
            { name: 'Đơn hàng mới' },
          ]}
        />
        <OrderNewEditForm />
      </Container>
    </Page>
  );
}
