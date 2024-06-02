// noinspection JSValidateTypes

import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { loader } from 'graphql.macro';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';
import { FormProvider } from '../../../../../components/hook-form';
import { Role } from '../../../../../constant';
import useAuth from '../../../../../hooks/useAuth';
import CommonBackdrop from '../../../../../components/CommonBackdrop';
import { fYearMonthDay } from '../../../../../utils/formatTime';
import DeliverOrderDetail from '../../delivery-order/detail-edit/DeliverOrderDetail';

// ----------------------------------------------------------------------

const CREATE_DELIVER_ORDER = loader('../../../../../graphql/mutations/deliverOrder/createDeliverOrder.graphql');
const UPDATE_DELIVER_ORDER = loader('../../../../../graphql/mutations/deliverOrder/updateDeliverOrder.graphql');

// ----------------------------------------------------------------------

DocumentDeliveryOrder.propTypes = {
  currentOrder: PropTypes.object,
  deliverOrder: PropTypes.array.isRequired,
};

export default function DocumentDeliveryOrder({ currentOrder, deliverOrder }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const NewDeliverOrderSchema = Yup.object().shape({
    deliveryDate: Yup.string().required('Bạn hãy nhập ngày hẹn giao khách'),
    receivingNote: Yup.string().required('Bạn hãy nhập ghi chú'),
    cranesNote: Yup.string().required('Bạn hãy nhập ghi chú cẩu hạ hàng'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: currentOrder?.customer || null,
      sale: currentOrder?.sale || null,
      invoiceNo: currentOrder?.invoiceNo || null,
      VAT: currentOrder?.VAT || null,
      shippingTax: currentOrder.shippingTax || 8,
      discount: currentOrder?.discount || null,
      status: currentOrder?.status || null,
      driver: currentOrder?.driver || null,
      freightPrice: currentOrder?.freightPrice || null,
      percentOfAdvancePayment: currentOrder?.percentOfAdvancePayment || null,
      reportingValidityAmount: currentOrder?.reportingValidityAmount || null,
      deliveryMethodDescription: currentOrder?.deliveryMethodDescription || null,
      executionTimeDescription: currentOrder?.executionTimeDescription || null,
      freightMessage: currentOrder?.freightMessage || null,
      deliverOrderList: currentOrder?.deliverOrderList || [],
      deliverAddress: currentOrder.deliverAddress || '',
      paymentList: currentOrder?.paymentList || null,
      updatedAt: currentOrder?.updatedAt || null,
      totalMoney: currentOrder?.totalMoney || null,
      remainingPaymentMoney: currentOrder?.remainingPaymentMoney || null,
      itemGroupList: currentOrder?.itemGroupList || null,
      createdAt: currentOrder?.createdAt || null,
      orderId: currentOrder?.orderId || null,
      deliveryDate: currentOrder?.deliverOrderList ? currentOrder?.deliverOrderList[0]?.deliveryDate : null,
      updateDocumentFiles: [],
      deliveryPayable: currentOrder?.deliveryPayable || '', // TODO: fix name
      receivingNote: deliverOrder[0]?.receivingNote || '', // Hàng đã giao
      otherNote: deliverOrder[0]?.otherNote || '', // Dặn dò khác
      cranesNote: deliverOrder[0]?.cranesNote || '', // Hạ cẩu hàng
      documentNote: deliverOrder[0]?.documentNote || '',
    }),
    [currentOrder, deliverOrder]
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(NewDeliverOrderSchema),
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (currentOrder) {
      reset(defaultValues);
    }
  }, [currentOrder, defaultValues, reset]);

  const [createDeliverOrderFn, { loading: loadingCreate }] = useMutation(CREATE_DELIVER_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });
  const [updateDeliverOrderFn, { loading: loadingUpdate }] = useMutation(UPDATE_DELIVER_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const onSubmit = async () => {
    try {
      const itemGroupsNotes = values.itemGroupList?.map((item) => ({
        itemGroupId: item.id,
        detailListInput: item.orderDetailList.map((detail) => ({
          orderDetailId: detail.id,
          deliveryMethodNote: detail.deliveryMethodNote,
          otherNote: detail.otherNote,
        })),
      }));
      // Xử lý submit cập nhật deliverOrder
      if (currentOrder?.deliverOrderList && currentOrder?.deliverOrderList.length > 0) {
        const updateDeliveryResponse = await updateDeliverOrderFn({
          variables: {
            input: {
              deliverOrderId: currentOrder.deliverOrderList[0].id,
              driverId: null,
              deliveryDate: fYearMonthDay(values.deliveryDate),
              description: values.otherNote || null,
              receivingNote: values.receivingNote,
              cranesNote: values.cranesNote,
              documentNote: values.documentNote,
              otherNote: values.otherNote,
              itemGroupsNotes,
            },
          },
          onError(err) {
            console.error(err);
            enqueueSnackbar('Cập nhật lệnh xuất hàng không thành công', {
              variant: 'error',
            });
          },
        });
        if (updateDeliveryResponse?.data) {
          window.location.reload();
        }
      } else {
        const createDeliveryResponse = await createDeliverOrderFn({
          variables: {
            input: {
              customerId: values.customer?.id,
              orderId: Number(currentOrder.id),
              createById: Number(user?.id),
              driverId: null,
              deliveryDate: fYearMonthDay(values.deliveryDate),
              description: values.otherNote || null,
              receivingNote: values.receivingNote,
              cranesNote: values.cranesNote,
              documentNote: values.documentNote,
              otherNote: values.otherNote,
              itemGroupsNotes,
            },
          },

          onError(err) {
            enqueueSnackbar(err.message, {
              variant: 'warning',
            });
          },
        });
        if (createDeliveryResponse?.data) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  const isSalePermission =
    user.role === Role.sales && currentOrder?.sale.id && `${currentOrder?.sale.id}` === `${user.id}`;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DeliverOrderDetail isSalePermission={isSalePermission} onSubmit={onSubmit} formMethod={methods} />
      <CommonBackdrop loading={loadingUpdate || loadingCreate} />
    </FormProvider>
  );
}
