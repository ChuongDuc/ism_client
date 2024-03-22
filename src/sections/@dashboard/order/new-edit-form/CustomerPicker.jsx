import { useFormContext } from 'react-hook-form';
import { Avatar, Button, Divider, Stack, Typography } from '@mui/material';
import useResponsive from '../../../../hooks/useResponsive';
import useToggle from '../../../../hooks/useToggle';
import { _customerList, _invoiceAddressFrom } from '../../../../_mock';
import Iconify from '../../../../components/Iconify';
import CustomerListDialog from './CustomerListDialog';
import { customerPropTypes, salePropTypes } from '../../../../constant';
import SaleListDialog from './SaleListDialog';

// ----------------------------------------------------------------------

export default function CustomerPicker() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();

  const { toggle: openTo, onOpen: onOpenTo, onClose: onCloseTo } = useToggle();

  const { sale, customer } = values;

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={<Divider flexItem orientation={upMd ? 'vertical' : 'horizontal'} sx={{ borderStyle: 'dashed' }} />}
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Khách hàng
          </Typography>

          <Button size="small" startIcon={<Iconify icon="healthicons:i-exam-multiple-choice" />} onClick={onOpenFrom}>
            Chọn
          </Button>

          <CustomerListDialog
            open={openFrom}
            onClose={onCloseFrom}
            selected={(selectedId) => sale?.id === selectedId}
            onSelect={(customer) => setValue('customer', customer)}
            addressOptions={_invoiceAddressFrom}
            customers={_customerList}
          />
        </Stack>

        <CustomerInfo customer={customer} />
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Nhân viên kinh doanh:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={sale ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={onOpenTo}
          >
            {sale ? 'Chọn' : 'Thêm'}
          </Button>

          <SaleListDialog
            open={openTo}
            onClose={onCloseTo}
            selected={(selectedId) => sale?.id === selectedId}
            onSelect={(sale) => setValue('sale', sale)}
          />
        </Stack>

        {sale ? (
          <SaleInfo sale={sale} />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {errors.invoiceTo ? errors.customer.message : null}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

CustomerInfo.propTypes = {
  customer: customerPropTypes(),
};

function CustomerInfo({ customer }) {
  return customer ? (
    <Stack direction="row" spacing={3} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
      <Avatar src={customer?.avatarUrl} sx={{ width: 60, height: 60 }} />
      <Stack>
        <Typography variant="subtitle2">{customer?.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
          {customer?.company?.companyName}
        </Typography>
        <Typography variant="body2">Điện thoại: {customer?.phoneNumber}</Typography>
      </Stack>
    </Stack>
  ) : null;
}

SaleInfo.propTypes = {
  sale: salePropTypes(),
};

function SaleInfo({ sale }) {
  return sale ? (
    <Stack direction="row" spacing={3} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
      <Avatar src={sale?.photoURL} sx={{ width: 60, height: 60 }} />
      <Stack>
        <Typography variant="subtitle2">{sale?.displayName}</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
          {sale?.email}
        </Typography>
        <Typography variant="body2">Điện thoại: {sale?.phone}</Typography>
      </Stack>
    </Stack>
  ) : null;
}
