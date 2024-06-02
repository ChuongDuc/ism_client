// noinspection JSUnresolvedReference

import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FormProvider } from '../../../../components/hook-form';
import { formatStatus, reformatStatus } from '../../../../utils/getOrderFormat';
import { Role } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import Iconify from '../../../../components/Iconify';
import CommonBackdrop from '../../../../components/CommonBackdrop';
import { fVietNamCurrency } from '../../../../utils/formatNumber';

const UPDATE_STATUS_FOR_ACCOUNTANT = loader(
  '../../../../graphql/mutations/order/updateStatusOrderOfAccountant.graphql'
);
const UPDATE_STATUS_FOR_DRIVER = loader('../../../../graphql/mutations/order/updateStatusOrderForDriver.graphql');

// ----------------------------------------------------------------------
const OrderStatusDriverArr = [
  {
    status: 'Đang giao hàng',
    disable: false,
  },
  { status: 'Giao hàng thành công', disable: false },
];

const OrderStatusAccountantArr = [
  { status: 'Xác nhận thanh toán và hồ sơ', disable: false },
  { status: 'Đang thanh toán', disable: false },
  { status: 'Đơn hàng hoàn thành', disable: false },
];
// ----------------------------------------------------------------------

EditOrderDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
  refetchData: PropTypes.func,
  isOpenView: PropTypes.bool,
};

