// noinspection DuplicatedCode,JSUnresolvedFunction

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FormProvider } from '../../../../../../components/hook-form';
import QuotationNewEditDetails from './QuotationNewEditDetails';
import { customerPropTypes } from '../../../../../../constant';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';

// ----------------------------------------------------------------------

QuotationNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  customer: customerPropTypes().isRequired,
  freightPrice: PropTypes.number,
  currentProducts: PropTypes.arrayOf(
    PropTypes.shape({
      cover: PropTypes.string,
      id: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
      code: PropTypes.string,
      sku: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      quantity: PropTypes.number,
      price: PropTypes.number,
      weight: PropTypes.number,
      priceSale: PropTypes.number,
      totalRating: PropTypes.number,
      totalReview: PropTypes.number,
      inventoryType: PropTypes.string,
      sizes: PropTypes.string,
      available: PropTypes.number,
      description: PropTypes.string,
      sold: PropTypes.number,
      category: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
    })
  ),
};

export default function QuotationNewEditForm({ isEdit, customer, currentProducts, freightPrice }) {
  const navigate = useNavigate();
  const [loadingSend, setLoadingSend] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const NewQuotationSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      products: currentProducts || [],
      customer: customer || null,
      freightPrice: freightPrice || 0,
      freightMessage: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProducts]
  );

  const methods = useForm({
    resolver: yupResolver(NewQuotationSchema),
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
    if (isEdit && currentProducts) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProducts]);

  const newQuotationProducts = {
    ...values,
    items: values.products.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    })),
  };

  const handleCreateAndSend = async () => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSend(false);
      enqueueSnackbar('Tạo báo giá thành công!', { variant: 'success' });
      navigate(PATH_DASHBOARD.saleAndMarketing.demoView);
      console.log(JSON.stringify(newQuotationProducts, null, 2));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <QuotationNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3, mb: 3, mr: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Cập nhật' : 'Tạo mới'} & Gửi
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
