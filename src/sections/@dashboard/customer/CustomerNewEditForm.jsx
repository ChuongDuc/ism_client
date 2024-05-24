// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------
const CREATE_CUSTOMRER = loader('../../../graphql/mutations/customer/createCustomer.graphql');

const LIST_ALL_CUSTOMER = loader('../../../graphql/queries/customer/listAllCustomer.graphql');

// ----------------------------------------------------------------------

CustomerNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCustomer: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    company: PropTypes.string,
    address: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default function CustomerNewEditForm({ isEdit, currentCustomer }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(10, 'Số điện thoại chỉ có tối đa 10 số'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      phoneNumber: '',
      address: '',
      company: '',
      email: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
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

  const [createCustomerFn] = useMutation(CREATE_CUSTOMRER, {
    variables: {
      input: {},
    },
    refetchQueries: () => [
      {
        query: LIST_ALL_CUSTOMER,
        variables: {
          input: {},
        },
      },
    ],
  });

  const onSubmit = async () => {
    try {
      await createCustomerFn({
        variables: {
          input: {
            name: values?.name,
            email: values?.email,
            phoneNumber: values?.phoneNumber,
            company: values?.company,
            address: values?.address,
          },
        },
      });
      reset();
      enqueueSnackbar('Tạo khách hàng mới thành công!');
      navigate(PATH_DASHBOARD.customer.list);
    } catch (error) {
      enqueueSnackbar(`Thêm khách hàng không thành công: ${error.message}`, {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
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
              <RHFTextField name="company" label="Công ty" />
              <RHFTextField name="address" label="Địa chỉ KH" />
              <RHFTextField name="email" label="Email" />
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
