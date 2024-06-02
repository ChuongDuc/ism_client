// noinspection DuplicatedCode

import { Card, Stack, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';
import { OrderStatus } from '../../../../../constant';
import { formatStatus } from '../../../../../utils/getOrderFormat';

// ----------------------------------------------------------------------

OrderStatusInfo.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderStatusInfo({ order }) {
  const { status, totalMoney } = order;
  return (
    <Card sx={{ py: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} lg={3}>
          <Stack textAlign="center" spacing={0.3}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Trạng thái đơn hàng
            </Typography>
            <Typography
              variant="subtitle1"
              color={
                (formatStatus(status) === OrderStatus.new && 'info.main') ||
                (formatStatus(status) === OrderStatus.quotationAndDeal && 'info.main') ||
                (formatStatus(status) === OrderStatus.newDeliverExport && 'success.main') ||
                (formatStatus(status) === OrderStatus.inProgress && 'info.main') ||
                (formatStatus(status) === OrderStatus.deliverSuccess && 'success.main') ||
                (formatStatus(status) === OrderStatus.paid && 'success.main') ||
                (formatStatus(status) === OrderStatus.confirmByAccProcessing && 'warning.main') ||
                (formatStatus(status) === OrderStatus.completed && 'success.main')
              }
            >
              {formatStatus(status)}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Stack textAlign="center" spacing={0.3}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Tổng đơn hàng
            </Typography>
            <Typography variant="subtitle1">{`${fVietNamCurrency(totalMoney)} VNĐ`}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          {order?.sale !== null && (
            <Stack textAlign="center" spacing={0.3}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Nhân viên kinh doanh
              </Typography>
              <Typography variant="subtitle1">{order?.sale?.fullName}</Typography>
              <Typography variant="subtitle1">{order?.sale?.phoneNumber}</Typography>
            </Stack>
          )}
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          {order?.deliverOrderList?.driver !== null && (
            <Stack textAlign="center" spacing={0.3}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Nhân viên lái xe
              </Typography>
              {order?.deliverOrderList.map((data, index) => (
                <div key={index}>
                  <Typography variant="subtitle1">{data.driver?.fullName}</Typography>
                  <Typography variant="subtitle1">{data.driver?.phoneNumber}</Typography>
                </div>
              ))}
              <Typography variant="subtitle1">{order?.deliverOrderList?.driver?.fullName}</Typography>
              <Typography variant="subtitle1">{order?.deliverOrderList?.driver?.phoneNumber}</Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}
