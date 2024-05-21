// noinspection UnnecessaryLocalVariableJS

import numeral from 'numeral';
import { encodeFileNameToUtf8 } from '../constant';
import { convertStringToNumber } from './formatNumber';

export const getWeekOfMonth = (date) => {
  const newDate = new Date(date);
  const adjustedDate = newDate.getDate() - 1 - newDate.getDay();
  const prefixes = [0, 1, 2, 3, 4, 5];
  return prefixes[Math.ceil(adjustedDate / 7 + 1)];
};

export const getDatesOfWeek = (weekNumber, month, year) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const offset = 7 - dayOfWeek;
  const startOfWeek = new Date(firstDayOfMonth.getTime() + (offset + (weekNumber - 2) * 7) * 24 * 60 * 60 * 1000);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  const dates = [];
  for (let i = startOfWeek; i <= endOfWeek; i.setDate(i.getDate() + 1)) {
    dates.push(new Date(i));
  }
  return dates;
};

export const getFirstDayLastDayOfNextMonth = (numOfMonths, startDate = new Date()) => {
  const tmp = new Date(startDate);
  tmp.setMonth(tmp.getMonth() + numOfMonths);
  const firstDay = new Date(tmp.getFullYear(), tmp.getMonth(), 1);
  const lastDay = new Date(tmp.getFullYear(), tmp.getMonth() + 1, 0);
  return { firstDay, lastDay };
};

export const getMonth = (date) => {
  const newDate = new Date(date);
  const adjustedDate = newDate.getMonth();
  const prefixes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return prefixes[adjustedDate];
};

export const handleNumberInputChange = (input) => {
  const newValue = input.replace(/^[0]+/g, '').replace(/[^\d.]/g, '');
  const pointData = newValue.indexOf('.');
  if (pointData !== -1 && newValue.indexOf('.', pointData + 1) !== -1) {
    return newValue.slice(0, -1);
  }
  return newValue;
};

export const handleNumberInputChangeToCurrency = (input) => {
  const newValue = input.replace(/^[0]+/g, '');
  return numeral(newValue).format(Number.isInteger(newValue) ? '0,0' : '0,0');
};

export const downloadFileWithURL = (event, name) => {
  fetch(`${event}`).then((response) => {
    response.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = encodeFileNameToUtf8(name);
      a.click();
    });
  });
  window.open(`${event}`);
};

export const filterData = (img, type) => {
  if (type.includes('image')) {
    return img;
  }
  if (type.includes('pdf')) {
    return '/static/PDF.png';
  }
  return '/static/DOCUMENT.png';
};

export const filterImgData = (img, type) => {
  if (type.includes('image')) {
    return img;
  }
  if (type.includes('pdf')) {
    return '/assets/icons/files/ic_pdf.svg';
  }
  return '/assets/icons/files/ic_video.svg';
};

export const getSheetData = (data) => {
  if (data === null || data === undefined || data.length < 1) {
    return [[]];
  }
  return data.map((row) => (row ? Object.values(row) : ''));
};

