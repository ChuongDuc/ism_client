import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, InputAdornment, Stack } from '@mui/material';
// routes
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import RHFNumberField from '../../../components/hook-form/RHFNumberField';
import { fVietNamCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------
const UPDATE_PRODUCT = loader('../../../graphql/mutations/products/updateProductById.graphql');
const ALL_PRODUCT_CATEGORIES = loader('../../../graphql/queries/products/getAllCategory.graphql');

// ----------------------------------------------------------------------

export const DEFAULT_CATEGORY = {
  id: 0,
  name: 'Chọn danh mục',
};

export const UNIT = [
  { label: 'Cây', value: 'pipe' },
  { label: 'Tấm', value: 'plate' },
  { label: 'Cái', value: 'cai' },
  { label: 'Chiếc', value: 'chiec' },
  { label: 'Mét', value: 'm' },
  { label: 'M2', value: 'm2' },
  { label: 'Kg', value: 'kg' },
  { label: 'Cuộn', value: 'cuon' },
  { label: 'Md', value: 'md' },
];

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState(1);

  const { id } = useParams();

  const [isDisable, setIsDisable] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    refetchQueries: () => [
      {
        query: ALL_PRODUCT_CATEGORIES,
      },
    ],
  });

  const { data: allCategories } = useQuery(ALL_PRODUCT_CATEGORIES, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (allCategories) {
      setCategories(allCategories?.getAllCategory);
    }
  }, [allCategories]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm cần được nhập'),
    height: Yup.number().moreThan(0, 'Hãy nhật chiều cao'),
    weight: Yup.number().moreThan(0, 'Hãy nhật trọng lượng sản phẩm'),
    category: Yup.string().required('Hãy chọn danh mục'),
    price: Yup.number().moreThan(0, 'Giá không được là 0.00 VNĐ'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      height: currentProduct?.height || 0,
      weight: currentProduct?.weight || 0,
      price: currentProduct?.price || 0,
      category: currentProduct?.category.name || '',
      unit: currentProduct?.unit || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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
    if (values) {
      setCategoryId(categories.filter((e) => e.name === values.category)[0]?.id);
    }
  }, [values, categories]);

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const prevPrice = useRef(values.price);

  useEffect(() => {
    if (values.price !== prevPrice.current) {
      prevPrice.current = values.price;
      setValue('price', values.price / 1.1);
    }
  }, [setValue, values.price]);

  useEffect(() => {
    if (
      currentProduct?.name === values.name ||
      currentProduct?.height === Number(values.height) ||
      currentProduct?.weight === Number(values.weight) ||
      currentProduct?.price === Number(values.price) ||
      currentProduct?.category.name === values.category ||
      currentProduct?.unit === values.unit
    ) {
      setIsDisable(true);
    }
    if (currentProduct?.name !== values.name) {
      setIsDisable(false);
    }
    if (currentProduct?.height !== Number(values.height)) {
      setIsDisable(false);
    }
    if (currentProduct?.weight !== Number(values.weight)) {
      setIsDisable(false);
    }
    if (currentProduct?.price !== Number(values.price)) {
      setIsDisable(false);
    }
    if (currentProduct?.category.name !== values.category) {
      setIsDisable(false);
    }
    if (currentProduct?.unit !== values.unit) {
      setIsDisable(false);
    }
  }, [currentProduct, values]);

  const onSubmit = async () => {
    try {
      const response = await updateProduct({
        variables: {
          input: {
            productId: Number(id),
            name: values.name || '',
            height: Number(values.height) || null,
            weight: Number(values.weight) || null,
            price: Number(values.price) || null,
            categoryId,
            unit: values.unit,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Sửa phẩm không thành công. ${error.message} `, {
            variant: 'error',
            autoHideDuration: 10000,
          });
        },
      });
      if (!response.errors) {
        enqueueSnackbar('Sửa sản phẩm thành công', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.priceList.priceListProduct(categoryId));
      }
    } catch (error) {
      console.error(error);
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
              <RHFTextField name="name" size={'small'} label="Tên sản phẩm" />
              <RHFNumberField
                size={'small'}
                name="height"
                label="Độ dài"
                placeholder="0"
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
                InputProps={{
                  endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                }}
                setValue={setValue}
                InputLabelProps={{ shrink: true }}
              />
              <RHFNumberField
                size={'small'}
                name="price"
                label="Giá sản phẩm"
                placeholder="0.00"
                value={fVietNamCurrency(values.price)}
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
              <RHFSelect
                name="unit"
                label="Chọn đơn vị tính"
                size={'small'}
                onChange={(event) => {
                  setValue('unit', event.target.value);
                  if (event.target.value === '') {
                    setValue('unit', null);
                  }
                }}
              >
                <option label="Chọn đơn vị tính" />
                {UNIT.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton disabled={isDisable} type="submit" variant="contained" size="small" loading={isSubmitting}>
                {!isEdit ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
