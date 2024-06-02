/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { formatNumberWithCommas, fVietNamCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

QuotationTableRow.propTypes = {
  order: PropTypes.object,
  index: PropTypes.number,
  row: PropTypes.object,
};

export default function QuotationTableRow({ order, index, row }) {
  const { itemGroupList } = order;
  return (
    <>
      {itemGroupList.length > 1 && (
        <TableRow
          sx={{
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <TableCell>
            <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
              {`H${index + 1}`}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Box sx={{ maxWidth: 560 }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                {row?.name}
              </Typography>
            </Box>
          </TableCell>
          <TableCell align="left" />
          <TableCell align="right" />
          <TableCell align="right" />
        </TableRow>
      )}

      {row?.orderDetailList?.map((orderDetail, idx) => (
        <TableRow
          key={index.toString() + idx}
          sx={{
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <TableCell>{idx + 1}</TableCell>
          <TableCell align="left">
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant="subtitle2">{orderDetail?.product?.name}</Typography>
            </Box>
          </TableCell>
          <TableCell align="left">{orderDetail.quantity}</TableCell>
          <TableCell align="left">
            {orderDetail?.weightProduct ? formatNumberWithCommas(orderDetail?.weightProduct) : 0}
          </TableCell>
          <TableCell align="right">{fVietNamCurrency(Number(orderDetail.priceProduct)) || 0}</TableCell>
          <TableCell align="right">
            {fVietNamCurrency(
              Number(orderDetail.priceProduct) * Number(orderDetail.quantity) * Number(orderDetail?.weightProduct)
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
