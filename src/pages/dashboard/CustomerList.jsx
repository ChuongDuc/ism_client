import { Box, Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { _customerList } from '../../_mock';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { CustomerCard } from '../../sections/@dashboard/customer/list';

// ----------------------------------------------------------------------

export default function CustomerList() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Khách hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Khách hàng', href: PATH_DASHBOARD.customer.root },
            { name: 'Danh sách' },
          ]}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {_customerList.map((user) => (
            <CustomerCard key={user.id} customer={user} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