export const convertDataFormExcel = (invoice, values, isEdit, isCreate, userValue) => {
  const {
    // customer,
    freightPrice,
    sale,
    paymentList,
    itemGroupList,
    totalMoney,
    totalMoneyByUnit,
    executionTimeDescription,
    deliveryMethodDescription,
    createdAt,
    deliverAddress,
    VAT,
    reportingValidityAmount,
    percentOfAdvancePayment,
    noteOfOtherMoney,
    otherMoney,
    // updatedAt,
    shippingTax,
  } = invoice;

  let itemGroupListPdf = [];
  if (values && isEdit === true) {
    if (isCreate === false) {
      if (values && itemGroupList.length <= 1) {
        itemGroupListPdf = values?.categories;
      } else if (values && itemGroupList.length > 1) {
        itemGroupListPdf = values?.categories;
      }
    } else if (isCreate === true) {
      if (values && values?.categories.length > 0) {
        itemGroupListPdf = values?.categories;
      } else if (values && values?.products.length > 0) {
        itemGroupListPdf = values?.products;
      }
    }
  } else {
    itemGroupListPdf = itemGroupList;
  }

  // Tổng số lượng
  let totalQuantity = 0;
  if (isEdit === true) {
    if (values?.categories.length < 1) {
      if (values?.products.length < 0) {
        totalQuantity = 0;
      } else {
        totalQuantity = values?.products?.reduce(
          (total, data) => (data?.quantity && Number(data?.quantity) > 0 ? total + Number(data?.quantity) : total),
          0
        );
      }
    } else if (values?.categories.length >= 1) {
      values?.categories?.forEach((category) => {
        const y = category?.orderDetailList?.reduce(
          (total, data) => (data?.quantity && Number(data?.quantity) > 0 ? total + Number(data?.quantity) : total),
          0
        );
        totalQuantity += y;
      });
    }
  } else if (itemGroupList && itemGroupList.length < 1) {
    totalQuantity = 0;
  } else if (itemGroupList) {
    totalQuantity = itemGroupList.reduce(
      (total, data) => total + data.orderDetailList.reduce((total, orderDetail) => total + orderDetail.quantity, 0),
      0
    );
  }

  // Tổng trọng
  let totalWeight = 0;
  if (isEdit === true) {
    if (values?.categories.length < 1) {
      if (values?.products.length < 1) {
        totalWeight = 0;
      } else {
        totalWeight = values?.products
          ?.filter((product) => Number(product.weightProduct) !== 1 || Number(product.product?.weight) !== 1)
          .reduce(
            (total, data) =>
              data?.quantity &&
              convertStringToNumber(data?.priceProduct) > 0 &&
              Number(data?.weightProduct) &&
              data?.weightProduct
                ? total +
                  (data?.totalWeight ? Number(data?.totalWeight) : Number(data?.quantity) * Number(data?.weightProduct))
                : total,
            0
          );
      }
    } else if (values?.categories.length >= 1) {
      values?.categories?.forEach((category) => {
        const y = category?.orderDetailList
          ?.filter((product) => Number(product.weightProduct) !== 1 || Number(product.product?.weight) !== 1)
          .reduce(
            (total, data) =>
              data?.priceProduct &&
              data?.quantity &&
              convertStringToNumber(data?.priceProduct) > 0 &&
              Number(data?.quantity) > 0 &&
              data?.weightProduct &&
              Number(data?.weightProduct)
                ? total +
                  (data?.totalWeight ? Number(data?.totalWeight) : Number(data?.quantity) * Number(data?.weightProduct))
                : total,
            0
          );
        totalWeight += y;
      });
    }
  } else if (itemGroupList) {
    totalWeight = itemGroupList.reduce(
      (total, data) =>
        total +
        data.orderDetailList
          .filter((product) => Number(product.weightProduct) !== 1 || Number(product.product?.weight) !== 1)
          .reduce((total, orderDetail) => total + Number(orderDetail?.totalWeight), 0),
      0
    );
  }
  // User
  let saleCreate = {};
  if (isCreate === true) {
    saleCreate = userValue;
  } else {
    saleCreate = sale;
  }

  // Đơn giá đơn trọng
  let productPriceWeight = 0;
  if (isEdit === true) {
    if (values?.categories.length < 1) {
      if (values?.products.length < 0) {
        productPriceWeight = 0;
      } else {
        productPriceWeight = values?.products?.reduce(
          (total, data) =>
            data?.priceProduct &&
            convertStringToNumber(data?.priceProduct) > 0 &&
            data?.product.weight &&
            Number(data?.product.weight)
              ? total + convertStringToNumber(data?.priceProduct) * Number(data?.product.weight)
              : total,
          0
        );
      }
    } else if (values?.categories.length >= 1) {
      values?.categories?.forEach((category) => {
        const y = category?.orderDetailList?.reduce(
          (total, data) =>
            data?.priceProduct &&
            convertStringToNumber(data?.priceProduct) > 0 &&
            data?.product.weight &&
            Number(data?.product.weight)
              ? total + convertStringToNumber(data?.priceProduct) * Number(data?.product.weight)
              : total,
          0
        );
        productPriceWeight += y;
      });
    }
  } else if (itemGroupList) {
    productPriceWeight = itemGroupList.reduce(
      (total, category) =>
        total +
        category?.orderDetailList?.reduce(
          (total, data) => total + Number(data?.product?.price) * Number(data?.product?.weight),
          0
        ),
      0
    );
  }

  // Thành tiền
  let productTotalPrice = 0;
  let productTotalPriceByUnit = 0;
  if (isEdit === true) {
    if (values?.categories.length < 1) {
      if (values?.products.length < 0) {
        productTotalPrice = 0;
        productTotalPriceByUnit = 0;
      } else {
        productTotalPrice = values?.products?.reduce(
          (total, data) =>
            data?.priceProduct &&
            data?.quantity &&
            convertStringToNumber(data?.priceProduct) > 0 &&
            data?.weightProduct &&
            Number(data?.weightProduct)
              ? total +
                convertStringToNumber(data?.priceProduct) *
                  (data?.totalWeight && data?.weightProduct !== 1
                    ? Number(data?.totalWeight)
                    : Number(data?.quantity) * Number(data?.weightProduct))
              : total,
          0
        );
        productTotalPriceByUnit = values?.products?.reduce(
          (total, data) =>
            data?.priceProduct &&
            data?.quantity &&
            convertStringToNumber(data?.priceProduct) > 0 &&
            Number(data?.quantity) > 0 &&
            data?.weightProduct &&
            Number(data?.weightProduct)
              ? total +
                Number(data?.quantity) *
                  Math.round(convertStringToNumber(data?.priceProduct) * Number(data?.weightProduct))
              : total,
          0
        );
      }
    } else if (values?.categories.length >= 1) {
      values?.categories?.forEach((category) => {
        const y = category?.orderDetailList?.reduce(
          (total, data) =>
            data?.priceProduct &&
            convertStringToNumber(data?.priceProduct) > 0 &&
            data?.totalWeight &&
            Number(data?.totalWeight)
              ? total +
                convertStringToNumber(data?.priceProduct) *
                  (data?.totalWeight && data?.weightProduct !== 1
                    ? Number(data?.totalWeight)
                    : Number(data?.quantity) * Number(data?.weightProduct))
              : total,
          0
        );
        const yByUnit = category?.orderDetailList?.reduce(
          (total, data) =>
            data?.priceProduct &&
            data?.quantity &&
            convertStringToNumber(data?.priceProduct) > 0 &&
            Number(data?.quantity) > 0 &&
            data?.weightProduct &&
            Number(data?.weightProduct)
              ? total +
                Number(data?.quantity) *
                  Math.round(convertStringToNumber(data?.priceProduct) * Number(data?.weightProduct))
              : total,
          0
        );
        productTotalPrice += y;
        productTotalPriceByUnit += yByUnit;
      });
    }
  } else {
    productTotalPrice = totalMoney;
    productTotalPriceByUnit = totalMoneyByUnit;
  }

  let totalPayment = 0;
  if (isCreate === true) {
    totalPayment = 0;
  } else if (paymentList.length > 0) {
    totalPayment = paymentList?.map((payment) => payment?.money).reduce((total, money) => total + money);
  }
  // updateAt
  let updatedAtValues = '';
  if (createdAt) {
    updatedAtValues = createdAt;
  } else {
    updatedAtValues = new Date();
  }

  let vatProductTotalPrice = 0;
  let vatProductTotalPriceByUnit = 0;
  // Số phí vận chuyển
  let shippingTaxValues = 0;
  let deliverAddressValues = '';
  let totalShippingTax = 0;
  let totalAllTable = 0;
  let totalAllTableByUnit = 0;
  let freightPriceValues = 0;
  let paymentLeft = 0;
  let paymentLeftByUnit = 0;
  let VATValues = 0;
  let percentOfAdvancePaymentValues = 0;
  let executionTimeDescriptionValues = '';
  let deliveryMethodDescriptionValues = '';
  let reportingValidityAmountValues = '';
  let noteOfOtherMoneyValues = 0;
  let otherMoneyValues = 0;

  if (isEdit) {
    otherMoneyValues = values?.otherMoney;
    noteOfOtherMoneyValues = values?.noteOfOtherMoney;
    VATValues = values?.vat;
    percentOfAdvancePaymentValues = values?.pay;
    executionTimeDescriptionValues = values?.executionTime;
    deliveryMethodDescriptionValues = values?.deliveryMethod;
    reportingValidityAmountValues = values?.reportingValidity;
    freightPriceValues = convertStringToNumber(values?.freightPrice);
    vatProductTotalPrice = (productTotalPrice * values?.vat) / 100;
    vatProductTotalPriceByUnit = (productTotalPriceByUnit * values?.vat) / 100;
    shippingTaxValues = convertStringToNumber(values?.shippingTax);
    deliverAddressValues = values?.deliverAddress;
    totalShippingTax = convertStringToNumber(freightPriceValues) + (freightPriceValues * shippingTaxValues) / 100;
    totalAllTable = productTotalPrice + totalShippingTax + vatProductTotalPrice;
    totalAllTableByUnit = productTotalPriceByUnit + totalShippingTax + vatProductTotalPriceByUnit;
    if (totalPayment > 0 && values) {
      paymentLeft = Math.abs(Number(totalPayment) - Number(totalAllTable));
      paymentLeftByUnit = Math.abs(Number(totalPayment) - Number(totalAllTableByUnit));
    }
  } else {
    otherMoneyValues = otherMoney;
    noteOfOtherMoneyValues = noteOfOtherMoney;
    VATValues = VAT;
    percentOfAdvancePaymentValues = percentOfAdvancePayment;
    executionTimeDescriptionValues = executionTimeDescription;
    deliveryMethodDescriptionValues = deliveryMethodDescription;
    reportingValidityAmountValues = reportingValidityAmount;
    freightPriceValues = freightPrice;
    vatProductTotalPrice = (totalMoney * VAT) / 100;
    vatProductTotalPriceByUnit = (totalMoneyByUnit * VAT) / 100;
    shippingTaxValues = shippingTax;
    deliverAddressValues = deliverAddress;
    totalShippingTax = Number(freightPriceValues + (freightPriceValues * shippingTaxValues) / 100);
    totalAllTable = productTotalPrice + totalShippingTax + vatProductTotalPrice;
    totalAllTableByUnit = productTotalPriceByUnit + totalShippingTax + vatProductTotalPriceByUnit;
    if (totalPayment > 0 && !values) {
      paymentLeft = Math.abs(Number(totalPayment) - Number(totalAllTable));
      paymentLeftByUnit = Math.abs(Number(totalPayment) - Number(totalAllTableByUnit));
    }
  }

  return {
    itemGroupListPdf,
    VATValues,
    percentOfAdvancePaymentValues,
    executionTimeDescriptionValues,
    deliveryMethodDescriptionValues,
    reportingValidityAmountValues,
    totalQuantity,
    totalWeight,
    saleCreate,
    productPriceWeight,
    productTotalPrice,
    productTotalPriceByUnit,
    vatProductTotalPrice,
    vatProductTotalPriceByUnit,
    shippingTaxValues,
    deliverAddressValues,
    totalShippingTax,
    totalAllTable,
    totalAllTableByUnit,
    paymentLeft,
    paymentLeftByUnit,
    totalPayment,
    updatedAtValues,
    noteOfOtherMoneyValues,
    otherMoneyValues,
  };
};

// Debounce utility function
export const ssmDebounce = (func, delay) => {
  let timeoutId;
  const result = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
  return result;
};
