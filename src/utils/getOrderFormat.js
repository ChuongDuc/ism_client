export const OrderStatusInVietnamese = {
  creatNew: 'Tạo mới',
  priceQuotation: 'Báo giá - Chăm sóc KH',
  createExportOrder: 'Chốt đơn - Tạo lệnh xuất hàng',
  delivery: 'Đang giao hàng',
  successDelivery: 'Giao hàng thành công',
  paymentConfirmation: 'Xác nhận thanh toán và hồ sơ',
  paid: 'Đang thanh toán',
  done: 'Đơn hàng hoàn thành',
};
export const formatStatus = (status) => {
  switch (status) {
    case 'creatNew':
      return 'Tạo mới';
    case 'priceQuotation':
      return 'Báo giá - Chăm sóc KH';
    case 'createExportOrder':
      return 'Chốt đơn - Tạo lệnh xuất hàng';
    case 'delivery':
      return 'Đang giao hàng';
    case 'successDelivery':
      return 'Giao hàng thành công';
    case 'paymentConfirmation':
      return 'Xác nhận thanh toán và hồ sơ';
    case 'paid':
      return 'Đang thanh toán';
    case 'done':
      return 'Đơn hàng hoàn thành';
    default:
      return '';
  }
};

export const reformatStatus = (status) => {
  switch (status) {
    case 'Tạo mới':
      return 'creatNew';
    case 'Báo giá - Chăm sóc KH':
      return 'priceQuotation';
    case 'Chốt đơn - Tạo lệnh xuất hàng':
      return 'createExportOrder';
    case 'Đang giao hàng':
      return 'delivery';
    case 'Giao hàng thành công':
      return 'successDelivery';
    case 'Xác nhận thanh toán và hồ sơ':
      return 'paymentConfirmation';
    case 'Đang thanh toán':
      return 'paid';
    case 'Đơn hàng hoàn thành':
      return 'done';
    default:
      return '';
  }
};
