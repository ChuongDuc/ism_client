import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// utils
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import CommonBackdrop from '../../../components/CommonBackdrop';
import Roles from './Role';
import { Role } from '../../../constant';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const CREATE = loader('../../../graphql/mutations/user/createUser.graphql');
const UPDATE = loader('../../../graphql/mutations/user/updateUser.graphql');

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const [updateAvatar, setUpdateAvatar] = useState(null);

  const NewUserSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Tên đăng nhập quá ngắn!').required('Bạn hãy điền tên đăng nhập'),
    email: Yup.string().email('Hãy nhập email'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(10, 'Số điện thoại chỉ có tối đa 10 số'),
    address: Yup.string(),
    password: Yup.string().required('Bạn hãy nhập mật khẩu'),
    firstName: Yup.string().required('Bạn hãy nhập họ'),
    lastName: Yup.string().required('Bạn hãy nhập tên'),
    role: Yup.string().required('Bạn hãy nhập chức vụ'),
  });

  const UpdateUserSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Tên đăng nhập quá ngắn!').required('Bạn hãy điền tên đăng nhập'),
    email: Yup.string().email('Hãy nhập tên đăng nhập là 1 email'),
    phoneNumber: Yup.string()
      .required('Hãy nhập số điện thoại')
      .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Không đúng định dạng số điện thoại')
      .max(10, 'Số điện thoại chỉ có tối đa 10 số'),
    address: Yup.string(),
    firstName: Yup.string().required('Bạn hãy nhập họ'),
    lastName: Yup.string().required('Bạn hãy nhập tên'),
    role: Yup.string().required('Bạn hãy nhập chức vụ'),
  });

  const defaultValues = useMemo(
    () => ({
      userName: currentUser?.userName || '',
      userId: currentUser?.id || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      avatarUrl: currentUser?.avatarURL || null,
      role: currentUser?.role || '',
      password: currentUser?.password || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      address: currentUser?.address || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: !isEdit ? yupResolver(NewUserSchema) : yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const [createFn] = useMutation(CREATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const [updateFn] = useMutation(UPDATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const onSubmit = async () => {
    if (isEdit) {
      await update(
        values.userId,
        values.userName,
        values.firstName,
        values.lastName,
        values.phoneNumber,
        values.address,
        values.role
      );
    } else {
      try {
        await create(
          values.avatarUrl,
          values.email,
          values.userName,
          values.phoneNumber,
          values.role,
          values.password,
          values.firstName,
          values.lastName,
          values.address
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const create = async (avatar, email, userName, phoneNumber, role, password, firstName, lastName, address) => {
    const response = await createFn({
      variables: {
        input: {
          avatar,
          email,
          userName,
          phoneNumber,
          address,
          role,
          password,
          firstName,
          lastName,
        },
      },

      onError() {
        enqueueSnackbar('Tạo người dùng không thành công', {
          variant: 'warning',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Tạo người dùng thành công', {
        variant: 'success',
      });
      navigate(PATH_DASHBOARD.user.list);
    }
  };

  const update = async (userId, userName, firstName, lastName, phoneNumber, address, role) => {
    const response = await updateFn({
      variables: {
        input: {
          id: userId,
          userName,
          role,
          avatarURL: updateAvatar,
          firstName,
          lastName,
          phoneNumber,
          address,
        },
      },
      onError(error) {
        enqueueSnackbar(`Cập nhật người dùng không thành công. Nguyên nhân: ${error.message}`, {
          variant: 'warning',
        });
      },
    });

    if (!response.errors) {
      enqueueSnackbar('Cập nhật người dùng thành công', {
        variant: 'success',
      });
      navigate(PATH_DASHBOARD.user.list);
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
        setUpdateAvatar(
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
      <Card sx={{ p: 3, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={user?.role === Role.sales ? 6 : 12}>
            <Box sx={{ py: 1 }}>
              <RHFUploadAvatar
                name="avatarUrl"
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
          {!isEdit ? (
            <>
              <RHFTextField size="small" name="userName" label="Tên Tài Khoản" />
              <RHFTextField size="small" name="password" label="Mật Khẩu" />
              <RHFTextField size="small" name="lastName" label="Họ" />
              <RHFTextField size="small" name="firstName" label="Tên" />
              <RHFTextField size="small" name="address" label="Địa chỉ" />
              <RHFTextField size="small" name="phoneNumber" label="Số điện thoại" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFSelect
                  size="small"
                  name="role"
                  label="Chức vụ"
                  onChange={(event) => {
                    setValue('role', event.target.value);
                  }}
                >
                  <option value="" />
                  {Roles.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
              <RHFTextField size="small" name="email" label="Email" />
            </>
          ) : (
            <>
              <RHFTextField size="small" name="lastName" label="Họ" />
              <RHFTextField size="small" name="firstName" label="Tên" />
              <RHFTextField size="small" disabled name="userName" label="Tên Tài Khoản" />
              <RHFTextField size="small" name="address" label="Địa chỉ" />
              <RHFTextField size="small" name="phoneNumber" label="Số điện thoại" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFSelect
                  size="small"
                  name="role"
                  label="Chức vụ"
                  onChange={(event) => {
                    setValue('role', event.target.value);
                  }}
                >
                  <option value="" />
                  {Roles.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>

              <RHFTextField size="small" name="email" label="Email" />
            </>
          )}
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 2 }}>
          <LoadingButton size="small" type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Tạo người dùng' : 'Lưu thay đổi'}
          </LoadingButton>
        </Stack>

        <CommonBackdrop loading={isSubmitting} />
      </Card>
    </FormProvider>
  );
}
