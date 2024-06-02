import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import React, { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { FormProvider, RHFSelect, RHFTextField } from '../hook-form';
import RHFNumberField from '../hook-form/RHFNumberField';
import { fVietNamCurrency } from '../../utils/formatNumber';

const ALL_PRODUCT_CATEGORIES = loader('../../graphql/queries/products/getAllCategory.graphql');
const CREATE_PRODUCT = loader('../../graphql/mutations/products/createProduct.graphql');
const LIST_ALL_PRODUCT = loader('../../graphql/queries/products/listAllProduct.graphql');

// ----------------------------------------------------------------------------------------------

export const PRODUCT_TYPE = ['Chọn loại thép', 'Thép hình', 'Thép tấm'];

export const DEFAULT_CATEGORY = {
  id: 0,
  name: 'Chọn danh mục',
};

CreateNewProductDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
};

export default function CreateNewProductDialog({ title = 'Tạo sản phẩm mới', open, onClose, ...other }) {
  const [categories, setCategories] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [categoryId, setCategoryId] = useState(1);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: () => [
      {
        query: LIST_ALL_PRODUCT,
        variables: { input: {} },
      },
    ],
  });

  const { data: allCategories } = useQuery(ALL_PRODUCT_CATEGORIES, {
    fetchPolicy: 'cache-first',
  });

  const NewCreateProductSchema = Yup.object().shape({
    productName: Yup.string().required('Hãy nhập tên sản phẩm'),
    height: Yup.number().moreThan(0, 'Hãy nhật chiều cao'),
    code: Yup.string(),
    weight: Yup.number().moreThan(0, 'Hãy nhật trọng lượng sản phẩm'),
    price: Yup.number().moreThan(0, 'Giá không được là 0.00 VNĐ'),
    category: Yup.string().required('Hãy chọn danh mục'),
    unit: Yup.string(),
  });

  const defaultValues = {
    productName: '',
    code: '',
    height: 0,
    weight: 0,
    price: 0,
    category: '',
    unit: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewCreateProductSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (allCategories) {
      setCategories(allCategories?.getAllCategory);
    }
  }, [allCategories]);

  useEffect(() => {
    if (values) {
      setCategoryId(categories.filter((e) => e.name === values.category)[0]?.id);
    }
  }, [values, categories]);

  const handleChangeName = (productName) => {
    setValue('productName', productName);
  };

  const handleCreateNewProduct = async (data) => {
    try {
      const response = await createProduct({
        variables: {
          input: {
            productName: data?.productName,
            height: data?.height,
            weight: data?.weight,
            price: data?.price,
            code: data?.code || null,
            categoryId,
            unit: data.unit || null,
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
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleCreateNewProduct)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>
        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} p={1}>
              <RHFTextField
                fullWidth
                name="productName"
                label="Tên sản phẩm"
                value={values.productName}
                size={'small'}
                onChange={(e) => handleChangeName(e.target.value)}
                sx={{ mb: 3 }}
              />
              <RHFNumberField
                size={'small'}
                name="height"
                label="Độ dài"
                placeholder="0"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">M</InputAdornment>,
                }}
                setValue={setValue}
                InputLabelProps={{ shrink: true }}
              />
              <RHFNumberField
                size={'small'}
                name="weight"
                label="Trọng lượng"
                placeholder="0"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                }}
                setValue={setValue}
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                fullWidth
                name="code"
                label="Mã sản phẩm"
                value={values.code}
                size={'small'}
                onChange={(e) => setValue('productName', e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6} p={1}>
              <RHFNumberField
                size={'small'}
                name="price"
                label="Giá"
                placeholder="0.00"
                sx={{ mb: 3 }}
                value={fVietNamCurrency(values.priceWithoutVAT)}
                InputProps={{
                  endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                }}
                setValue={setValue}
                InputLabelProps={{ shrink: true }}
              />
              <RHFSelect
                name="category"
                label="Chọn danh mục"
                size={'small'}
                sx={{ mb: 3 }}
                onChange={(event) => {
                  setValue('category', event.target.value, { shouldValidate: true });
                }}
              >
                {[DEFAULT_CATEGORY, ...categories].map((category, idx) => (
                  <option key={idx} value={category?.name}>
                    {category?.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField
                fullWidth
                name="unit"
                label="Đơn vị"
                value={values.code}
                size={'small'}
                onChange={(e) => setValue('unit', e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Tạo sản phẩm mới
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
