import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import {
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Scrollbar from '../../../../../components/Scrollbar';
import { fddMMYYYYWithSlash } from '../../../../../utils/formatTime';
import AdditionalOption from './AdditionalOption';
import DeliverOrderDetailTableRow from './DeliverOrderDetailTableRow';
import PdfAction from './PdfAction';
import Iconify from '../../../../../components/Iconify';
import useResponsive from '../../../../../hooks/useResponsive';
import { formatNumberWithCommas, fVietNamCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------
DeliverOrderDetail.propTypes = {
  isSalePermission: PropTypes.bool.isRequired,
  formMethod: PropTypes.object.isRequired,
};

export default function DeliverOrderDetail({ isSalePermission, formMethod }) {
  const { setValue, watch } = useFormContext();

  const values = watch();

  const isDesktop = useResponsive('up', 'lg');

  // Cập nhật thông tin cước vận chuyển phải thu
  useEffect(() => {
    if (values.freightPrice && values.freightPrice > 0) {
      setValue('deliveryPayable', `${fVietNamCurrency(values.freightPrice)} VNĐ`);
    } else {
      setValue('deliveryPayable', 'miễn phí');
    }
  }, [setValue, values.freightPrice]);
  return (
    <>
      <Card sx={{ px: { xs: 1, md: 5 }, mb: 1 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 960, py: 3 }}>
            <Table size="small">
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell align="left" sx={{ width: '30px' }}>
                    STT
                  </TableCell>
                  <TableCell align="left" sx={{ minWidth: 280 }}>
                    Thông tin đơn hàng
                  </TableCell>
                  <TableCell align="left">Phương thức giao nhận</TableCell>
                  <TableCell align="left">S.L</TableCell>
                  <TableCell align="left" sx={{ minWidth: 120 }}>
                    Đơn trọng
                  </TableCell>
                  <TableCell align="left" sx={{ minWidth: 130 }}>
                    Tổng trọng
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.itemGroupList &&
                  values.itemGroupList.map((row, index) => (
                    <DeliverOrderDetailTableRow
                      row={row}
                      index={index}
                      key={index}
                      itemGroupList={values.itemGroupList}
                      formMethod={formMethod}
                      isSalePermission={isSalePermission}
                    />
                  ))}
                <RowResultStyle>
                  <TableCell colSpan={4} />
                  <TableCell align="left">
                    <Typography sx={{ fontWeight: 'bold' }}>TỔNG</Typography>
                  </TableCell>
                  <TableCell align="left" width={140}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {formatNumberWithCommas(
                        values?.itemGroupList?.reduce(
                          (total, data) =>
                            total +
                            data.orderDetailList.reduce(
                              (total, orderDetail) => total + orderDetail.quantity * orderDetail?.weightProduct,
                              0
                            ),
                          0
                        ) ?? 0
                      )}
                    </Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
        <Grid container pt={1}>
          <Grid item xs={12} md={4} sx={{ mb: 1 }}>
            <Stack spacing={1.2} sx={{ py: 1.5, px: 1.5 }}>
              <Typography noWrap variant="body2">
                Người nhận hàng: {values?.customer?.name}
              </Typography>
              <Typography noWrap variant="body2">
                Tên công ty: {values.customer?.company?.companyName}
              </Typography>
              <Typography noWrap variant="body2">
                Địa chỉ: {values.customer?.company?.address}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mb: 1 }}>
            <Stack spacing={1.2} sx={{ py: 1.5, px: 1.5 }}>
              <Typography noWrap variant="body2">
                Thời gian nhận: {values?.deliveryDate ? fddMMYYYYWithSlash(values?.deliveryDate) : 'Chưa có thông tin'}
              </Typography>
              <Typography noWrap variant="body2">
                Địa chỉ nhận hàng: {values?.deliverAddress}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mb: 1 }}>
            <Stack spacing={1.2} sx={{ p: 1.5 }}>
              <Typography noWrap variant="body2">
                NV bán hàng: {values.sale?.fullName}
              </Typography>
              <Typography noWrap variant="body2">
                Số điện thoại: {values.sale?.phoneNumber}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {values.itemGroupList.length > 0 && <AdditionalOption />}

        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
        <Stack spacing={0} sx={{ pt: 1.5, pb: 2, px: 0 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="start">
            {values.deliverOrderList && values.deliverOrderList.length === 0 && isSalePermission && (
              <Button
                variant="contained"
                size="small"
                color="warning"
                type="submit"
                startIcon={<Iconify icon="system-uicons:create" />}
              >
                {isDesktop ? 'Tạo lệnh xuất hàng' : 'Tạo'}
              </Button>
            )}
            {values.deliverOrderList && values.deliverOrderList.length > 0 && isSalePermission && (
              <Button
                variant="contained"
                size="small"
                color="warning"
                type="submit"
                startIcon={<Iconify icon="system-uicons:create" />}
              >
                Cập nhật
              </Button>
            )}
          </Stack>
        </Stack>
      </Card>
      <PdfAction formMethod={formMethod} />
    </>
  );
}
