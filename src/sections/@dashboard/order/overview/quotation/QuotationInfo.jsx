// noinspection DuplicatedCode

import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { orderPropTypes } from '../../../../../constant';
import InvoiceToolbar from '../../details/InvoiceToolbar';
import Scrollbar from '../../../../../components/Scrollbar';
import { fVietNamCurrency } from '../../../../../utils/formatNumber';
import Iconify from '../../../../../components/Iconify';
import QuotationNewEditForm from './create-edit';
import useToggle from '../../../../../hooks/useToggle';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

QuotationInfo.propTypes = {
  order: orderPropTypes().isRequired,
};

export default function QuotationInfo({ order }) {
  const { toggle: openCreateQuotation, onOpen: onOpenCreateQuotation, onClose: onCloseCreateQuotation } = useToggle();
  if (!order) {
    return null;
  }

  const { products, customer, freightPrice, sale, invoiceNumber, totalPrice } = order;

  if (!products || products.length <= 0) {
    return (
      <>
        <Card sx={{ pt: 3, px: 5, minHeight: 100 }}>
          <Stack direction="row" justifyContent={'space-around'} alignContent={'center'}>
            {openCreateQuotation ? (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                sx={{ minWidth: 115 }}
                onClick={onCloseCreateQuotation}
                startIcon={<Iconify icon={'mdi:marker-cancel'} />}
              >
                Hủy
              </Button>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                sx={{ minWidth: 115 }}
                onClick={onOpenCreateQuotation}
                startIcon={<Iconify icon={'ic:twotone-border-color'} />}
              >
                Tạo báo giá
              </Button>
            )}
            <Typography variant="h4">Chưa có báo giá</Typography>
          </Stack>
        </Card>
        {openCreateQuotation && (
          <Card sx={{ mt: 3 }}>
            <QuotationNewEditForm
              currentProducts={products}
              isEdit={false}
              customer={customer}
              freightPrice={freightPrice}
            />
          </Card>
        )}
      </>
    );
  }
  return (
    <>
      <InvoiceToolbar invoice={order} />

      <Card sx={{ pt: 3, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sx={{ mb: 0 }}>
            <Box sx={{ textAlign: { xs: 'right' } }}>
              <Typography variant="h6">{`Mã báo giá: ${invoiceNumber}`}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Nhân viên kinh doanh
            </Typography>
            <Typography variant="body1" fontWeight={'bold'}>{`Họ tên: ${sale.displayName}`}</Typography>
            <Typography variant="body2">Điện thoại: {sale.phone}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Khách hàng
            </Typography>
            <Typography variant="body1" fontWeight={'bold'} textTransform={'uppercase'}>
              {customer.name}
            </Typography>
            <Typography variant="body2">Điện thoại: {customer.phoneNumber}</Typography>
            <Typography variant="body2">{`Đơn vị: ${customer.company.companyName}`}</Typography>
            <Typography variant="body2">{`Địa chỉ: ${customer.company.address}`}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Sản phẩm</TableCell>
                  <TableCell align="left">Số lượng</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="right">Tổng</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products &&
                  products.length > 0 &&
                  products.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="left">
                        <Box sx={{ maxWidth: 560 }}>
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left">{row.quantity}</TableCell>
                      <TableCell align="right">{fVietNamCurrency(Number(row.price) * Number(row.weight))}</TableCell>
                      <TableCell align="right">
                        {fVietNamCurrency(Number(row.price) * Number(row.weight) * Number(row.quantity))}
                      </TableCell>
                    </TableRow>
                  ))}
                {freightPrice && (
                  <TableRow
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{products.length + 1}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">Cước vận chuyển</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left" />
                    <TableCell align="right">{fVietNamCurrency(Number(freightPrice))}</TableCell>
                    <TableCell align="right">{fVietNamCurrency(Number(freightPrice))}</TableCell>
                  </TableRow>
                )}

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">Tổng đơn hàng</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fVietNamCurrency(totalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 2 }}>
            <Typography variant="subtitle2">BÁO GIÁ TRÊN</Typography>
            <Typography variant="body2">Đã bao gồm 10% thuế VAT</Typography>
            <Typography variant="body2">Giao theo bazem nhà máy</Typography>
            <Typography variant="body2">Báo giá có hiệu lực 3 ngày</Typography>
            <Typography variant="body2">Thời gian thực hiện: 1-2 ngày</Typography>
            <Typography variant="body2">Thanh toán 100% đơn hàng ngay khi đặt hàng</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 2, textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="subtitle2">NGƯỜI PHỤ TRÁCH</Typography>
            <Typography variant="body2">{`${sale.displayName}`}</Typography>
            <Typography variant="body2">{`${sale.phone}`}</Typography>
            <Typography variant="body2">{`${sale.email}`}</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