export default function EditOrderDialog({ isOpen, onClose, row, refetchData, isOpenView }) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const [totalPayment, setTotalPayment] = useState(0);

  const [paymentLeft, setPaymentLeft] = useState(0);

  const [updateStatusForAccountant, { loading: loadingUpdateForAccountant }] = useMutation(
    UPDATE_STATUS_FOR_ACCOUNTANT,
    {
      onCompleted: async (res) => {
        if (res) {
          return res;
        }
        return null;
      },
    }
  );

  const [updateStatusForDriver, { loading: loadingUpdateForDriver }] = useMutation(UPDATE_STATUS_FOR_DRIVER, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const NewOrderSchema = Yup.object().shape({
    status: Yup.string(),
    uploadFile: Yup.array().min(1, 'Ảnh giấy tờ cần được thêm'),
  });

  const defaultValues = useMemo(
    () => ({
      status: formatStatus(row?.order?.status),
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(NewOrderSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (row?.order?.paymentList.length > 0) {
      setTotalPayment(row?.order?.paymentList?.map((payment) => payment.money).reduce((total, money) => total + money));
    }
  }, [row?.order?.paymentList]);

  useEffect(() => {
    if (totalPayment > 0) {
      setPaymentLeft(
        Math.abs(
          Number(totalPayment) -
            Number(row?.order?.totalMoney) -
            Number(row?.order?.freightPrice) -
            Number((row?.order?.totalMoney * row?.order?.VAT) / 100) -
            Number((row?.order?.freightPrice * row?.order?.shippingTax) / 100)
        )
      );
    }
  }, [totalPayment, row?.order]);

  const handleClose = () => {
    onClose();
    reset();
  };
  const updateDocumentByDriver = async () => {
    const response = await updateStatusForDriver({
      variables: {
        input: {
          orderId: Number(row?.order?.id),
          userId: Number(user.id),
          statusOrder:
            formatStatus(row?.order?.status) === 'Chốt đơn - Tạo lệnh xuất hàng'
              ? reformatStatus(OrderStatusDriverArr[0].status)
              : reformatStatus(values.status),
          deliverOrder: {
            deliverOrderId: Number(row?.id),
          },
        },
      },
      onError(error) {
        enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
          variant: 'warning',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
      handleClose();
      await refetchData();
    }
    setIsLoading(false);
  };

  const updateStatusByDriver = async (orderStatus) => {
    const response = await updateStatusForDriver({
      variables: {
        input: {
          orderId: Number(row?.order?.id),
          userId: Number(user.id),
          statusOrder: reformatStatus(orderStatus),
          deliverOrder: {
            deliverOrderId: Number(row?.id),
          },
        },
      },
      onError(error) {
        enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
          variant: 'warning',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
      handleClose();
      await refetchData();
    }
    setIsLoading(false);
  };

  const updateDocumentByAccountant = async () => {
    const response = await updateStatusForAccountant({
      variables: {
        input: {
          orderId: Number(row?.order?.orderId),
          userId: Number(user.id),
          statusOrder:
            formatStatus(row?.order?.status) === OrderStatusDriverArr[1].status
              ? reformatStatus(OrderStatusAccountantArr[0].status)
              : reformatStatus(values.status),
          deliverOrder: {
            deliverOrderId: Number(row?.id),
          },
        },
      },
      onError(error) {
        enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
          variant: 'warning',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
      handleClose();
      await refetchData();
    }
    setIsLoading(false);
  };

  const updateStatusByAccountant = async (orderStatus) => {
    const response = await updateStatusForAccountant({
      variables: {
        input: {
          orderId: Number(row?.order?.id),
          userId: Number(user.id),
          statusOrder: reformatStatus(orderStatus),
          deliverOrder: {
            deliverOrderId: Number(row?.id),
          },
        },
      },
      onError(error) {
        enqueueSnackbar(`Cập nhật không thành công. ${error}`, {
          variant: 'warning',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
      handleClose();
      await refetchData();
    }
    setIsLoading(false);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (user.role === Role.driver) {
        await updateDocumentByDriver();
      } else {
        await updateDocumentByAccountant();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (event) => {
    try {
      setIsLoading(true);
      if (user.role === Role.driver) {
        await updateStatusByDriver(event?.target?.value);
      } else {
        await updateStatusByAccountant(event?.target?.value);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (row) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, row]);

  useEffect(() => {
    if (formatStatus(row?.order?.status) === 'Chốt đơn - Tạo lệnh xuất hàng') {
      OrderStatusDriverArr[0].disable = false;
      OrderStatusDriverArr[1].disable = false;
      OrderStatusAccountantArr[0].disable = true;
      OrderStatusAccountantArr[1].disable = true;
      OrderStatusAccountantArr[2].disable = true;
    }
    if (formatStatus(row?.order?.status) === OrderStatusDriverArr[0].status) {
      OrderStatusDriverArr[0].disable = true;
      OrderStatusDriverArr[1].disable = false;
      OrderStatusAccountantArr[0].disable = true;
      OrderStatusAccountantArr[1].disable = true;
      OrderStatusAccountantArr[2].disable = true;
    }
    if (formatStatus(row?.order?.status) === OrderStatusDriverArr[1].status) {
      OrderStatusDriverArr[0].disable = true;
      OrderStatusDriverArr[1].disable = true;
      OrderStatusAccountantArr[0].disable = false;
      OrderStatusAccountantArr[1].disable = false;
      OrderStatusAccountantArr[2].disable = false;
    }
    if (
      formatStatus(row?.order?.status) === OrderStatusAccountantArr[0].status ||
      formatStatus(row?.order?.status) === OrderStatusAccountantArr[1].status ||
      formatStatus(row?.order?.status) === OrderStatusAccountantArr[2].status
    ) {
      OrderStatusDriverArr[0].disable = true;
      OrderStatusDriverArr[1].disable = true;
    }
    if (
      formatStatus(row?.order?.status) === OrderStatusAccountantArr[1].status &&
      row?.order?.paymentList?.length > 0
    ) {
      OrderStatusDriverArr[0].disable = false;
      OrderStatusDriverArr[1].disable = false;
    }
    if (formatStatus(row?.order?.status) === OrderStatusAccountantArr[0].status) {
      OrderStatusAccountantArr[0].disable = true;
      OrderStatusAccountantArr[1].disable = false;
      OrderStatusAccountantArr[2].disable = false;
    }
    if (formatStatus(row?.order?.status) === OrderStatusAccountantArr[1].status) {
      OrderStatusAccountantArr[0].disable = true;
      OrderStatusAccountantArr[1].disable = true;
      OrderStatusAccountantArr[2].disable = false;
    }
    if (formatStatus(row?.order?.status) === OrderStatusAccountantArr[2].status) {
      OrderStatusAccountantArr[0].disable = true;
      OrderStatusAccountantArr[1].disable = true;
      OrderStatusAccountantArr[2].disable = true;
    }
    if (row?.order?.paymentList?.length > 0) {
      OrderStatusAccountantArr[0].disable = true;
      OrderStatusAccountantArr[1].disable = true;
    }
  }, [row, user]);

  const [isDisabled, setIsDisabled] = useState(false);
  console.log(isDisabled);

  useEffect(() => {
    if (
      user.role === Role.accountant &&
      (formatStatus(row?.order?.status) === 'Chốt đơn - Tạo lệnh xuất hàng' ||
        formatStatus(row?.order?.status) === OrderStatusDriverArr[0].status)
    ) {
      setIsDisabled(true);
    } else if (
      user.role === Role.accountant &&
      !(
        formatStatus(row?.order?.status) === 'Chốt đơn - Tạo lệnh xuất hàng' ||
        formatStatus(row?.order?.status) === OrderStatusDriverArr[0].status
      )
    ) {
      setIsDisabled(false);
    }

    if (
      user.role === Role.driver &&
      (formatStatus(row?.order?.status) === OrderStatusAccountantArr[0].status ||
        formatStatus(row?.order?.status) === OrderStatusAccountantArr[1].status ||
        formatStatus(row?.order?.status) === OrderStatusAccountantArr[2].status)
    ) {
      setIsDisabled(true);
    } else if (
      user.role === Role.driver &&
      !(
        formatStatus(row?.order?.status) === OrderStatusAccountantArr[0].status ||
        formatStatus(row?.order?.status) === OrderStatusAccountantArr[1].status ||
        formatStatus(row?.order?.status) === OrderStatusAccountantArr[2].status
      )
    ) {
      setIsDisabled(false);
    }
  }, [user, row]);

  const vat = Number((row?.order?.totalMoney * row?.order?.VAT) / 100);

  const totalPrice = Math.round(Number(row?.order?.totalMoney) + Number(row?.order?.freightPrice) + vat);

  return (
    <>
      <Dialog disableEscapeKeyDown={isLoading} maxWidth="md" open={isOpen} onClose={handleClose}>
        <Stack alignItems="flex-end" paddingY={0}>
          <Tooltip title="Đóng">
            <IconButton
              color="primary"
              onClick={() => {
                if (!isLoading) {
                  onClose();
                }
              }}
            >
              <Iconify icon={'material-symbols:close'} />
            </IconButton>
          </Tooltip>
        </Stack>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle variant="subtitle1" sx={{ textAlign: 'center', py: 1 }}>
            {!isOpenView ? 'Cập nhật đơn hàng' : 'Thông tin đơn hàng'}
          </DialogTitle>
          <DialogContent sx={{ minWidth: '400px', minHeight: '200px' }}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: { xs: 'left', md: 'center' }, marginRight: 2, color: 'text.primary' }}
            >
              Trạng thái đơn hàng: <b>{formatStatus(row?.order?.status)}</b>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1, px: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
                >
                  {`Lái xe: ${row?.driver?.fullName ? row?.driver?.fullName : 'Chưa có lái xe'}`}
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
                >
                  Ngày tạo: <b>{`${row ? fddMMYYYYWithSlash(row?.createdAt) : ''}`}</b>
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1, px: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
                >
                  Khách hàng: <b>{row?.customer?.name}</b>
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: { xs: 'left', md: 'left' }, marginRight: 2, color: 'text.primary' }}
                >
                  {`Địa chỉ: ${
                    row?.customer?.deliveryAddress ? row?.customer?.deliveryAddress : 'Chưa có địa chỉ khách hàng'
                  }`}
                </Typography>
              </Box>
            </Stack>
            {user.role === Role.accountant && (
              <>
                <Stack spacing={3} sx={{ py: 1, px: 5 }}>
                  <Typography variant="subtitle2" sx={{ textAlign: 'left', color: 'text.primary' }}>
                    {`Tổng đơn hàng: ${fVietNamCurrency(totalPrice)} VNĐ`}
                  </Typography>
                </Stack>
                <Stack spacing={3} sx={{ py: 1, px: 5 }}>
                  <Typography variant="subtitle2" sx={{ textAlign: 'left', color: 'text.primary' }}>
                    {`Tổng thanh toán: ${fVietNamCurrency(totalPayment)} VNĐ`}
                  </Typography>
                </Stack>

                {user.role === Role.accountant && (
                  <>
                    <Stack spacing={3} sx={{ py: 1, px: 5 }}>
                      <Typography variant="subtitle2" sx={{ textAlign: 'left', color: 'text.primary' }}>
                        Thông tin thanh toán:
                      </Typography>
                    </Stack>
                    <Stack spacing={0} sx={{ px: 5, width: '35%' }}>
                      {row?.order?.paymentList?.map((payment, index) => (
                        <Accordion key={index}>
                          <AccordionSummary expandIcon={<ArrowDropDownIcon width={10} height={10} />}>
                            <Typography sx={{ width: '30%', flexShrink: 0 }}>{index + 1}</Typography>
                            <Typography>{fVietNamCurrency(payment?.money)} VNĐ</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <Typography>{payment?.description}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Stack>
                  </>
                )}

                <Stack direction="row" spacing={1} sx={{ py: 1, px: 5 }}>
                  <Typography variant="subtitle2">
                    {Number(totalPayment) > Number(totalPrice) ? 'Thừa của khách:' : 'Còn lại:'}
                  </Typography>
                  <Typography variant="subtitle2">{`${fVietNamCurrency(paymentLeft)} VNĐ`}</Typography>
                </Stack>
              </>
            )}

            <Stack spacing={3} sx={{ py: 1, px: 5 }}>
              <Stack spacing={1} direction="row">
                {(user.role === Role.driver ? OrderStatusDriverArr : OrderStatusAccountantArr).map((option, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    color="info"
                    variant="contained"
                    value={option.status}
                    // onClick={() => {
                    //   setValue('status', option.status);
                    //   setIsUpdateStatus(true);
                    // }}
                    onClick={handleUpdateStatus}
                    sx={{ mr: 1 }}
                    disabled={option.disable}
                  >
                    {option.status}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </DialogContent>
          <CommonBackdrop loading={loadingUpdateForAccountant || isSubmitting || loadingUpdateForDriver} />
        </FormProvider>
      </Dialog>
    </>
  );
}
