/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Box, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { RHFTextField } from '../../../../../components/hook-form';
import { formatNumberWithCommas } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

DeliverOrderDetailTableRow.propTypes = {
  itemGroupList: PropTypes.array,
  index: PropTypes.number,
  row: PropTypes.object,
  formMethod: PropTypes.object,
  isSalePermission: PropTypes.bool,
};

export default function DeliverOrderDetailTableRow({ itemGroupList, index, row, formMethod, isSalePermission }) {
  const { setValue } = formMethod;

  return (
    <>
      {itemGroupList.length > 1 && (
        <TableRow>
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

      {row?.orderDetailList?.map((products, idx) => (
        <TableRow key={idx}>
          <TableCell>{idx + 1}</TableCell>
          <TableCell align="left" sx={{ maxWidth: 200 }}>
            <Typography variant="subtitle2">{products?.product?.name}</Typography>
          </TableCell>
          <TableCell align="left">
            <Stack direction="row">
              <RHFTextField
                disabled={!isSalePermission}
                size="small"
                name={`itemGroupList[${index}].orderDetailList[${idx}].deliveryMethodNote`}
                value={
                  itemGroupList[index].orderDetailList[idx].deliveryMethodNote
                    ? itemGroupList[index].orderDetailList[idx].deliveryMethodNote
                    : ''
                }
              />
            </Stack>
          </TableCell>
          <TableCell align="left">{products?.quantity}</TableCell>
          <TableCell align="left">
            {products?.weightProduct ? formatNumberWithCommas(products?.weightProduct) : 0}
          </TableCell>
          <TableCell align="left">
            {products?.weightProduct ? formatNumberWithCommas(products?.quantity * products?.weightProduct) : 0}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
