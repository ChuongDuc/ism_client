import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import Scrollbar from '../../../../../components/Scrollbar';
import { convertStringToNumber, fVietNamCurrency } from '../../../../../utils/formatNumber';
import { FormProvider, RHFTextField } from '../../../../../components/hook-form';
import useAuth from '../../../../../hooks/useAuth';
import Iconify from '../../../../../components/Iconify';
import RHFCurrencyField from '../../../../../components/hook-form/RHFCurrencyField';
import { Role } from '../../../../../constant';
import QuotationTableRow from './QuotationTableRow';

// ----------------------------------------------------------------------
const CREATE_PAYMENT_INFO = loader('../../../../../graphql/mutations/paymentInfor/createPaymentInfo.graphql');
const UPDATE_PAYMENT_INFO = loader('../../../../../graphql/mutations/paymentInfor/updatePaymentInfo.graphql');
const DELETE_PAYMENT_INFO = loader('../../../../../graphql/mutations/paymentInfor/deletePaymentInfo.graphql');

// ----------------------------------------------------------------------

QuotationCardTmp.propTypes = {
  order: PropTypes.object,
  isPaid: PropTypes.bool,
  handleClosePaid: PropTypes.func,
  refetchData: PropTypes.func,
};

export default function QuotationCardTmp({ order, isPaid, handleClosePaid, refetchData }) {
  const {
    id,
    customer,
    freightPrice,
    sale,
    invoiceNo,
    totalMoney,
    paymentList,
    itemGroupList,
    // deliverAddress,
    VAT,
  } = order;

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);

  const [totalPayment, setTotalPayment] = useState(0);

  const [paymentLeft, setPaymentLeft] = useState(0);

  const [selectedPayment, setSelectedPayment] = useState({});

  const [createPayment] = useMutation(CREATE_PAYMENT_INFO, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const NewPaidInformation = Yup.object().shape({
    description: Yup.string().required('Nhập nội dung thanh toán'),
    money: Yup.string().required('Nhập tiền thanh toán thanh toán'),
  });

  const defaultValues = useMemo(
    () => ({
      description: '',
      money: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (paymentList.length > 0) {
      setTotalPayment(paymentList?.map((payment) => payment.money).reduce((total, money) => total + money));
    }
  }, [paymentList]);

  useEffect(() => {
    if (totalPayment > 0) {
      setPaymentLeft(
        Math.abs(Number(totalPayment) - Number(totalMoney) - Number(freightPrice) - Number((totalMoney * VAT) / 100))
      );
    }
  }, [totalPayment, totalMoney, freightPrice, VAT]);

  const methods = useForm({
    resolver: yupResolver(NewPaidInformation),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (order) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (!isPaid) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit = async () => {
    try {
      const response = await createPayment({
        variables: {
          input: {
            createById: Number(user.id),
            customerId: Number(customer?.id),
            orderId: Number(id),
            money: convertStringToNumber(values.money),
            description: values.description || null,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Tạo thanh toán không thành công. ${error}`, {
            variant: 'error',
          });
        },
      });
      if (!response.errors) {
        enqueueSnackbar('Tạo thanh toán thành công', {
          variant: 'success',
        });
        reset();
        handleClosePaid();
        await refetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {itemGroupList && itemGroupList.length > 0 && (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ pt: 2, px: 0.5 }}>
            <Grid container justifyContent="space-around" px={3} alignItems="start" justifyItems="stretch">
              <Grid item xs={12} md={4} sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  Khách hàng
                </Typography>
                <Typography variant="body2" fontWeight={'bold'} textTransform={'uppercase'} pt={1}>
                  {customer?.name}
                </Typography>
                <Typography variant="body2" pt={1}>
                  Điện thoại: {customer?.phoneNumber}
                </Typography>
                <Typography variant="body2" pt={1}>
                  {customer?.company ? `Đơn vị: ${customer?.company}` : ''}
                </Typography>
                <Typography variant="body2" pt={1}>
                  {`Địa chỉ giao hàng: ${order?.deliverAddress ?? ''}`}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  Nhân viên kinh doanh
                </Typography>
                <Typography variant="body2" pt={1} fontWeight={'bold'}>{`Họ tên: ${sale?.fullName}`}</Typography>
                <Typography variant="body2" pt={1}>
                  Điện thoại: {sale?.phoneNumber}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  BÁO GIÁ TRÊN
                </Typography>
                <Typography variant="body2" pt={1}>{`Đã bao gồm ${order?.VAT}% thuế VAT`}</Typography>
                <Typography variant="body2" pt={1}>{`Phương thức giao hàng ${
                  order?.deliveryMethodDescription || ''
                }`}</Typography>
                <Typography
                  variant="body2"
                  pt={1}
                >{`Báo giá có hiệu lực ${order?.reportingValidityAmount} ngày`}</Typography>
                <Typography variant="body2" pt={1}>{`Thời gian thực hiện ${
                  order?.executionTimeDescription || ''
                }`}</Typography>
                <Typography
                  variant="body2"
                  pt={1}
                >{`Thanh toán ${order?.percentOfAdvancePayment}% đơn hàng ngay khi đặt hàng`}</Typography>
              </Grid>

              <Grid item xs={12} sx={{ mb: 0 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={900} variant="subtitle1">{`Mã báo giá: ${invoiceNo.slice(
                      0,
                      17
                    )}`}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight={900} variant="subtitle1">
                      Tổng đơn hàng:{' '}
                      {fVietNamCurrency(Number(totalMoney) + Number(freightPrice) + Number((totalMoney * VAT) / 100))}{' '}
                      VNĐ
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 960 }}>
                <Table size="small">
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
                      <TableCell align="left">Đơn trọng</TableCell>
                      <TableCell align="right">Giá</TableCell>
                      <TableCell align="right">Tổng</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {itemGroupList &&
                      itemGroupList.length > 0 &&
                      itemGroupList.map((row, index) => (
                        <QuotationTableRow row={row} index={index} order={order} key={index} />
                      ))}
                    {itemGroupList.length > 1 ? (
                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                            {`H${itemGroupList.length + 1}`}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 560 }}>
                            <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                              Cước vận chuyển
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left" />
                        <TableCell align="left" />
                        <TableCell align="right">{fVietNamCurrency(Number(freightPrice))}</TableCell>
                        <TableCell align="right">{fVietNamCurrency(Number(freightPrice))}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell>{itemGroupList[0]?.orderDetailList.length + 1}</TableCell>
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 560 }}>
                            <Typography variant="subtitle2">Cước vận chuyển</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left" />
                        <TableCell align="left" />
                        <TableCell align="right">{fVietNamCurrency(Number(freightPrice))}</TableCell>
                        <TableCell align="right">{fVietNamCurrency(Number(freightPrice))}</TableCell>
                      </TableRow>
                    )}

                    {paymentList?.length > 0 && (
                      <>
                        <TableRow
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                          }}
                        >
                          <TableCell>{`#`}</TableCell>
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 560 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                Thông tin thanh toán
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="left" />
                          <TableCell align="right" />
                          <TableCell align="right" />
                        </TableRow>

                        {paymentList?.map((payment, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="left" colSpan={2}>
                              <Box sx={{ maxWidth: 560 }}>
                                <Typography variant="subtitle2">{payment?.description}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right" />
                            <TableCell align="right">
                              <Typography variant="subtitle1">{fVietNamCurrency(Number(payment?.money))}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="text"
                                disabled={user.role !== Role.accountant && user.role !== Role.sales}
                                color="error"
                                startIcon={<Iconify icon="mdi:clipboard-edit-outline" />}
                                onClick={() => {
                                  handleOpenDialog();
                                  setSelectedPayment(payment);
                                }}
                              >
                                Chỉnh sửa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {isPaid && (
                      <TableRow
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell />
                        <TableCell align="left" colSpan={3}>
                          <RHFTextField
                            name="description"
                            InputLabelProps={{ shrink: true }}
                            label="Nội dung thanh toán"
                            // multiline
                            // rows={4}
                          />
                        </TableCell>

                        <TableCell align="right" colSpan={2}>
                          <RHFCurrencyField
                            name="money"
                            label="Tiền thanh toán"
                            value={fVietNamCurrency(values.money)}
                            InputProps={{
                              endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                            }}
                            setValue={setValue}
                            InputLabelProps={{ shrink: true }}
                          />
                        </TableCell>
                      </TableRow>
                    )}

                    {paymentList?.length > 0 && (
                      <>
                        <TableRow
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                          }}
                        >
                          <TableCell />
                          <TableCell />
                          <TableCell align="right" />
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 560 }}>
                              <Typography variant="subtitle2">{'Tổng thanh toán'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">{fVietNamCurrency(totalPayment)}</Typography>
                          </TableCell>
                          <TableCell align="right" />
                        </TableRow>

                        <TableRow
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                          }}
                        >
                          <TableCell />
                          <TableCell />
                          <TableCell align="right" />
                          <TableCell align="left">
                            <Box sx={{ maxWidth: 560 }}>
                              <Typography variant="subtitle2">
                                {Number(totalPayment) > Number(totalMoney) + Number(freightPrice)
                                  ? 'Thừa của khách'
                                  : 'Còn lại'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">{fVietNamCurrency(paymentLeft)}</Typography>
                          </TableCell>
                          <TableCell align="right" />
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {isPaid && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {'Lưu'}
                </LoadingButton>
              </Stack>
            )}
            <Divider sx={{ my: 3, borderStyle: 'none' }} />
          </Card>
        </FormProvider>
      )}
      <DialogUpdatePayment
        isOpen={openDialog}
        onClose={handleCloseDialog}
        payment={selectedPayment}
        order={order}
        refetchData={refetchData}
      />
    </>
  );
}

DialogUpdatePayment.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  payment: PropTypes.object,
  order: PropTypes.object,
  refetchData: PropTypes.func,
};

function DialogUpdatePayment({ isOpen, onClose, payment, order, refetchData }) {
  const { user } = useAuth();

  const [updatePayment] = useMutation(UPDATE_PAYMENT_INFO, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const [deletePayment] = useMutation(DELETE_PAYMENT_INFO, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const NewPaymentUpdateInformation = Yup.object().shape({
    description: Yup.string().required('Nhập nội dung thanh toán'),
    money: Yup.string().required('Nhập tiền thanh toán thanh toán'),
  });

  const defaultValues = useMemo(
    () => ({
      description: payment?.description || '',
      money: payment?.money || 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewPaymentUpdateInformation),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isOpen && payment) {
      setValue('description', payment.description || '');
      setValue('money', payment.money || 0);
    }
    if (!isOpen) {
      setValue('description', payment.description || '');
      setValue('money', payment.money || 0);
    }
  }, [payment, isOpen, setValue]);

  const handleDelete = async () => {
    try {
      await deletePayment({
        variables: {
          input: {
            ids: Number(payment.id),
            deleteBy: Number(user.id),
          },
        },
      });
      enqueueSnackbar('Xóa thành công');
      await refetchData();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    try {
      const response = await updatePayment({
        variables: {
          input: {
            id: Number(payment.id),
            userId: Number(user.id),
            customerId: Number(order?.customer?.id),
            orderId: Number(order.id),
            money: convertStringToNumber(values.money),
            description: values.description,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Cập nhật thanh toán không thành công. ${error}`, {
            variant: 'error',
          });
        },
      });
      if (!response.errors) {
        enqueueSnackbar('Cập nhật thanh toán thành công', {
          variant: 'success',
        });
        await refetchData();
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ textAlign: 'center' }}>Sửa thông tin thanh toán</DialogTitle>
          <DialogContent sx={{ paddingTop: '24px !important', minWidth: '400px', minHeight: '200px' }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="description" label="Nội dung thanh toán" multiline />
              <RHFCurrencyField
                name="money"
                label="Tiền thanh toán"
                value={fVietNamCurrency(values.money)}
                InputProps={{
                  endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                }}
                setValue={setValue}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Tooltip title="Xóa thanh toán">
              <IconButton onClick={handleDelete}>
                <Iconify icon="eva:trash-2-outline" width={20} height={20} />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Button variant="outlined" color="inherit" onClick={onClose}>
              Hủy
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Cập nhật
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Box>
  );
}
