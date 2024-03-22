// noinspection DuplicatedCode

import { Card, Grid, Stack, Typography } from '@mui/material';
import { orderPropTypes } from '../../../../../constant';
import { CustomerAbout, DriverAbout } from '../index';
import { DocumentDeliveryOrder } from './index';

// ----------------------------------------------------------------------

SummaryDeliveryOrder.propTypes = {
  order: orderPropTypes().isRequired,
};

export default function SummaryDeliveryOrder({ order }) {
  if (!order) {
    return null;
  }

  const { deliverOrder, customer, driver } = order;
  if (!deliverOrder) {
    return (
      <Card sx={{ pt: 3, px: 5, minHeight: 100 }}>
        <Typography textAlign={'center'} variant="h6">
          Chưa có lệnh xuất hàng
        </Typography>
      </Card>
    );
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <CustomerAbout customer={customer} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <DriverAbout driver={driver} />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <DocumentDeliveryOrder currentOrder={order} />
      </Grid>
    </Grid>
  );
}
