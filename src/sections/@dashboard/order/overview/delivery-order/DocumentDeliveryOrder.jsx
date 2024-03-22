// noinspection JSValidateTypes

import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { alpha, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, Grid, Link, Stack, Typography } from '@mui/material';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { FormProvider, RHFUploadMultiFile } from '../../../../../components/hook-form';
import { orderPropTypes, Role } from '../../../../../constant';
import useAuth from '../../../../../hooks/useAuth';
import Image from '../../../../../components/Image';
import { CarouselArrows, CarouselDots } from '../../../../../components/carousel';
import { MotionContainer, varFade } from '../../../../../components/animate';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

DocumentDeliveryOrder.propTypes = {
  currentOrder: orderPropTypes().isRequired,
};

export default function DocumentDeliveryOrder({ currentOrder }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const defaultValues = useMemo(
    () => ({
      deliverOrder: currentOrder?.deliverOrder || null,
      updateDocumentFiles: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOrder]
  );

  const methods = useForm({
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
    if (currentOrder) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'updateDocumentFiles',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('updateDocumentFiles', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.updateDocumentFiles?.filter((_file) => _file !== file);
    setValue('updateDocumentFiles', filteredItems);
  };

  const isPermission = user.role === Role.driver && currentOrder?.driver && currentOrder?.driver?.id === user.id;

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    speed: 2000,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: false,
    beforeChange: (current, next) => setCurrentIndex(next),
    ...CarouselDots({
      zIndex: 9,
      top: 24,
      left: 24,
      position: 'absolute',
    }),
  };

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {currentOrder?.deliverOrder?.papers && currentOrder?.deliverOrder?.papers.length > 0 && (
        <Card sx={{ marginX: { xs: 0, md: 30 }, mb: 3 }}>
          <Slider ref={carouselRef} {...settings}>
            {currentOrder?.deliverOrder?.papers.map((app, index) => (
              <CarouselItem key={app.id} item={app} isActive={index === currentIndex} />
            ))}
          </Slider>

          <CarouselArrows
            onNext={handleNext}
            onPrevious={handlePrevious}
            spacing={0}
            sx={{
              top: 16,
              right: 16,
              position: 'absolute',
              '& .arrow': {
                p: 0,
                width: 32,
                height: 32,
                opacity: 0.48,
                color: 'common.white',
                '&:hover': { color: 'common.white', opacity: 1 },
              },
            }}
          />
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <LabelStyle>Thêm Ảnh hóa đơn/hợp đồng</LabelStyle>
                <RHFUploadMultiFile
                  name="updateDocumentFiles"
                  showPreview
                  disabled={!isPermission}
                  accept="image/*"
                  maxSize={31457280}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Stack>
            {isPermission && (
              <Stack spacing={3} sx={{ justifyContent: 'flex-end', pt: 2, alignSelf: 'flex-end', minWidth: 300 }}>
                <LoadingButton
                  sx={{ minWidth: 300, alignSelf: 'flex-end' }}
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Cập nhật giao hàng thành công
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CarouselItem.propTypes = {
  isActive: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    file: PropTypes.string,
  }),
};

function CarouselItem({ item, isActive }) {
  const { name, file } = item;

  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        component={MotionContainer}
        animate={isActive}
        action
        sx={{
          bottom: 0,
          width: 1,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography variant="h5" component="div" sx={{ mb: 1, opacity: 0.48 }}>
            Hóa đơn/Giấy xác nhận đã cập nhật
          </Typography>
        </m.div>
        <m.div variants={varFade().inRight}>
          <Link component={RouterLink} to="#" color="inherit" underline="none">
            <Typography variant="h5" gutterBottom noWrap>
              {name}
            </Typography>
          </Link>
        </m.div>
      </CardContent>
      <OverlayStyle />
      <Image alt={name} src={file} ratio={'1/1'} sx={{ height: { xs: 280, md: 320 } }} />
    </Box>
  );
}
