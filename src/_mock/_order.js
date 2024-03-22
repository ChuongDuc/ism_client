// noinspection JSCheckFunctionSignatures

import { add } from 'date-fns';
import { sampleSize } from 'lodash';
import _mock from './_mock';
import { randomInArray } from './funcs';
import { DeliveryStatus, onlyDriverUserList, OrderStatus, OrderStatusArr, saleUserList } from '../constant';
import { _customerList } from './_customer';
import { products } from '../_apis_/products';

// ----------------------------------------------------------------------
export const _deliveryPapers = [...Array(5)].map((_, index) => ({
  id: index + 1,
  name: _mock.papers.name(index),
  file: _mock.papers.file(index),
}));

export const getDeliveryPaperByStatus = (orderStatus) => {
  switch (orderStatus) {
    case OrderStatus.new:
      return [];
    case OrderStatus.quotationAndDeal:
      return [];
    case OrderStatus.newDeliverExport:
      return _deliveryPapers.slice(0, 2);
    case OrderStatus.inProgress:
      return _deliveryPapers.slice(0, 4);
    case OrderStatus.deliverSuccess:
      return _deliveryPapers.slice(0, 4);
    case OrderStatus.confirmByAccProcessing:
      return _deliveryPapers.slice(0, 4);
    case OrderStatus.paid:
      return _deliveryPapers.slice(0, 3);
    case OrderStatus.completed:
      return _deliveryPapers;
    default:
      return [];
  }
};

export const genDeliveryStatus = (orderStatus) => {
  switch (orderStatus) {
    case OrderStatus.new:
      return null;
    case OrderStatus.quotationAndDeal:
      return null;
    case OrderStatus.newDeliverExport:
      return DeliveryStatus.new;
    case OrderStatus.inProgress:
      return DeliveryStatus.inProgress;
    case OrderStatus.deliverSuccess:
      return DeliveryStatus.deliverySuccess;
    case OrderStatus.confirmByAccProcessing:
      return DeliveryStatus.confirmByAccProcessing;
    case OrderStatus.completed:
      return DeliveryStatus.completed;
    default:
      return null;
  }
};

const setTotalPriceOrder = (orderStatus, orderProducts, freightPrice) => {
  if (orderStatus === OrderStatus.new) {
    return 0;
  }
  let totalPriceOrder = orderProducts
    ? orderProducts.reduce(
        (total, data) =>
          data?.price && data?.weight && Number(data?.price) > 0 && Number(data?.weight) > 0
            ? total + Number(data?.price) * Number(data?.weight) * Number(data?.quantity)
            : total + 0,
        0
      )
    : 0;
  totalPriceOrder = freightPrice ? totalPriceOrder + freightPrice : totalPriceOrder;
  return totalPriceOrder;
};

export const _orders = [...Array(20)].map((_, index) => {
  const tmpProducts = sampleSize(products, 5).map((pr) => ({ ...pr, quantity: randomInArray([1, 2, 3, 4, 5, 6, 7]) }));
  const tmpFreightPrice = randomInArray([1000000, 2000000, 3000000, 1500000, 2500000, 3500000]);
  return {
    id: _mock.id(index),
    invoiceNumber: `INV-${17048 + index}`,
    taxes: 8,
    discount: 0,
    totalPrice: setTotalPriceOrder(OrderStatusArr[index % OrderStatusArr.length], tmpProducts, tmpFreightPrice),
    createDate: add(new Date(), { days: -(index % 5), hours: 0 }),
    status: OrderStatusArr[index % OrderStatusArr.length],
    sale: saleUserList[index % 5],
    driver:
      // eslint-disable-next-line no-nested-ternary
      OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.new ||
      OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.quotationAndDeal
        ? null
        : OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.newDeliverExport && index % 3 === 1
        ? null
        : onlyDriverUserList[index % onlyDriverUserList.length],
    customer: _customerList[index % 18],
    freightPrice: OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.new ? null : tmpFreightPrice,
    products: OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.new ? null : tmpProducts,
    deliverOrder:
      OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.new ||
      OrderStatusArr[index % OrderStatusArr.length] === OrderStatus.quotationAndDeal
        ? null
        : {
            id: index + 1,
            customer: _customerList[index % 18],
            customerDescription: 'Đặc điểm của khách hàng',
            papers: getDeliveryPaperByStatus(OrderStatusArr[index % OrderStatusArr.length]),
            deliveryDate: add(new Date(), { days: -(index % 5) + 7, hours: 0 }),
            status: genDeliveryStatus(OrderStatusArr[index % OrderStatusArr.length]),
          },
  };
});

export const _invoiceAddressFrom = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  address: _mock.address.fullAddress(index),
  company: _mock.company(index),
  email: _mock.email(index),
  phone: _mock.phoneNumber(index),
}));

export const _invoiceAddressTo = [...Array(16)].map((_, index) => ({
  id: _mock.id(index + 1),
  name: _mock.name.fullName(index + 1),
  address: _mock.address.fullAddress(index + 1),
  company: _mock.company(index + 1),
  email: _mock.email(index + 1),
  phone: _mock.phoneNumber(index + 1),
}));
