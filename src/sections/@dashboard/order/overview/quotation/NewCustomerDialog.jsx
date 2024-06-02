// noinspection JSUnresolvedReference,RegExpDuplicateCharacterInClass

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import useAuth from '../../../../../hooks/useAuth';
import { FormProvider, RHFTextField } from '../../../../../components/hook-form';
import Iconify from '../../../../../components/Iconify';
import { Role } from '../../../../../constant';
import CommonBackdrop from '../../../../../components/CommonBackdrop';

const CREATE_CUSTOMER = loader('../../../../../graphql/mutations/customer/createCustomer.graphql');
const CREATE_ORDER = loader('../../../../../graphql/mutations/order/createOrder.graphql');
const ALL_CUSTOMER = loader('../../../../../graphql/queries/customer/listAllCustomer.graphql');

// ----------------------------------------------------------------------

NewCustomerDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  setCustomer: PropTypes.func,
  setOrder: PropTypes.func,
};

export default function NewCustomerDialog({
  title = 'Tạo khách hàng mới',
  open,
  onClose,
  setCustomer,
  setOrder,
  ...other
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [isExistCustomer, setIsExistCustomer] = useState(false);

  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        return setOrder(res?.createOrder);
      }
      return null;
    },
  });

  const regexPhoneNumber = /([+84|84]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;

  const NewCreateCustomerSchema = Yup.object().shape({
    customerName: Yup.string().required('Hãy nhập tên khách hàng'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(12, 'Số điện thoại chỉ có tối đa 10 số'),
  });

  const defaultValues = {
    name: '',
    phoneNumber: '',
    address: '',
    company: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewCreateCustomerSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  const { data: allCustomer } = useQuery(ALL_CUSTOMER, {
    variables: {
      input: {
        searchQuery: regexPhoneNumber.test(values.phoneNumber)
          ? values.phoneNumber?.replace(/(\+84|84)/, '0')
          : values.phoneNumber,
      },
    },
  });

  useEffect(() => {
    if (allCustomer?.listAllCustomer?.totalCount === 1) {
      setIsExistCustomer(true);
    } else {
      setIsExistCustomer(false);
    }
  }, [allCustomer]);

  const handleChangeName = (customerName) => {
    setValue('name', customerName);
  };

  const handleChangePhoneNumber = (phoneNumber) => {
    setValue('phoneNumber', phoneNumber);
  };

  const handleCreateNewCustomer = async (data) => {
    try {
      const response = await createCustomer({
        variables: {
          input: {
            name: data?.name,
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            company: data?.company,
            address: data?.address,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Tạo mới không thành công ${error}.`, {
            variant: 'error',
          });
        },
      });
      if (!response.errors) {
        enqueueSnackbar('Tạo mới thành công', {
          variant: 'success',
        });
        if (user.role === Role.sales) {
          await createOrder({
            variables: {
              input: {
                customerId: Number(response.data?.createCustomer?.id),
                saleId: Number(user.id),
              },
            },
          });
        }
        setCustomer(response.data?.createCustomer);
      }
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleCreateNewCustomer)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <>
            <RHFTextField
              fullWidth
              name="name"
              label="Tên khách hàng"
              value={values.name}
              onChange={(e) => handleChangeName(e.target.value)}
              sx={{ mb: 3 }}
            />
            <RHFTextField
              fullWidth
              name="phoneNumber"
              label="Số điện thoại"
              value={values.phoneNumber}
              onChange={(e) => handleChangePhoneNumber(e.target.value)}
              error={isExistCustomer || Boolean(errors?.phoneNumber)}
              helperText={
                (isExistCustomer && 'Số điện thoại khách hàng đã tồn tại') ||
                (Boolean(errors?.phoneNumber) && errors?.phoneNumber.message)
              }
              sx={{ mb: 3 }}
            />
            <RHFTextField name="company" label="Công ty" />
            <RHFTextField name="address" label="Địa chỉ KH" />
            <RHFTextField name="email" label="Email" />
          </>
        </DialogContent>

        <DialogActions>
          {isExistCustomer ? (
            <LoadingButton
              type="submit"
              variant="contained"
              disabled
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              loading={isSubmitting}
            >
              Tạo khách hàng mới
            </LoadingButton>
          ) : (
            <LoadingButton
              type="submit"
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              loading={isSubmitting}
            >
              Tạo khách hàng mới
            </LoadingButton>
          )}

          <CommonBackdrop loading={isSubmitting} />
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
