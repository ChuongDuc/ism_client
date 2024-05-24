// noinspection JSValidateTypes,RegExpDuplicateCharacterInClass,DuplicatedCode

import PropTypes from 'prop-types';
import { Card, Container, Dialog, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import CommonBackdrop from '../../../../components/CommonBackdrop';

// ----------------------------------------------------------------------
const UPDATE_CUSTOMER = loader('../../../../graphql/mutations/customer/updateCustomer.graphql');
const LIST_ALL_CUSTOMER = loader('../../../../graphql/queries/customer/listAllCustomer.graphql');
// ----------------------------------------------------------------------
UpdateOfCustomerListDialog.propTypes = {
  row: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRefetchFunc: PropTypes.func,
  isReload: PropTypes.bool,
};

export default function UpdateOfCustomerListDialog({ open, onClose, row, onRefetchFunc, isReload }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [updateBtnEnable, setUpdateBtnEnable] = useState(false);

  const updateCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(10, 'Số điện thoại chỉ có tối đa 10 số'),
  });

  const defaultValues = useMemo(
    () => ({
      id: row?.id,
      name: row?.name || '',
      phoneNumber: row?.phoneNumber || '',
      address: row?.address || '',
      email: row?.email || '',
      company: row?.company,
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(updateCustomerSchema),
    defaultValues,
  });

  const [updateCustomerFn] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: () => [
      {
        query: LIST_ALL_CUSTOMER,
        variables: {
          input: {},
        },
      },
    ],
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (row) {
      reset(defaultValues);
    }
  }, [reset, row, defaultValues]);
  const onSubmit = async () => {
    try {
      await updateCustomerFn({
        variables: {
          input: {
            id: values.id,
            address: values?.address,
            name: row?.name && values?.name && row?.name === values?.name ? null : values?.name,
            email: row?.email && values?.email && row?.email === values?.email ? null : values?.email,
            phoneNumber:
              row?.phoneNumber && values?.phoneNumber && row?.phoneNumber === values?.phoneNumber
                ? null
                : values?.phoneNumber,
            company: values?.company,
          },
        },
        refetchQueries: onRefetchFunc || [],
      });
      onClose();
      if (!isReload) {
        enqueueSnackbar('Cập nhật thành công!');
        navigate(PATH_DASHBOARD.customer.list);
      } else if (!onRefetchFunc) {
        enqueueSnackbar('Cập nhật thành công!. Tải lại trang cập nhật thông tin báo giá sau 3s nữa...');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      enqueueSnackbar(`Sửa khách hàng không thành công: ${error.message ?? error}`, {
        variant: 'error',
        autoHideDuration: 10000,
      });
    }
  };
  const handleCancel = () => {
    methods.reset();
    onClose();
  };
  useMemo(() => {
    if (
      (row?.name && values?.name && row?.name === values?.name ? null : values?.name) ||
      (row?.email && values?.email && row?.email === values?.email ? null : values?.email) ||
      (row?.phoneNumber && values?.phoneNumber && row?.phoneNumber === values?.phoneNumber
        ? null
        : values?.phoneNumber) ||
      (row?.company === values?.company ? null : values?.company) ||
      (row?.address === values?.address ? null : values?.address)
    ) {
      setUpdateBtnEnable(true);
    } else {
      setUpdateBtnEnable(false);
    }
  }, [
    row?.name,
    row?.email,
    row?.phoneNumber,
    row?.company,
    row?.address,
    values?.name,
    values?.email,
    values?.phoneNumber,
    values?.company,
    values?.address,
  ]);
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth={false} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
            {'Cập nhật khách hàng'}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 3 }}>
                <RHFTextField name="name" label="Họ tên" />
                <RHFTextField name="phoneNumber" label="Số điện thoại" sx={{ mt: 4 }} />
                <RHFTextField name="company" label="Công ty" sx={{ mt: 4 }} />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 3 }}>
                <RHFTextField name="address" label="Địa chỉ KH" sx={{ mt: 0 }} />
                <RHFTextField name="email" label="Email" sx={{ mt: 4 }} />
                <Grid container justifyContent="flex-end" sx={{ mt: 8 }}>
                  <Grid item>
                    <LoadingButton variant="contained" onClick={handleCancel}>
                      Hủy
                    </LoadingButton>
                  </Grid>
                  <Grid item sx={{ ml: 1 }}>
                    <LoadingButton disabled={!updateBtnEnable} type="submit" variant="contained" loading={isSubmitting}>
                      Lưu
                    </LoadingButton>
                  </Grid>
                  <CommonBackdrop loading={isSubmitting} />
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </FormProvider>
    </Dialog>
  );
}
