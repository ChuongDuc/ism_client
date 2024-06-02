/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Box, TableCell, TableRow, Typography } from '@mui/material';

// ----------------------------------------------------------------------

DeliverOrderTableRow.propTypes = {
  order: PropTypes.object,
  index: PropTypes.number,
  row: PropTypes.object,
};

export default function DeliverOrderTableRow({ order, index, row }) {
  const { itemGroupList } = order;
  return (
    <>
      {itemGroupList.length > 1 && (
        <TableRow
          sx={{
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <TableCell>{`H${index + 1}`}</TableCell>
          <TableCell align="left">
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant="subtitle2">{row?.name}</Typography>
            </Box>
          </TableCell>
          <TableCell align="left" />
          <TableCell align="right" />
          <TableCell align="right" />
        </TableRow>
      )}

      {row?.orderDetailList?.map((orderDetail, idx) => (
        <TableRow
          key={idx}
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
          <TableCell align="left">{}</TableCell>
          <TableCell align="left">{orderDetail.quantity}</TableCell>
          <TableCell align="left">{orderDetail?.weightProduct}</TableCell>
          <TableCell align="left">{(orderDetail.quantity * orderDetail?.weightProduct).toFixed(2)}</TableCell>
          <TableCell align="left">{}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
