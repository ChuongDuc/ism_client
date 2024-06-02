// noinspection JSUnresolvedVariable,JSValidateTypes

import { useForm } from 'react-hook-form';
import { Box, Card, Container, Dialog, DialogActions, Grid, IconButton, Tooltip } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import useToggle from '../../hooks/useToggle';
import Iconify from '../../components/Iconify';
import { FormProvider } from '../../components/hook-form';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';

import CustomerListDialog from '../../sections/@dashboard/order/new-edit-form/CustomerListDialog';
import PreviewQuotationCommonPDF from '../../sections/@dashboard/order/details/PreviewQuotationCommonPDF';
import { convertStringToNumber } from '../../utils/formatNumber';
import { ITEM_GROUP, Role } from '../../constant';
import CommonBackdrop from '../../components/CommonBackdrop';
import { addIsMultiCate, resetCart } from '../../redux/slices/product';
import { useDispatch, useSelector } from '../../redux/store';
import SalesContractInfo from '../../sections/@dashboard/order/overview/quotation/SalesContractInfo';
import QuotationCustomerInfo from '../../sections/@dashboard/order/overview/quotation/QuotationCustomerInfo';
import QuotationSummary from '../../sections/@dashboard/order/overview/quotation/QuotationSumary';
import NewEditDetailsQuotationForm from './NewEditDetailsQuotationForm';
import MultipleItemGroupQuotation from '../../sections/@dashboard/order/overview/quotation/MultipleItemGroupQuotation';
import NewCustomerDialog from '../../sections/@dashboard/order/overview/quotation/NewCustomerDialog';

const ORDER_BY_ID = loader('../../graphql/queries/order/getOrderById.graphql');
const LIST_CUSTOMER = loader('../../graphql/queries/customer/listAllCustomer.graphql');
const CREATE_QUOTATION = loader('../../graphql/mutations/order/createQuotation.graphql');
const CREATE_ORDER = loader('../../graphql/mutations/order/createOrder.graphql');

// ----------------------------------------------------------------------

CreateNewQuotationVer2.propTypes = {
  isCreate: PropTypes.bool,
  customerFromDetail: PropTypes.object,
  orderId: PropTypes.number,
  sale: PropTypes.object,
  invoiceNo: PropTypes.string,
};

