import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { FormProvider } from '../../../../components/hook-form';
import CustomerPicker from './CustomerPicker';

// ----------------------------------------------------------------------

OrderNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentOrder: PropTypes.object,
};

export default function OrderNewEditForm({ isEdit, currentOrder }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewOrderSchema = Yup.object().shape({
    // customer: Yup.string().nullable().required('Đơn hàng phải có thông tin khách hàng'),
    // sale: Yup.mixed().nullable().required('Hãy chọn nhân viên kinh doanh cho đơn hàng này'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: currentOrder?.customer || null,
      sale: currentOrder?.sale || null,
      status: currentOrder?.status || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOrder]
  );

  const methods = useForm({
    resolver: yupResolver(NewOrderSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentOrder) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentOrder]);

  const handleCreateAndSend = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Tạo đơn hàng thành công!', { variant: 'success' });
      reset();
      navigate(PATH_DASHBOARD.saleAndMarketing.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <CustomerPicker />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Cập nhật' : 'Tạo đơn hàng'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
