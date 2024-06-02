// noinspection JSCheckFunctionSignatures,JSUnresolvedFunction

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Divider, InputAdornment, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { isEmpty } from 'lodash';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import React from 'react';
import { RHFTextField } from '../../components/hook-form';
import RHFNumberField from '../../components/hook-form/RHFNumberField';
import RHFCurrencyField from '../../components/hook-form/RHFCurrencyField';
import Iconify from '../../components/Iconify';
import RHFSwitchOrderCategoryType from '../../components/hook-form/RHFSwitchOrderCategoryType';
import useToggle from '../../hooks/useToggle';
import useResponsive from '../../hooks/useResponsive';
import AdditionalInfoForm from '../../sections/@dashboard/order/overview/quotation/AdditionalInfoForm';
import PreviewQuotationCommonPDF from '../../sections/@dashboard/order/details/PreviewQuotationCommonPDF';
import ProductsDialog from '../../components/dialog/ProductsDialog';
import OrderOfQuotationListDialog from '../../sections/@dashboard/order/overview/quotation/OrderOfQuotationListDialog';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from '../../redux/store';
import { addProducts, deleteProducts } from '../../redux/slices/product';
import { convertStringToNumber, fVietNamCurrency } from '../../utils/formatNumber';
import CreateProductDialog from '../../components/dialog/CreateProductDialog';

// ----------------------------------------------------------------------
NewEditDetailsQuotationForm.propTypes = {
  order: PropTypes.object,
  handleSend: PropTypes.func,
  loading: PropTypes.bool,
  isEdit: PropTypes.bool,
  onOpenPreview: PropTypes.func,
  handleSetIsMultiCate: PropTypes.func,
  typeOfCategory: PropTypes.string,
  setTypeOfCategory: PropTypes.func,
  customerOrder: PropTypes.array,
  isAdd: PropTypes.bool,
};

