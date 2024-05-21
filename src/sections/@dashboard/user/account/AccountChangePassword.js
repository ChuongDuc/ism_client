import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const UPDATE_USER = loader('../../../../graphql/mutations/user/updateUser.graphql');

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, logout } = useAuth();

  const [updateUser] = useMutation(UPDATE_USER, {
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

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Hãy nhập mật khẩu cũ'),
    newPassword: Yup.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự').required('Hãy nhập mật khẩu mới'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Phải trùng khớp với mật khẩu mới'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
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
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
        },
      });
      reset();
      await logout();
    } catch (error) {
      enqueueSnackbar(`Cập nhật không thành công. ${error.message}`, {
        variant: 'error',
      });
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label="Mật khẩu cũ" />

          <RHFTextField name="newPassword" type="password" label="Mật khẩu mới" />

          <RHFTextField name="confirmNewPassword" type="password" label="Xác nhận mật khẩu mới" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Lưu Thay Đổi
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
