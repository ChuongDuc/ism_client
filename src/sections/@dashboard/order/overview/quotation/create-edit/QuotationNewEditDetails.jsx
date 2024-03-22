// noinspection JSCheckFunctionSignatures,JSUnresolvedFunction

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Divider, InputAdornment, Stack, Typography } from '@mui/material';
import { RHFTextField } from '../../../../../../components/hook-form';
import { fVietNamCurrency } from '../../../../../../utils/formatNumber';
import Iconify from '../../../../../../components/Iconify';
import useToggle from '../../../../../../hooks/useToggle';
import ProductsDialog from '../../../../../../components/dialog/ProductsDialog';

// ----------------------------------------------------------------------

export default function QuotationNewEditDetails() {
  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const values = watch();

  const handleAdd = (products) => {
    const reducePrs = products.map((pr) => ({
      id: pr.id,
      name: pr.name,
      price: parseInt((Number(pr.price) * Number(pr.weight)).toString(), 10),
      quantity: 1,
      total: 0,
    }));
    reducePrs.forEach((pr) => {
      const isExisted = values.products.map((p) => p.id).includes(pr.id);
      if (isExisted) {
        // TODO: handle later
        console.log('Do nothing');
      } else {
        append({
          id: pr.id,
          name: pr.name,
          price: pr.price,
          quantity: 1,
          total: 0,
        });
      }
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const cntTotalPrice = () =>
    values.products.reduce(
      (total, data) =>
        data?.price && data?.quantity && Number(data?.price) > 0 && Number(data?.quantity) > 0
          ? total + Number(data?.price) * Number(data?.quantity)
          : total + 0,
      0
    ) + values.freightPrice;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sản phẩm:
        </Typography>

        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <RHFTextField
                  size="small"
                  name={`products[${index}].name`}
                  label="Tên sản phẩm"
                  onChange={() => console.log('Không được sửa')}
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  size="small"
                  name={`products[${index}].price`}
                  label="Giá"
                  value={fVietNamCurrency(values.products[index].price)}
                  onChange={() => console.log('Không được sửa')}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                  sx={{ maxWidth: { md: 250 } }}
                />

                <RHFTextField
                  size="small"
                  type="number"
                  name={`products[${index}].quantity`}
                  label="Số lượng"
                  onChange={(event) => setValue(`products[${index}].quantity`, Number(event.target.value))}
                  sx={{ maxWidth: { md: 96 } }}
                />

                <RHFTextField
                  size="small"
                  name={`products[${index}].total`}
                  label="Tổng"
                  value={fVietNamCurrency(values.products[index].quantity * values.products[index].price)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                  sx={{ maxWidth: { md: 250 } }}
                />
              </Stack>

              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="eva:trash-2-outline" />}
                onClick={() => handleRemove(index)}
              >
                Xóa
              </Button>
            </Stack>
          ))}
          {values.products.length > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFTextField
                fullWidth
                name="freightMessage"
                size="small"
                label="Nội dung phí vận chuyển"
                sx={{
                  '& fieldset': {
                    borderWidth: `1px !important`,
                    borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
                  },
                }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={'freightPrice'}
                label="Tổng"
                value={values.freightPrice}
                onChange={(event) => setValue('freightPrice', Number(event.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  shrink: true,
                }}
                sx={{ maxWidth: { md: 200 } }}
              />
            </Stack>
          )}
        </Stack>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Stack
          spacing={2}
          direction={{ xs: 'column-reverse', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenFrom} sx={{ flexShrink: 0 }}>
            Thêm sản phẩm
          </Button>

          <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
            <Typography variant="h6">Tổng đơn hàng</Typography>
            <Typography variant="h6">{fVietNamCurrency(cntTotalPrice())}</Typography>
          </Stack>
        </Stack>
      </Box>
      <ProductsDialog open={openFrom} onClose={onCloseFrom} onSelect={(products) => handleAdd(products)} />
    </>
  );
}
