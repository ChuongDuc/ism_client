import { endOfDay, startOfDay, subDays } from 'date-fns';

export const OrderStatusArr = [
  'Tạo mới',
  'Báo giá - Chăm sóc KH',
  'Chốt đơn - Tạo lệnh xuất hàng',
  'Đang giao hàng',
  'Giao hàng thành công',
  'Xác nhận thanh toán và hồ sơ',
  // 'Chưa thanh toán',
  // 'Quá hạn',
  'Đã thanh toán',
  'Đơn hàng hoàn thành',
];

export const OrderStatus = {
  new: OrderStatusArr[0],
  quotationAndDeal: OrderStatusArr[1],
  newDeliverExport: OrderStatusArr[2],
  inProgress: OrderStatusArr[3],
  deliverSuccess: OrderStatusArr[4],
  // unpaid: OrderStatusArr[6],
  // overdue: OrderStatusArr[7],
  confirmByAccProcessing: OrderStatusArr[5],
  paid: OrderStatusArr[6],
  completed: OrderStatusArr[7],
};

export const DeliveryStatus = {
  new: 'Tạo mới',
  inProgress: 'Đang giao hàng',
  deliverySuccess: 'Giao hàng thành công',
  confirmByAccProcessing: 'Xác nhận thanh toán và hồ sơ',
  completed: 'Hoàn thành đơn hàng',
};

export const AllLabel = 'Tất cả';

export const encodeFileNameToUtf8 = (fileName) => {
  if (fileName) {
    return Buffer.from(fileName, 'latin1').toString('utf8');
  }
  return 'File';
};

export const getDateRange = () => {
  // Get current date
  const currentDate = new Date();

  // Calculate start date (00:00 of 30 days before)
  const startDate = startOfDay(subDays(currentDate, 30));

  // Calculate end date (23:59 of current date)
  const endDate = endOfDay(currentDate);

  // Format dates for better readability (optional)
  // const formattedStartDate = format(startDate, 'yyyy-MM-dd HH:mm:ss');
  // const formattedEndDate = format(endDate, 'yyyy-MM-dd HH:mm:ss');

  return {
    startDate,
    endDate,
  };
};
