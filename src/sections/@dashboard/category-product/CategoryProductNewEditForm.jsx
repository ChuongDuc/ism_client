// noinspection ES6CheckImport,JSCheckFunctionSignatures

import * as Yup from 'yup';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import CommonBackdrop from '../../../components/CommonBackdrop';

const CREATE_CATEGORY_PRODUCT = loader('../../../graphql/mutations/categoryProduct/createProductCategory.graphql');

// ----------------------------------------------------------------------

CategoryProductNewEditForm.propTypes = {
  onClose: PropTypes.func,
};

export default function CategoryProductNewEditForm({ onClose }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [createCategoryProductFn, { loading: loadingCreate }] = useMutation(CREATE_CATEGORY_PRODUCT);

  const NewCategoryProductSchema = Yup.object().shape({
    name: Yup.string().trim().required('Bạn phải nhập tên mục sản phẩm'),
  });

  const defaultValues = {
    name: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewCategoryProductSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    const response = await createCategoryProductFn({
      variables: {
        input: {
          name: values.name,
        },
      },
      onError: () => {
        enqueueSnackbar(`Tạo mới không thành công.`, {
          variant: 'error',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Tạo mới thành công', {
        variant: 'success',
      });
      onClose();
      navigate(PATH_DASHBOARD.priceList.root);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
              }}
            >
              <RHFTextField name="name" label="Tên mục sản phẩm" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Tạo Mới
              </LoadingButton>
            </Stack>
            <CommonBackdrop loading={isSubmitting || loadingCreate} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
