// noinspection DuplicatedCode,JSValidateTypes

import { Box, Button, Card, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { DocumentDeliveryOrder } from './index';
import { orderPropTypes } from '../../../../constant';

// ----------------------------------------------------------------------

SummaryDeliveryOrder.propTypes = {
  order: orderPropTypes(),
  setCurrentTab: PropTypes.func,
};

export default function SummaryDeliveryOrder({ order, setCurrentTab }) {
  const { itemGroupList } = order;

  const deliverOrderList = order.deliverOrderList.length > 0 ? order.deliverOrderList : [];

  if (itemGroupList.length === 0) {
    return (
      <Card sx={{ pt: 3, px: 5, minHeight: 80 }}>
        <Typography textAlign={'center'} variant="h6">
          Đơn hàng chưa có báo giá
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Button variant="contained" onClick={setCurrentTab}>
            Tạo báo giá
          </Button>
        </Box>
      </Card>
    );
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <DocumentDeliveryOrder currentOrder={order} deliverOrder={deliverOrderList} />
      </Grid>
    </Grid>
  );
}
