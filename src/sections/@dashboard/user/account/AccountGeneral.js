import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useNavigate } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { Role } from '../../../../constant';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------
const USER_BY_ID = loader('../../../../graphql/queries/user/getUserById.graphql');
const UPDATE_USER = loader('../../../../graphql/mutations/user/updateUser.graphql');

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [updateBtnEnable, setUpdateBtnEnable] = useState(false);

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: () => [
      {
        query: USER_BY_ID,
        variables: { userId: parseInt(user.id, 10) },
      },
    ],
    onCompleted: () => {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(`Cập nhật không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Không được để trống họ tên'),
    lastName: Yup.string().required('Không được để trống họ tên'),
  });

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    avatarURL: user?.avatarURL,
    avatar: null,
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      await updateUser({
        variables: {
          input: {
            id: parseInt(user.id, 10),
            firstName: values.firstName?.trim() !== user.firstName ? values.firstName : null,
            lastName: values.lastName?.trim() !== user.lastName ? values.lastName : null,
            avatarURL: values.avatar,
            address: values.address?.trim() !== user.address ? values.address : null,
          },
        },
      });
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
      navigate(PATH_DASHBOARD.root);
      await window.location.reload();
    } catch (error) {
      enqueueSnackbar(`Cập nhật không thành công. ${error.message}`, {
        variant: 'error',
      });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'avatarURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setValue(
          'avatar',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setUpdateBtnEnable(true);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={user?.role === Role.sales ? 6 : 12}>
            <Box sx={{ py: 1 }}>
              <RHFUploadAvatar
                name="avatarURL"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                size={'small'}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      my: 1,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Chỉ chấp nhận *.jpeg, *.jpg, *.png, *.gif
                    <br /> kích thước tối đa {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            my: 2,
            display: 'grid',
            rowGap: 2,
            columnGap: 2,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <RHFTextField
            onBlur={() => {
              if (values.lastName.toString().trim() !== user?.lastName.trim()) {
                setUpdateBtnEnable(true);
              } else {
                setUpdateBtnEnable(false);
              }
            }}
            size={'small'}
            name="lastName"
            label="Họ"
          />

          <RHFTextField
            onBlur={() => {
              if (values.firstName.toString().trim() !== user?.firstName.trim()) {
                setUpdateBtnEnable(true);
              } else {
                setUpdateBtnEnable(false);
              }
            }}
            size={'small'}
            name="firstName"
            label="Tên"
          />

          <RHFTextField
            error={values.email !== user?.email}
            helperText={values.email !== user?.email ? 'Không được thay đổi email' : ''}
            disabled
            size={'small'}
            name="email"
            label="Địa chỉ Email"
          />

          <RHFTextField
            error={values.phoneNumber !== user?.phoneNumber}
            helperText={values.phoneNumber !== user?.phoneNumber ? 'Không được thay số điện thoại' : ''}
            disabled
            name="phoneNumber"
            size={'small'}
            label="Số điện thoại"
          />

          <RHFTextField
            onBlur={() => {
              if (values.address.toString().trim() !== user?.address.trim()) {
                setUpdateBtnEnable(true);
              } else {
                setUpdateBtnEnable(false);
              }
            }}
            size={'small'}
            name="address"
            label="Địa chỉ"
          />
        </Box>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 0 }}>
          <LoadingButton disabled={!updateBtnEnable} type="submit" variant="contained" loading={isSubmitting}>
            Lưu Thay Đổi
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
