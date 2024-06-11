import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, InputAdornment, Stack } from '@mui/material';

// routes
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import { formatVehicles } from '../../../utils/formatVehicles';
import CommonBackdrop from '../../../components/CommonBackdrop';

const TYPE_OPTION = ['Chọn loại xe', 'Xe Container', 'Xe Tải'];

// ----------------------------------------------------------------------
const CREATE_VEHICLES = loader('../../../graphql/mutations/vehicle/createVehicle.graphql');
const UPDATE_VEHICLES = loader('../../../graphql/mutations/vehicle/updateVehicle.graphql');

// ----------------------------------------------------------------------
TransportationNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTransportation: PropTypes.object,
  drivers: PropTypes.array,
  vehiclesId: PropTypes.string,
  refetchData: PropTypes.func,
};
export default function TransportationNewEditForm({ isEdit, vehiclesId, currentTransportation, drivers, refetchData }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [arrDriver, setArrDriver] = useState([]);

  const NewTransportationSchema = Yup.object().shape({
    driverId: Yup.string().required('Cần chọn lái xe'),
    type: Yup.string().required('Cần chọn loại xe'),

    weight: Yup.number().min(1, 'Trọng tải phải lớn hơn 0.00'),
    licensePlates: Yup.string()
      .required('Cần nhập biến số')
      .matches(
        /^[0-9]{2}[A-Z]{1,2}[-][0-9]{4,5}$/,
        'Không đúng định dạng biển số xe. Định dạng XXX-YYYYY. Ví dụ: 30A-12345'
      ),
  });

  const defaultValues = useMemo(
    () => ({
      vehiclesId: vehiclesId || '',
      driverId: currentTransportation?.driver?.fullName || '',
      type: formatVehicles(currentTransportation?.typeVehicle) || '',
      weight: currentTransportation?.weight || 0,
      licensePlates: currentTransportation?.licensePlates || '',
    }),
    [vehiclesId, currentTransportation]
  );

  const methods = useForm({
    resolver: yupResolver(NewTransportationSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  useEffect(() => {
    if (isEdit && currentTransportation) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [reset, isEdit, currentTransportation, defaultValues]);

  useEffect(() => {
    if (values.driverId === 'Chọn lái xe') {
      setValue('driverId', '');
    }
  }, [setValue, values.driverId]);

  useEffect(() => {
    if (values.type === 'Chọn loại xe') {
      setValue('type', '');
    }
  }, [setValue, values.type]);

  const [createVehiclesFn] = useMutation(CREATE_VEHICLES, {
    variables: {
      input: {},
    },
  });
  const [updateVehiclesFn] = useMutation(UPDATE_VEHICLES, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  useEffect(() => {
    if (isEdit && currentTransportation?.driver) {
      const dataUser = currentTransportation.driver;
      const myArray = [dataUser, ...drivers];
      setArrDriver(myArray);
    } else {
      setArrDriver(drivers);
    }
  }, [isEdit, currentTransportation, drivers]);

  const onSubmit = async () => {
    try {
      if (isEdit) {
        await updateVehiclesFn({
          variables: {
            input: {
              vehicleId: Number(values.vehiclesId),
              createdById: Number(user.id),
              driverId: Number(values.driverId) === Number(defaultValues.driverId) ? null : Number(values.driverId),
              weight: values.weight,
              licensePlates: values.licensePlates === defaultValues.licensePlates ? null : values.licensePlates,
              typeVehicle: formatVehicles(values.type),
            },
          },
        });
      } else {
        await createVehiclesFn({
          variables: {
            input: {
              createdById: Number(user.id),
              driverId: Number(values.driverId),
              weight: values.weight,
              licensePlates: values.licensePlates,
              typeVehicle: formatVehicles(values.type),
            },
          },
        });
      }
      await refetchData;
      reset();
      enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!');
      navigate(PATH_DASHBOARD.transportation.list);
    } catch (error) {
      enqueueSnackbar(
        !isEdit
          ? `Tạo không thành công. Nguyên nhân: ${error.message}`
          : `Cập nhật không  thành công . Nguyên nhân: ${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <RHFSelect
            name="driverId"
            label="Tên Lái-Phụ Xe"
            onChange={(event) => {
              setValue('driverId', event.target.value, { shouldValidate: true });
            }}
          >
            {isEdit
              ? arrDriver.map((driver, idx) => (
                  <option key={idx} value={driver.id}>
                    {driver.fullName}
                  </option>
                ))
              : ['Chọn lái xe', ...arrDriver].map((driver, idx) => {
                  if (driver.fullName === values.driverId) {
                    return (
                      <option key={idx} value={driver.id} disabled>
                        {driver.fullName}
                      </option>
                    );
                  }
                  return (
                    <option key={idx} value={driver.id}>
                      {driver.fullName}
                    </option>
                  );
                })}
          </RHFSelect>

          <RHFTextField
            name="weight"
            label="Trọng tải"
            placeholder="0.00"
            type="number"
            value={getValues('weight') === 0 ? '' : getValues('weight')}
            onChange={(event) => setValue('weight', Number(event.target.value), { shouldValidate: true })}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              type: 'number',
              endAdornment: <InputAdornment position="start">TẤN</InputAdornment>,
            }}
          />
          <RHFSelect
            name="type"
            label="Loại"
            onChange={(event) => {
              setValue('type', event.target.value, { shouldValidate: true });
            }}
          >
            {isEdit
              ? TYPE_OPTION.filter((type) => type !== 'Chọn loại xe').map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))
              : TYPE_OPTION.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
          </RHFSelect>

          <RHFTextField name="licensePlates" label="Biển số" />
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Tạo xe-phương tiện' : 'Lưu'}
          </LoadingButton>
        </Stack>

        <CommonBackdrop loading={isSubmitting} />
      </Card>
    </FormProvider>
  );
}
