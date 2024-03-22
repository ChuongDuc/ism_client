import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _orders } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/order/new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceEdit() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const currentInvoice = _orders.find((invoice) => invoice.id === id);

  return (
    <Page title="Invoices: Edit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit invoice"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Invoices', href: PATH_DASHBOARD.saleAndMarketing.list },
            { name: currentInvoice?.invoiceNumber || '' },
          ]}
        />

        <InvoiceNewEditForm isEdit currentOrder={currentInvoice} />
      </Container>
    </Page>
  );
}
