// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
import { fData } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Label from '../../../components/Label';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

CustomerNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCustomer: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    totalOrder: PropTypes.number.isRequired,
    nextOrder: PropTypes.number.isRequired,
    company: PropTypes.shape({
      companyName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      companyPhoneNumber: PropTypes.string.isRequired,
    }),
  }),
};

export default function CustomerNewEditForm({ isEdit, currentCustomer }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    phoneNumber: Yup.string().required('Bạn hãy nhập số điện thoại'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCustomer?.name || '',
      phoneNumber: currentCustomer?.phoneNumber || '',
      avatarUrl: currentCustomer?.avatarUrl || '',
      totalOrder: currentCustomer?.totalOrder || 0,
      nextOrder: currentCustomer?.nextOrder || 0,
      company: {
        companyName: currentCustomer?.company?.companyName || '',
        address: currentCustomer?.company?.address || '',
        companyPhoneNumber: currentCustomer?.company?.companyPhoneNumber || '',
      },
    }),
    [currentCustomer]
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentCustomer) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCustomer]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Tạo khách hàng mới thành công!' : 'Cập nhật thành công!');
      navigate(PATH_DASHBOARD.customer.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={31457280}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Định dạng ảnh *.jpeg, *.jpg, *.png
                    <br /> Dung lượng tối đa {fData(31457280)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Họ tên" />
              <RHFTextField name="phoneNumber" label="Số điện thoại" />
              <RHFTextField name="company.companyName" label="Công ty" />
              <RHFTextField name="company.address" label="Địa chỉ công ty" />
              <RHFTextField name="company.companyPhoneNumber" label="Số điện thoại công ty" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Tạo' : 'Lưu'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
