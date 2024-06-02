// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { FormProvider } from '../../../../../../components/hook-form';
import MultipleItemGroupQuotation from '../MultipleItemGroupQuotation';
import { convertStringToNumber } from '../../../../../../utils/formatNumber';
import NewEditDetailsQuotationForm from '../../../../../../pages/dashboard/NewEditDetailsQuotationForm';

const UPDATE_QUOTATION = loader('../../../../../../graphql/mutations/order/updatePriceQuotation.graphql');
const LIST_CUSTOMER = loader('../../../../../../graphql/queries/customer/listAllCustomer.graphql');
const ORDER_BY_ID = loader('../../../../../../graphql/queries/order/getOrderById.graphql');
// ----------------------------------------------------------------------

QuotationNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  customer: PropTypes.object.isRequired,
  freightPrice: PropTypes.number,
  currentProducts: PropTypes.arrayOf(
    PropTypes.shape({
      priceProduct: PropTypes.number,
      quantity: PropTypes.number,
      updatedAt: PropTypes.instanceOf(Date),
      product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        available: PropTypes.number,
      }),
    })
  ),
  currentCategories: PropTypes.array,
  order: PropTypes.object,
  isMultiCategories: PropTypes.bool,
  setFormMethod: PropTypes.func,
  handleDeniedEdit: PropTypes.func,
};

