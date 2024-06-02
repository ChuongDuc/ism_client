import { Grid, Stack } from '@mui/material';
import { RHFDatePicker, RHFTextField } from '../../../../../components/hook-form';
import useAuth from '../../../../../hooks/useAuth';
import { Role } from '../../../../../constant';

// ----------------------------------------------------------------------

export default function AdditionalOption() {
  const { user } = useAuth();

  const isDisabled = !!(user.role === Role.driver || user.role === Role.transporterManager);
  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      sx={{ mt: 3, ml: 2 }}
    >
      <Grid container spacing={2}>
        <Grid container item xs={12} md={4} spacing={1}>
          <RHFTextField disabled={isDisabled} size="small" name="receivingNote" label="Hàng đã giao" />
          <RHFTextField disabled={isDisabled} size="small" sx={{ mt: 2 }} name="cranesNote" label="Cẩu hạ hàng" />
        </Grid>

        <Grid container item xs={12} md={4} spacing={1}>
          <RHFTextField disabled={isDisabled} size="small" name="deliveryPayable" label="Cước vận chuyển phải thu" />

          <RHFTextField
            size="small"
            disabled={isDisabled}
            name="documentNote"
            label="Kèm chứng chỉ giấy tờ khách"
            sx={{ mt: 2, minWidth: { md: 200 } }}
          />
        </Grid>

        <Grid container item xs={12} md={4} spacing={1}>
          <RHFTextField
            disabled={isDisabled}
            size="small"
            name="otherNote"
            label="Dặn dò khác"
            sx={{ minWidth: { md: 200 } }}
          />
          <RHFDatePicker
            size="small"
            disabled={isDisabled}
            name="deliveryDate"
            label="Ngày hẹn khách giao"
            // sx={{ maxWidth: 150, my: 0 }}
            sx={{ mt: 3, minWidth: { md: 200 } }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
