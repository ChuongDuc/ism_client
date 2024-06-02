// noinspection DuplicatedCode,JSUnresolvedFunction
// noinspection JSUnresolvedFunction

import PropTypes from 'prop-types';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import uniqBy from 'lodash/uniqBy';
import { convertStringToNumber, fVietNamCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------
QuotationSummary.propTypes = {
  freightPrice: PropTypes.number,
};

export default function QuotationSummary({ freightPrice = 0 }) {
  const { watch } = useFormContext();
  const values = watch();
  let amountProduct = 0;
  let totalQuantity = 0;
  let productTotalPrice = 0;

  if (values.categories.length < 1) {
    if (values.products.length < 0) {
      totalQuantity = 0;
      productTotalPrice = 0;
      amountProduct = 0;
    } else {
      amountProduct = values.products.length;
      totalQuantity = values.products.reduce(
        (counter, pro) => (pro?.quantity && Number(pro?.quantity) > 0 ? counter + Number(pro.quantity) : counter),
        0
      );
      productTotalPrice = values.products.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct)
            ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
    }
  } else if (values.products.length > 0) {
    const products = [];
    values.categories.forEach((category) => {
      products.push(...category.orderDetailList);
      const x = category.orderDetailList.reduce(
        (counter, pro) => (pro?.quantity && Number(pro?.quantity) > 0 ? counter + Number(pro.quantity) : counter),
        0
      );
      const y = category.orderDetailList.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct)
            ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
      totalQuantity += x;
      productTotalPrice += y;
    });
    amountProduct = uniqBy(products, 'id').length;
  }

  const orderTotalMoney = productTotalPrice + convertStringToNumber(freightPrice);

  return (
    <Card sx={{ mb: 1, paddingX: 0.5, height: '90%' }}>
      <CardContent>
        <Stack spacing={1.1}>
          <Typography variant="body2">Tổng số sản phẩm: {amountProduct}</Typography>
          <Typography variant="body2">Tổng số lượng: {totalQuantity}</Typography>
          <Typography variant="body2">{`Tổng số: ${fVietNamCurrency(productTotalPrice)} VNĐ`}</Typography>
          <Typography variant="body2">{`Phí vận chuyển: ${fVietNamCurrency(
            convertStringToNumber(freightPrice)
          )} VNĐ`}</Typography>

          <Divider />
          <Typography variant="subtitle2" fontWeight={900}>{`Tổng đơn hàng: ${fVietNamCurrency(
            convertStringToNumber(orderTotalMoney)
          )} VNĐ`}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
