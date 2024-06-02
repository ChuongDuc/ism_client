// noinspection JSValidateTypes,JSUnresolvedReference,DuplicatedCode

import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from '../../../../components/hook-form';
import { orderPropTypes, Role } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';
import { fYearMonthDay } from '../../../../utils/formatTime';
import DeliverOrderDetail from './detail-edit/DeliverOrderDetail';
import CommonBackdrop from '../../../../components/CommonBackdrop';

// ----------------------------------------------------------------------
const CREATE_DELIVER_ORDER = loader('../../../../graphql/mutations/deliverOrder/createDeliverOrder.graphql');
const UPDATE_DELIVER_ORDER = loader('../../../../graphql/mutations/deliverOrder/updateDeliverOrder.graphql');
const GET_ALL_TAG = loader('../../../../graphql/queries/tags/listAllTag.graphql');

DocumentDeliveryOrder.propTypes = {
  currentOrder: orderPropTypes().isRequired,
  deliverOrder: PropTypes.array.isRequired,
};

export default function DocumentDeliveryOrder({ currentOrder, deliverOrder }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [selectedTags, setSelectedTags] = useState([]);

  const [tags, setTags] = useState([]);

  const [updateTag, setUpdateTag] = useState([]);

  const currentTags = useMemo(
    () => currentOrder?.deliverOrderList[0]?.collection?.map((e) => e.tags.tagName),
    [currentOrder?.deliverOrderList]
  );

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
      tags: currentTags || [],
    }),
    [currentOrder, deliverOrder, currentTags]
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

  const { data: allTag, refetch: refetchTag } = useQuery(GET_ALL_TAG, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    if (allTag) {
      setTags(allTag?.listAllTag.map((e) => e));
    }
  }, [allTag]);

  useEffect(() => {
    if (values.tags?.length > 0) {
      for (let i = 0; i < values.tags.length; i += 1) {
        const getTag = tags?.filter((e) => e?.tagName === values?.tags[i]);
        setSelectedTags([...selectedTags, ...getTag.map((e) => e?.id)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.tags, tags]);

  useEffect(() => {
    if (currentOrder?.deliverOrderList && currentOrder?.deliverOrderList.length > 0 && values.tags?.length > 0) {
      const differentValues = values.tags?.filter((value) => !currentTags?.includes(value));
      for (let i = 0; i < differentValues.length; i += 1) {
        const getTag = tags?.filter((e) => e?.tagName === differentValues[i]);
        setUpdateTag([...updateTag, ...getTag?.map((e) => e?.id)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder?.deliverOrderList, values.tags, currentTags, tags]);

  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    if (!(currentOrder?.deliverOrderList && currentOrder?.deliverOrderList.length > 0) && selectedTags.length > 0) {
      const uniqueArray = selectedTags.filter((value, index, self) => self.indexOf(value) === index);
      setSelectedId(uniqueArray);
    }
    if (currentOrder?.deliverOrderList && currentOrder?.deliverOrderList.length > 0 && updateTag.length > 0) {
      const uniqueArray = updateTag.filter((value, index, self) => self.indexOf(value) === index);
      setSelectedId(uniqueArray);
    }
  }, [currentOrder?.deliverOrderList, selectedTags, updateTag]);

  const onSubmit = async () => {
    try {
      const itemGroupsNotes = values.itemGroupList.map((item) => ({
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
              description: values.otherNote,
              receivingNote: values.receivingNote,
              cranesNote: values.cranesNote,
              documentNote: values.documentNote,
              otherNote: values.otherNote,
              itemGroupsNotes,
              newTags: selectedId || [],
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
              orderId: currentOrder.orderId,
              createById: Number(user?.id),
              driverId: null,
              deliveryDate: fYearMonthDay(values.deliveryDate),
              description: values.otherNote,
              receivingNote: values.receivingNote,
              cranesNote: values.cranesNote,
              documentNote: values.documentNote,
              otherNote: values.otherNote,
              itemGroupsNotes,
              tags: selectedId || [],
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
      <DeliverOrderDetail
        isSalePermission={isSalePermission}
        onSubmit={onSubmit}
        formMethod={methods}
        refetchData={refetchTag}
        tags={tags}
      />
      <CommonBackdrop loading={loadingUpdate || loadingCreate} />
    </FormProvider>
  );
}