export default function NewEditDetailsQuotationForm({
  order,
  handleSend,
  loading,
  onOpenPreview,
  handleSetIsMultiCate,
  isEdit,
  typeOfCategory,
  setTypeOfCategory,
  customerOrder,
  isAdd,
}) {
  const { user } = useAuth();

  const dispatch = useDispatch();

  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();
  const { toggle: openCustomerForm, onOpen: onOpenCustomerForm, onClose: onCloseCustomerForm } = useToggle();

  const {
    toggle: openCreateNewProduct,
    onOpen: onOpenCreateNewProduct,
    onClose: onCloseCreateNewProduct,
  } = useToggle();
  const {
    control,
    setValue,
    watch,
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext();

  const mdUp = useResponsive('up', 'xl');

  const { pathname } = useLocation();

  const isCreateQuotation = pathname.includes('tao-moi');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const values = watch();

  const handleAdd = (products) => {
    if (isAdd) {
      dispatch(addProducts(products));
    }
    const reducePrs = products.map((pr) => ({
      id: pr.id,
      name: pr.name,
      price: pr.price,
      quantity: 1,
      total: 0,
      weight: Number(pr.weight).toFixed(2),
      priceProduct: pr.price,
      description: pr.description,
      unit: pr.unit,
      weightProduct: Number(pr.weight).toFixed(2),
    }));
    reducePrs.forEach((pr) => {
      const isExisted = values.products.map((p) => p?.product?.id).includes(pr.id);
      if (isExisted) {
        values?.products?.map((el, index) => {
          if (el.product.id === pr.id) {
            setValue(`products[${index}].quantity`, values.products[index].quantity + 1);
          }
          return values.products;
        });
      } else {
        append({
          product: {
            id: pr.id,
            name: pr.name,
            price: pr.price,
            weight: pr.weight,
            unit: pr.unit,
          },
          quantity: 1,
          total: 0,
          priceProduct: pr.price,
          description: pr.description,
          weightProduct: pr.weightProduct,
        });
      }
    });
  };

  const handleRemove = (index, productId) => {
    remove(index);
    dispatch(deleteProducts(productId));
  };
  const vat =
    (values.products.reduce(
      (total, data) =>
        data?.priceProduct &&
        data?.quantity &&
        data?.weightProduct &&
        convertStringToNumber(data?.priceProduct) > 0 &&
        Number(data?.quantity) > 0 &&
        Number(data?.weightProduct) > 0
          ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
          : total + 0,
      0
    ) *
      values?.vat) /
    100;
  const cntTotalPrice = () =>
    values.products.reduce(
      (total, data) =>
        data?.priceProduct &&
        data?.quantity &&
        data?.weightProduct &&
        convertStringToNumber(data?.priceProduct) > 0 &&
        Number(data?.quantity) > 0 &&
        Number(data?.weightProduct) > 0
          ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
          : total + 0,
      0
    ) +
    convertStringToNumber(values.freightPrice) +
    vat;

  const orders = customerOrder.map((data) => data?.orders);
  const orderOfCustomer = orders.reduce((acc, val) => acc.concat(val), []);
  const orderSale = orderOfCustomer.filter((data) => data?.sale?.id === parseInt(user.id, 10));

  return (
    <>
      <Box sx={{ px: { sx: 0.5, md: 3 }, pt: 2, pb: 3 }}>
        {fields.length > 0 && (
          <Stack spacing={2} pt={1}>
            {fields.map((item, index) => (
              <Stack key={index} alignItems="flex-end" spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <RHFTextField
                    size="small"
                    name={`products[${index}].product.name`}
                    label="Tên sản phẩm"
                    onChange={() => console.log('Không được sửa')}
                    InputLabelProps={{ shrink: true }}
                  />

                  <RHFTextField
                    size="small"
                    type="number"
                    name={`products[${index}].quantity`}
                    label="Số lượng"
                    onChange={(event) => setValue(`products[${index}].quantity`, Number(event.target.value))}
                    sx={{ maxWidth: { md: 96 } }}
                  />

                  <RHFNumberField
                    size={'small'}
                    name={`products[${index}].weightProduct`}
                    label="Đơn trọng (Kg)"
                    placeholder="0"
                    value={
                      values.products[index].weightProduct !== 0
                        ? values.products[index].weightProduct
                        : values.products[index].product.weight
                    }
                    InputProps={{
                      endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                    }}
                    setValue={setValue}
                    InputLabelProps={{ shrink: true }}
                  />

                  <RHFCurrencyField
                    size="small"
                    name={`products[${index}].priceProduct`}
                    label="Giá"
                    value={
                      values.products[index].priceProduct !== 0
                        ? fVietNamCurrency(values.products[index].priceProduct)
                        : fVietNamCurrency(values.products[index].product.price)
                    }
                    setValue={setValue}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                    }}
                    sx={{ maxWidth: { md: 250 } }}
                  />

                  <RHFTextField
                    size="small"
                    name={`products[${index}].description`}
                    label="Ghi chú"
                    value={values.products[index].description ? values.products[index].description : ''}
                    InputLabelProps={{ shrink: true }}
                    // sx={{ maxWidth: { md: 350 } }}
                  />

                  <RHFTextField
                    size="small"
                    name={`products[${index}].total`}
                    label="Tổng"
                    value={
                      values.products[index].priceProduct !== values.products[index].price
                        ? fVietNamCurrency(
                            values.products[index].quantity *
                              convertStringToNumber(values.products[index].priceProduct) *
                              values.products[index].weightProduct
                          )
                        : fVietNamCurrency(
                            values.products[index].quantity *
                              convertStringToNumber(values.products[index].product.price) *
                              values.products[index].product.weight
                          )
                    }
                    InputProps={{
                      endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                    }}
                    sx={{ maxWidth: { md: 220 } }}
                  />

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemove(index, item.product.id)}
                  >
                    Xóa
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
        {values.products.length > 0 && <Divider sx={{ my: 2, borderStyle: 'dashed' }} />}
        <Stack
          spacing={2}
          // direction="row"
          direction={{ xs: 'column-reverse', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          {!isEdit && (
            <RHFSwitchOrderCategoryType
              handleSetIsMultiCate={handleSetIsMultiCate}
              typeOfCategory={typeOfCategory}
              setTypeOfCategory={setTypeOfCategory}
            />
          )}

          {!isCreateQuotation && (
            <Stack justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
              <Typography variant="h6">Tổng đơn hàng: </Typography>
              <Typography variant="h6">{`${fVietNamCurrency(cntTotalPrice())} VNĐ`}</Typography>
            </Stack>
          )}
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} pr={1} pt={1}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Iconify icon="ic:baseline-playlist-add-circle" />}
            onClick={onOpenFrom}
            sx={{ flexShrink: 0, maxHeight: '38px' }}
          >
            Thêm sản phẩm
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={onOpenCreateNewProduct}
            sx={{ flexShrink: 0, maxHeight: '38px', mx: 3 }}
          >
            Tạo sản phẩm
          </Button>
        </Stack>

        <AdditionalInfoForm />

        {!isEdit && (
          <Stack direction="row" display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Box width={{ xs: '100%', md: '50%' }}>
              <Stack direction="row" display="flex" justifyContent="flex-end" spacing={2} sx={{ flexGrow: 1 }}>
                <Box width="25%">
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    startIcon={<Iconify icon="mdi:printer-preview" />}
                    color="warning"
                    onClick={onOpenPreview}
                  >
                    {mdUp ? 'Xem PDF' : 'Xem'}
                  </Button>
                </Box>
                <Box width="25%">
                  <PDFDownloadLink
                    document={
                      <PreviewQuotationCommonPDF
                        invoice={order}
                        values={values}
                        freightPrice={values?.freightPrice}
                        userValues={user}
                      />
                    }
                    fileName={order?.invoiceNo}
                  >
                    <Button
                      size="medium"
                      fullWidth
                      variant="contained"
                      startIcon={<Iconify icon="fluent:cloud-download-20-filled" />}
                      sx={{ flexShrink: 0, maxHeight: '26px' }}
                    >
                      {mdUp ? 'Tải báo giá' : 'Tải'}
                    </Button>
                  </PDFDownloadLink>
                </Box>
                <Box width="25%">
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    disabled={isEmpty(values?.customer)}
                    startIcon={<Iconify icon="carbon:recently-viewed" />}
                    sx={{ flexShrink: 0, maxHeight: '26px' }}
                    onClick={onOpenCustomerForm}
                  >
                    {mdUp ? 'Hợp đồng gần đây' : 'HĐ'}
                  </Button>
                </Box>
                <Box width="25%">
                  <LoadingButton
                    fullWidth
                    size="small"
                    variant="contained"
                    disabled={isEmpty(values.customer) || values.products.length < 1}
                    loading={loading && isSubmitting}
                    color="error"
                    startIcon={<Iconify icon="fluent:form-new-20-regular" />}
                    onClick={handleSubmit(handleSend)}
                  >
                    {mdUp ? 'Tạo báo giá' : 'Tạo'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}
      </Box>
      {isEdit && (
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3, mb: 3, mr: 3 }}>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(handleSend)}
          >
            Cập nhật
          </LoadingButton>
        </Stack>
      )}

      <ProductsDialog
        open={openFrom}
        onClose={onCloseFrom}
        onSelect={(products) => handleAdd(products)}
        createNewProduct={onOpenCreateNewProduct}
      />
      <CreateProductDialog open={openCreateNewProduct} onClose={onCloseCreateNewProduct} onSelect={handleAdd} />
      <OrderOfQuotationListDialog open={openCustomerForm} onClose={onCloseCustomerForm} orders={orderSale} />
    </>
  );
}
