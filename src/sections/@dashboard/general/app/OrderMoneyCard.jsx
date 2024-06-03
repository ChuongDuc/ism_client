import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { sample } from 'lodash';
import useResponsive from '../../../../hooks/useResponsive';
import { fDateTimeSuffix } from '../../../../utils/formatTime';
import Iconify from '../../../../components/Iconify';
import OrderDetailsDrawer from './OrderDetailsDrawer';
import { FILE_TYPE, FileThumbnail } from '../../../../components/file-thumbnail';
import { fVietNamCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

OrderMoneyCard.propTypes = {
  sx: PropTypes.object,
  moneyOrder: PropTypes.object,
  onDelete: PropTypes.func,
};

export default function OrderMoneyCard({ moneyOrder, onDelete, sx, ...other }) {
  const {
    // invoiceNo,
    paymentList,
    remainingPaymentMoney,
    totalMoney,
    freightPrice,
    VAT,
    // deliverOrderList,
    customer,
    updatedAt,
  } = moneyOrder;

  const isDesktop = useResponsive('up', 'sm');

  const [favorite, setFavorite] = useState(true);

  const [openDetails, setOpenDetails] = useState(false);

  const [totalPayment, setTotalPayment] = useState(0);

  const [paymentLeft, setPaymentLeft] = useState(0);

  const handleFavorite = () => {
    setFavorite(!favorite);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  useEffect(() => {
    if (paymentList.length > 0) {
      setTotalPayment(paymentList?.map((payment) => payment.money).reduce((total, money) => total + money));
    }
  }, [paymentList]);

  useEffect(() => {
    if (totalPayment > 0) {
      setPaymentLeft(
        Math.abs(Number(totalPayment) - Number(totalMoney) - Number(freightPrice) - Number((totalMoney * VAT) / 100))
      );
    }
  }, [totalPayment, totalMoney, freightPrice, VAT]);

  return (
    <>
      <Stack
        spacing={isDesktop ? 1.5 : 2}
        direction={isDesktop ? 'row' : 'column'}
        alignItems={isDesktop ? 'center' : 'flex-start'}
        sx={{
          p: 2.5,
          borderRadius: 2,
          position: 'relative',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          },
          ...(isDesktop && {
            p: 1.5,
            borderRadius: 1.5,
          }),
          ...sx,
        }}
        {...other}
      >
        <FileThumbnail file={sample(FILE_TYPE)} />

        <Stack
          onClick={handleOpenDetails}
          sx={{
            width: 1,
            flexGrow: { sm: 1 },
            minWidth: { sm: '1px' },
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {`KH: ${customer?.name}`}
          </Typography>

          <Stack spacing={0.75} direction="row" alignItems="center" sx={{ typography: 'caption', mt: 0.5 }}>
            <Typography variant="subtitle2" noWrap>
              {remainingPaymentMoney < 0
                ? `Tiền thừa của KH:  ${fVietNamCurrency(Number(paymentLeft)) ?? ''}`
                : `Số tiền còn lại: ${fVietNamCurrency(Number(paymentLeft)) ?? ''}`}
            </Typography>
          </Stack>

          <Stack
            spacing={0.75}
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', color: 'text.disabled', mt: 0.5 }}
          >
            <Box> Cập nhật lúc: </Box>

            <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

            <Box> {updatedAt ? fDateTimeSuffix(updatedAt) : ''} </Box>
          </Stack>
        </Stack>

        <Box
          sx={{
            top: 8,
            right: 8,
            flexShrink: 0,
            position: 'absolute',
            ...(isDesktop && {
              position: 'unset',
            }),
          }}
        >
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorite}
            onChange={handleFavorite}
            sx={{ p: 0.75 }}
          />
        </Box>
      </Stack>

      <OrderDetailsDrawer
        item={moneyOrder}
        favorited={favorite}
        onFavorite={handleFavorite}
        // onCopyLink={handleCopy}
        open={openDetails}
        onClose={handleCloseDetails}
        onDelete={() => {
          handleCloseDetails();
          onDelete();
        }}
      />
    </>
  );
}
