import { Grid, InputAdornment, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RHFCheckbox, RHFTextField } from '../../../../../components/hook-form';
import RHFCurrencyField from '../../../../../components/hook-form/RHFCurrencyField';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function AdditionalInfoForm() {
  const { setValue, watch } = useFormContext();
  const values = watch();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Stack direction="column" sx={{ mt: 2, mb: 2 }} spacing={2}>
          <RHFTextField
            size="small"
            name="vat"
            label="Thuế VAT"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
              type: 'number',
            }}
          />

          <RHFTextField
            size="small"
            name="reportingValidity"
            label="Báo giá có hiệu lực"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start">Ngày</InputAdornment>,
              type: 'number',
            }}
          />
          <RHFTextField
            size="small"
            sx={{ mt: 2 }}
            name="pay"
            label="Thanh toán khi đặt hàng"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
              type: 'number',
            }}
          />

          <RHFTextField
            fullWidth
            name="deliverAddress"
            size="small"
            label="Địa chỉ giao hàng"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& fieldset': {
                borderWidth: `1px !important`,
                borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
              },
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack direction="column" sx={{ mb: 2 }} spacing={2}>
          <RHFTextField
            size="small"
            name="shippingTax"
            label="Thuế vận chuyển"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
              type: 'number',
            }}
            sx={{ mt: 2, minWidth: { md: 200 } }}
          />

          <RHFTextField
            size="small"
            name="executionTime"
            label="Ghi chú thời gian thực hiện"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2, minWidth: { md: 200 } }}
          />

          <RHFTextField
            size="small"
            name="deliveryMethod"
            label="Ghi chú phương thức giao hàng"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2, minWidth: { md: 200 } }}
          />
          {(values?.categories.length > 0 || values.products.length > 0) && (
            <Stack direction="row" spacing={2}>
              <RHFCurrencyField
                size="small"
                name="freightPrice"
                label="Tiền vận chuyển"
                disabled={values.isFree}
                value={fVietNamCurrency(values.freightPrice)}
                setValue={setValue}
                InputProps={{
                  endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 250 } }}
              />
              <RHFCheckbox name="isFree" label="Miễn phí" sx={{ minWidth: 105 }} />
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
