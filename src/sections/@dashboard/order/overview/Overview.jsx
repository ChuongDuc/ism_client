import { Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { OrderStatusInfo, TasksNeedToBeDone } from './common';
import useAuth from '../../../../hooks/useAuth';
import TasksNeedToBePaid from './common/TasksNeedToBePaid';

// ----------------------------------------------------------------------

Overview.propTypes = {
  order: PropTypes.object,
};

export default function Overview({ order }) {
  const [listStatus, setListStatus] = useState([]);
  const { user } = useAuth();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <TasksNeedToBeDone order={order} user={user} listStatus={listStatus} />
          <TasksNeedToBePaid order={order} user={user} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <OrderStatusInfo order={order} />
        </Stack>
      </Grid>
    </Grid>
  );
}
