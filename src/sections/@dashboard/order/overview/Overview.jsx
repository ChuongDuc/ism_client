import { Grid, Stack } from '@mui/material';
import { OrderStatusInfo, TasksNeedToBeDone, OrderTimeline } from './common';
import { orderPropTypes } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

Overview.propTypes = {
  order: orderPropTypes().isRequired,
};

export default function Overview({ order }) {
  const { user } = useAuth();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <OrderStatusInfo order={order} />
          <TasksNeedToBeDone order={order} user={user} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <OrderTimeline order={order} />
      </Grid>
    </Grid>
  );
}
