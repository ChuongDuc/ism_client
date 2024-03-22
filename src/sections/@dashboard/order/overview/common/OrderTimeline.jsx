import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { fDateTimeSuffix } from '../../../../../utils/formatTime';
import _mock from '../../../../../_mock';
import { orderPropTypes, OrderStatus } from '../../../../../constant';

// ----------------------------------------------------------------------
export const orderTimeline = [...Array(9)].map((_, index) => ({
  id: index,
  title: [
    'Admin tạo đơn hàng mới',
    'Nhân viên kinh doanh tạo báo giá',
    'Nhân viên kinh doanh tạo hợp đồng mới',
    'Đơn hàng vừa được chốt',
    'Nhân viên kinh doanh tạo lệnh xuất hàng',
    'Đang giao hàng',
    'Xuất hàng thành công',
    'Đơn hàng đã được thanh toán',
    'Kế toán xác nhận đã đầy đủ thủ tục và giấy tờ',
  ][index],
  type: `order${index + 1}`,
  time: _mock.time(index),
}));

const getTimeLineByOrderStatus = (orderStatus) => {
  switch (orderStatus) {
    case OrderStatus.new:
      return orderTimeline.slice(0, 1);
    case OrderStatus.quotationAndDeal:
      return orderTimeline.slice(0, 3);
    case OrderStatus.newDeliverExport:
      return orderTimeline.slice(0, 5);
    case OrderStatus.inProgress:
      return orderTimeline.slice(0, 6);
    case OrderStatus.deliverSuccess:
      return orderTimeline.slice(0, 7);
    case OrderStatus.overdue:
      return orderTimeline.slice(0, 2);
    case OrderStatus.unpaid:
      return orderTimeline.slice(0, 7);
    case OrderStatus.paid:
      return orderTimeline.slice(0, 8);
    case OrderStatus.confirmByAccProcessing:
      return orderTimeline.slice(0, 9);
    case OrderStatus.completed:
      return orderTimeline.slice(0, 9);
    default:
      return orderTimeline;
  }
};
// ----------------------------------------------------------------------
OrderTimeline.propTypes = {
  order: orderPropTypes().isRequired,
};

export default function OrderTimeline({ order }) {
  const timeLineLst = getTimeLineByOrderStatus(order?.status);
  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none',
        },
      }}
    >
      <CardHeader title="Thông tin quy trình đơn hàng" />
      <CardContent>
        <Timeline>
          {timeLineLst.map((item, index) => (
            <OrderTimelineItem key={item.id} item={item} isLast={index === orderTimeline.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderTimelineItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function OrderTimelineItem({ item, isLast }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (item?.type === 'order1' && 'primary') ||
            (item?.type === 'order2' && 'success') ||
            (item?.type === 'order3' && 'info') ||
            (item?.type === 'order4' && 'warning') ||
            (item?.type === 'order5' && 'info') ||
            (item?.type === 'order6' && 'info') ||
            (item?.type === 'order7' && 'info') ||
            'success'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{item?.title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTimeSuffix(item?.time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
