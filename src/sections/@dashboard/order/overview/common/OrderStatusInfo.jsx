// noinspection DuplicatedCode

import { Card, Divider, Stack, Typography } from '@mui/material';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';
import { orderPropTypes, OrderStatus } from '../../../../../constant';

// ----------------------------------------------------------------------

OrderStatusInfo.propTypes = {
  order: orderPropTypes().isRequired,
};

export default function OrderStatusInfo({ order }) {
  const { status, products, freightPrice } = order;
  let totalP = products
    ? products.reduce(
        (total, data) =>
          data?.price && data?.weight && Number(data?.price) > 0 && Number(data?.weight) > 0
            ? total + Number(data?.price) * Number(data?.weight) * Number(data?.quantity)
            : total + 0,
        0
      )
    : 0;
  totalP = freightPrice ? totalP + freightPrice : totalP;

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Trạng thái đơn hàng
          </Typography>
          <Typography
            variant="h4"
            color={
              (status === OrderStatus.new && 'info.main') ||
              (status === OrderStatus.quotationAndDeal && 'info.main') ||
              (status === OrderStatus.newDeliverExport && 'success.main') ||
              (status === OrderStatus.inProgress && 'info.main') ||
              (status === OrderStatus.deliverSuccess && 'success.main') ||
              (status === OrderStatus.unpaid && 'warning.main') ||
              (status === OrderStatus.overdue && 'error.main') ||
              (status === OrderStatus.paid && 'success.main') ||
              (status === OrderStatus.confirmByAccProcessing && 'warning.main') ||
              (status === OrderStatus.completed && 'success.main')
            }
          >
            {status}
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tổng đơn hàng
          </Typography>
          <Typography variant="h4">{`${fVietNamCurrency(totalP)} VNĐ`}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