export default function QuotationNewEditForm({
  isEdit,
  currentProducts,
  currentCategories,
  freightPrice,
  isMultiCategories,
  order,
  setFormMethod,
  handleDeniedEdit,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    VAT,
    // freightMessage,
    reportingValidityAmount,
    deliveryMethodDescription,
    percentOfAdvancePayment,
    executionTimeDescription,
    deliverAddress,
    customer,
    // status,
    // invoiceNo,
    id,
    // totalMoney,
    // remainingPaymentMoney,
    // cranesNote,
    // receivingNote,
    // documentNote,
    // otherNote,
    sale,
    itemGroupList,
    shippingTax,
    // deliverOrderList,
    // paymentList
  } = order;

  console.log(order, 'order');

  const [customers, setCustomer] = useState([]);

  const { data: allCustomer } = useQuery(LIST_CUSTOMER, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    if (allCustomer) {
      setCustomer(allCustomer?.listAllCustomer?.edges.map((edge) => edge.node));
    }
  }, [allCustomer]);

  const [updateQuotation] = useMutation(UPDATE_QUOTATION, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    refetchQueries: () => [
      {
        query: ORDER_BY_ID,
        variables: {
          orderId: Number(id),
        },
      },
    ],
  });

  const defaultValues = useMemo(
    () => ({
      products: currentProducts || [],
      customer: customer || null,
      freightPrice: freightPrice || 0,
      freightMessage: deliverAddress || '',
      categories: currentCategories || [],
      deliveryMethod: deliveryMethodDescription || '',
      vat: VAT || 10,
      shippingTax: shippingTax || 8,
      reportingValidity: reportingValidityAmount || 3,
      executionTime: executionTimeDescription || '',
      pay: percentOfAdvancePayment || 100,
      deliverAddress: deliverAddress || '',
      companyAddress: customer?.company?.address || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProducts]
  );

  const methods = useForm({
    defaultValues,
  });

  const { watch, reset, setValue } = methods;

  const values = watch();

  const customerOrder = customers.filter((data) => data?.id === values?.customer?.id);

  useEffect(() => {
    if (isEdit && currentProducts) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProducts]);

  useEffect(() => {
    if (isEdit) {
      setFormMethod(methods);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const multiCategoryOrder = values.categories?.map((item) => ({
    orderDetails: item.orderDetailList,
    itemGroupId: item.id,
    description: item.description,
    name: item.name,
  }));

  const singleCategoryOrder = values.products?.map((item) => ({
    productId: item?.product?.id,
    orderDetailId: item?.id,
    quantity: item.quantity,
    priceProduct: item.priceProduct,
    description: item.description,
    weightProduct: item.weightProduct,
  }));

  const updateSingleQuote = async (orderId, saleId, categoryOrder, data) => {
    const response = await updateQuotation({
      variables: {
        input: {
          orderId: Number(orderId),
          saleId: Number(saleId),
          deliverAddress: data?.deliverAddress,
          deliveryMethodDescription: data?.deliveryMethod,
          executionTimeDescription: data?.executionTime,
          freightMessage: data?.deliverAddress,
          freightPrice: convertStringToNumber(data?.freightPrice),
          percentOfAdvancePayment: Number(data?.pay),
          reportingValidityAmount: Number(data?.reportingValidity),
          vat: Number(data?.vat),
          itemGroups: [
            {
              itemGroupId: Number(itemGroupList[0]?.id),
              orderDetails: categoryOrder?.map((item) => ({
                orderDetailId: Number(item?.orderDetailId),
                productId: Number(item.productId),
                quantity: Number(item.quantity),
                priceProduct: convertStringToNumber(item.priceProduct),
                description: item.description,
                weightProduct: Number(item.weightProduct),
              })),
            },
          ],
        },
      },
      onError: (error) => {
        enqueueSnackbar(`Cập nhật báo giá không thành công. Nguyên nhân: ${error.message}`, {
          variant: 'error',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật báo giá thành công', {
        variant: 'success',
      });
    }
  };

  const updateMultiQuote = async (orderId, saleId, categoryOrder, data) => {
    const response = await updateQuotation({
      variables: {
        input: {
          orderId: Number(orderId),
          saleId: Number(saleId),
          deliverAddress: data?.deliverAddress,
          deliveryMethodDescription: data?.deliveryMethod,
          executionTimeDescription: data?.executionTime,
          freightMessage: data?.deliverAddress,
          freightPrice: convertStringToNumber(data?.freightPrice),
          percentOfAdvancePayment: Number(data?.pay),
          reportingValidityAmount: Number(data?.reportingValidity),
          vat: Number(data?.vat),
          itemGroups: categoryOrder?.map((item) => ({
            description: item?.description,
            name: item?.name,
            itemGroupId: Number(item?.itemGroupId),
            orderDetails: item.orderDetails.map((orderDetailsList) => ({
              orderDetailId: Number(orderDetailsList?.id),
              productId: Number(orderDetailsList?.product.id),
              quantity: Number(orderDetailsList.quantity),
              priceProduct: convertStringToNumber(orderDetailsList.priceProduct),
              description: orderDetailsList.description,
              weightProduct: Number(orderDetailsList.weightProduct),
            })),
          })),
        },
      },
      onError: (error) => {
        enqueueSnackbar(`Cập nhật báo giá không thành công. Nguyên nhân: ${error.message}`, {
          variant: 'error',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật báo giá thành công', {
        variant: 'success',
      });
    }
  };
  const onSubmit = async (data) => {
    console.log(data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isMultiCategories) {
        await updateMultiQuote(id, sale?.id, multiCategoryOrder, data);
      } else {
        await updateSingleQuote(id, sale?.id, singleCategoryOrder, data);
      }
      handleDeniedEdit();
    } catch (error) {
      console.error(error);
    }
  };

  // Cập nhật thông tin địa chỉ giao hàng mỗi khi thay đổi khách hàng
  useEffect(() => {
    if (values.customer?.address) {
      setValue('deliverAddress', values.customer?.address ?? '');
    }
  }, [setValue, values.customer]);
  // Khi check vào miễn phí vận chuyển thì phí giao hàng chuyển về 0
  useEffect(() => {
    if (values.isFree === true) {
      setValue('freightPrice', 0);
    }
  }, [setValue, values.isFree]);

  useEffect(() => {
    setValue('freightMessage', values.deliverAddress);
  }, [setValue, values.deliverAddress]);

  return (
    <FormProvider methods={methods}>
      {isMultiCategories ? (
        <Card>
          <MultipleItemGroupQuotation
            isEdit={isEdit}
            onOpenPreview={null}
            customerOrder={customerOrder}
            handleSend={onSubmit}
            isAdd={false}
          />
        </Card>
      ) : (
        <Card>
          <NewEditDetailsQuotationForm
            isEdit={isEdit}
            onOpenPreview={null}
            customerOrder={customerOrder}
            handleSend={onSubmit}
            isAdd={false}
          />
        </Card>
      )}
    </FormProvider>
  );
}