export default function CreateNewQuotationVer2({ sale, isCreate, customerFromDetail, orderId, invoiceNo }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { isMultiCategory } = useSelector((state) => state.product);
  const { toggle: open, onOpen, onClose } = useToggle();
  // hook form để mở dialog tìm kiếm khách hàng
  const { toggle: openCustomerForm, onOpen: onOpenCustomerForm, onClose: onCloseCustomerForm } = useToggle();
  // hook form để mở dialog tạo khách hàng mới
  const {
    toggle: openCreateNewCustomer,
    onOpen: onOpenCreateNewCustomer,
    onClose: onCloseCreateNewCustomer,
  } = useToggle();
  const [loadingSend, setLoadingSend] = useState(false);
  const [order, setOrder] = useState({});
  const [customers, setCustomer] = useState([]);
  const [isMultiCate, setIsMultiCate] = useState(isMultiCategory);
  const [typeOfCategory, setTypeOfCategory] = useState(ITEM_GROUP.single);

  const { data: allCustomer } = useQuery(LIST_CUSTOMER, {
    variables: {
      input: {},
    },
  });

  const { id } = useParams();

  useEffect(() => {
    if (allCustomer) {
      setCustomer(allCustomer?.listAllCustomer?.edges.map((edge) => edge.node));
    }
  }, [allCustomer]);

  useEffect(() => {
    if (isMultiCategory) {
      setTypeOfCategory(ITEM_GROUP.multiple);
    } else {
      setTypeOfCategory(ITEM_GROUP.single);
    }
  }, [isMultiCategory]);

  const [createQuotation, { loading: loadingCreate }] = useMutation(CREATE_QUOTATION, {
    refetchQueries: () => [
      {
        query: ORDER_BY_ID,
        variables: {
          orderId: Number(orderId),
        },
      },
    ],
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const NewQuotationSchema = Yup.object().shape({
    isFree: Yup.boolean(),
    freightPrice: Yup.string().when('isFree', {
      is: false,
      then: () => Yup.string().required('Hãy nhập tiền vận chuyển'),
    }),
    vat: Yup.number().typeError('Vui lòng nhập số').moreThan(0, 'Vui lòng nhập thuế VAT').required('Vui lòng nhập số'),
    shippingTax: Yup.number()
      .typeError('Vui lòng nhập số')
      .moreThan(0, 'Vui lòng nhập thuế vận chuyển')
      .required('Vui lòng nhập số'),
    pay: Yup.number()
      .typeError('Vui lòng nhập số')
      .moreThan(0, 'Vui lòng nhập % thanh toán khi đặt hàng')
      .required('Vui lòng nhập số % thanh toán'),
    reportingValidity: Yup.number()
      .typeError('Vui lòng nhập số')
      .moreThan(0, 'Vui lòng nhập số ngày báo giá có hiệu lực')
      .required('Vui lòng nhập số ngày báo giá có hiệu lực'),
    executionTime: Yup.string().required('Hãy nhập ghi chú thời gian thực hiện'),
    deliveryMethod: Yup.string().required('Hãy nhập ghi chú phương thức giao hàng'),
  });

  const defaultValues = useMemo(
    () => ({
      categories: [],
      products: [],
      customer: customerFromDetail || {},
      freightPrice: 0,
      vat: 10,
      shippingTax: 8,
      pay: 90,
      reportingValidity: 3,
      freightMessage: '',
      deliverAddress: '',
      deliveryMethod: '',
      executionTime: '',
      isFree: false,
    }),
    [customerFromDetail]
  );

  const methods = useForm({
    resolver: yupResolver(NewQuotationSchema),
    defaultValues,
  });

  const { watch, setValue } = methods;

  const values = watch();

  const customerOrder = customers.filter((data) => data?.id === values?.customer?.id);

  const handleIsMultiCate = (val) => {
    setIsMultiCate(val);
    dispatch(addIsMultiCate(val));
  };

  const multiCategoryOrder = values.categories?.map((item) => ({
    products: item.orderDetailList,
    name: item.name,
  }));

  const singleCategoryOrder = values.products?.map((item) => ({
    productId: item?.product?.id,
    quantity: item.quantity,
    priceProduct: item.priceProduct,
    description: item.description,
    weightProduct: item.weightProduct,
  }));

  const createSingleQuote = async (orderId, saleId, categoryOrder, data) => {
    const response = await createQuotation({
      variables: {
        input: {
          orderId: Number(orderId),
          saleId: Number(saleId),
          vat: Number(data?.vat),
          freightPrice: convertStringToNumber(data?.freightPrice),
          percentOfAdvancePayment: Number(data?.pay),
          reportingValidityAmount: Number(data?.reportingValidity),
          deliveryMethodDescription: data?.deliveryMethod,
          executionTimeDescription: data?.executionTime,
          freightMessage: data?.freightMessage,
          deliverAddress: data?.deliverAddress,
          categoryOrders: [
            {
              products: categoryOrder?.map((item) => ({
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
        enqueueSnackbar(`Tạo báo giá không thành công ${error}`, {
          variant: 'error',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Tạo báo giá thành công', {
        variant: 'success',
      });
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.saleAndMarketing.list);
    }
  };

  const createMultiQuote = async (orderId, saleId, categoryOrder, data) => {
    const response = await createQuotation({
      variables: {
        input: {
          orderId: Number(orderId),
          saleId: Number(saleId),
          vat: Number(data?.vat),
          freightPrice: convertStringToNumber(data?.freightPrice),
          percentOfAdvancePayment: Number(data?.pay),
          reportingValidityAmount: Number(data?.reportingValidity),
          deliveryMethodDescription: data?.deliveryMethod,
          executionTimeDescription: data?.executionTime,
          freightMessage: data?.freightMessage,
          deliverAddress: data?.deliverAddress,
          categoryOrders: categoryOrder.map((item) => ({
            name: item.name,
            products: item.products.map((product) => ({
              productId: Number(product.product.id),
              quantity: Number(product.quantity),
              priceProduct: convertStringToNumber(product.priceProduct),
              description: product.description,
              weightProduct: Number(product.weightProduct),
            })),
          })),
        },
      },
      onError: (error) => {
        enqueueSnackbar(`Tạo báo giá không thành công. Nguyên nhân: ${error.message}`, {
          variant: 'error',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Tạo báo giá thành công', {
        variant: 'success',
      });
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.saleAndMarketing.view(order?.orderId));
    }
  };

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);
    try {
      if (isMultiCate) {
        await createMultiQuote(
          order?.id ? order?.id : Number(id),
          user.role === Role.sales ? user.id : sale.id,
          multiCategoryOrder,
          data
        );
      } else {
        await createSingleQuote(
          order?.id ? order?.id : Number(id),
          user.role === Role.sales ? user.id : sale.id,
          singleCategoryOrder,
          data
        );
      }
      dispatch(resetCart());
    } catch (error) {
      console.error(error);
    }
  };

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: async (res) => {
      if (res) {
        return setOrder(res?.createOrder);
      }
      return null;
    },
  });

  const handleGetCustomerFromDialog = async (givenCustomer) => {
    setValue('customer', givenCustomer);
    if (user.role === Role.sales) {
      await createOrder({
        variables: {
          input: {
            customerId: givenCustomer.id,
            saleId: Number(user.id),
          },
        },
      });
    }
  };

  useEffect(() => {
    if (values.customer?.deliveryAddress) {
      setValue('deliverAddress', values.customer?.deliveryAddress ?? '');
    }
  }, [setValue, values.customer]);

  useEffect(() => {
    if (values.isFree === true) {
      setValue('freightPrice', 0);
    }
  }, [setValue, values.isFree]);

  useEffect(() => {
    setValue('freightMessage', values.deliverAddress);
  }, [setValue, values.deliverAddress]);
  return (
    <Page title="Báo giá">
      <Container maxWidth={false}>
        <FormProvider methods={methods}>
          <Grid container spacing={0} sx={{ mb: 2 }}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3.5} p={1}>
                  <SalesContractInfo invoiceNo={order?.invoiceNo || invoiceNo} sale={sale} />
                </Grid>

                <Grid item xs={12} md={5} p={1}>
                  <QuotationCustomerInfo
                    handleClick={onOpenCustomerForm}
                    customer={values?.customer}
                    handleSend={handleCreateAndSend}
                    loading={loadingSend}
                    isCreateByDetail={isCreate}
                  />
                </Grid>

                <Grid item xs={12} md={3.5} p={1}>
                  <QuotationSummary freightPrice={convertStringToNumber(values?.freightPrice)} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {!isMultiCate
            ? (user.role === Role.sales || order?.itemGroupList?.length > 0) && (
                <Card>
                  <NewEditDetailsQuotationForm
                    customerOrder={customerOrder}
                    typeOfCategory={typeOfCategory}
                    setTypeOfCategory={setTypeOfCategory}
                    handleSetIsMultiCate={handleIsMultiCate}
                    handleSend={handleCreateAndSend}
                    loading={loadingSend}
                    order={order}
                    onOpenPreview={onOpen}
                    isAdd
                  />
                </Card>
              )
            : (user.role === Role.sales || order?.itemGroupList?.length > 0) && (
                <Card>
                  <MultipleItemGroupQuotation
                    customerOrder={customerOrder}
                    typeOfCategory={typeOfCategory}
                    setTypeOfCategory={setTypeOfCategory}
                    handleSetIsMultiCate={handleIsMultiCate}
                    handleSend={handleCreateAndSend}
                    loading={loadingSend}
                    order={order}
                    onOpenPreview={onOpen}
                    isAdd
                  />
                </Card>
              )}

          <CustomerListDialog
            open={openCustomerForm}
            onClose={onCloseCustomerForm}
            onSelect={handleGetCustomerFromDialog}
            createNewCustomer={onOpenCreateNewCustomer}
          />
          <NewCustomerDialog
            open={openCreateNewCustomer}
            onClose={onCloseCreateNewCustomer}
            setCustomer={handleGetCustomerFromDialog}
            setOrder={(order) => setOrder(order)}
          />

          <CommonBackdrop loading={loadingCreate || loadingSend} />

          <Dialog fullScreen open={open}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <DialogActions
                sx={{
                  zIndex: 9,
                  padding: '12px !important',
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
                <Tooltip title="Đóng">
                  <IconButton color="inherit" onClick={onClose}>
                    <Iconify icon={'eva:close-fill'} />
                  </IconButton>
                </Tooltip>
              </DialogActions>
              <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                  <PreviewQuotationCommonPDF
                    invoice={order}
                    values={values}
                    freightPrice={values?.freightPrice}
                    userValues={user}
                  />
                </PDFViewer>
              </Box>
            </Box>
          </Dialog>
        </FormProvider>
      </Container>
    </Page>
  );
}
