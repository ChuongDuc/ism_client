import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { FormProvider } from '../../../../components/hook-form';
import RHFNumberField from '../../../../components/hook-form/RHFNumberField';
import { fVietNamCurrency } from '../../../../utils/formatNumber';

const UPDATE_PRICE_PRODUCT = loader('../../../../graphql/mutations/products/updateProductPriceById.graphql');

// ----------------------------------------------------------------------
DialogVATFormType.propTypes = {
  productId: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isEditingPriceWithoutVAT: PropTypes.bool,
  isEditingPriceWithVAT: PropTypes.bool,
  refetchData: PropTypes.func,
};
export default function DialogVATFormType({
  productId,
  isOpen,
  onClose,
  isEditingPriceWithoutVAT,
  isEditingPriceWithVAT,
  refetchData,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [updatePriceProduct] = useMutation(UPDATE_PRICE_PRODUCT, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  let NewPriceSchema;
  if (isEditingPriceWithoutVAT) {
    NewPriceSchema = Yup.object().shape({
      priceWithoutVAT: Yup.number().moreThan(0, 'Giá không được là 0.00 VNĐ'),
    });
  }
  if (isEditingPriceWithVAT) {
    NewPriceSchema = Yup.object().shape({
      priceWithVAT: Yup.number().moreThan(0, 'Giá không được là 0.00 VNĐ'),
    });
  }

  const defaultValues = useMemo(
    () => ({
      priceWithoutVAT: 0,
      priceWithVAT: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const methods = useForm({
    resolver: yupResolver(NewPriceSchema),
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

  const onSubmit = async () => {
    try {
      const response = await updatePriceProduct({
        variables: {
          input: {
            productId,
            priceWithVAT: isEditingPriceWithVAT ? Number(values.priceWithVAT) : null,
            priceWithoutVAT: isEditingPriceWithoutVAT ? Number(values.priceWithoutVAT) : null,
          },
        },
        onError: () => {
          enqueueSnackbar(`Sửa giá sản phẩm không thành công `, {
            variant: 'error',
            autoHideDuration: 10000,
          });
        },
      });
      if (!response.errors) {
        enqueueSnackbar('Sửa giá thành công', {
          variant: 'success',
        });
      }
      await refetchData();
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ textAlign: 'center' }}>Sửa giá sản phẩm</DialogTitle>
          <DialogContent sx={{ paddingTop: '24px !important', minWidth: '400px', minHeight: '200px' }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              {isEditingPriceWithoutVAT && (
                <RHFNumberField
                  size={'small'}
                  name="priceWithoutVAT"
                  label="Giá chưa VAT"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.priceWithoutVAT)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              {isEditingPriceWithVAT && (
                <RHFNumberField
                  size={'small'}
                  name="priceWithVAT"
                  label="Giá có VAT"
                  placeholder="0.00"
                  value={fVietNamCurrency(values.priceWithVAT)}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                  }}
                  setValue={setValue}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onClose}>
              Hủy
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Cập nhật
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Box>
  );
}
