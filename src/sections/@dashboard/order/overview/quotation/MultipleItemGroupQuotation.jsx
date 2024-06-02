// noinspection JSUnresolvedReference,DuplicatedCode,JSCheckFunctionSignatures

import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Card, Divider, InputAdornment, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { LoadingButton } from '@mui/lab';
import { convertStringToNumber, fVietNamCurrency } from '../../../../../utils/formatNumber';
import Iconify from '../../../../../components/Iconify';
import useToggle from '../../../../../hooks/useToggle';
import ProductsDialog from '../../../../../components/dialog/ProductsDialog';
import RHFCurrencyField from '../../../../../components/hook-form/RHFCurrencyField';
import PreviewQuotationCommonPDF from '../../details/PreviewQuotationCommonPDF';
import useResponsive from '../../../../../hooks/useResponsive';
import useAuth from '../../../../../hooks/useAuth';
import RHFSwitchOrderCategoryType from '../../../../../components/hook-form/RHFSwitchOrderCategoryType';
import OrderOfQuotationListDialog from './OrderOfQuotationListDialog';
import CreateProductDialog from '../../../../../components/dialog/CreateProductDialog';
import RHFNumberField from '../../../../../components/hook-form/RHFNumberField';
import { useDispatch, useSelector } from '../../../../../redux/store';
import {
  addCategories,
  addInitCategories,
  deleteCategories,
  deleteCategoriesProduct,
  updateCategoryName,
} from '../../../../../redux/slices/product';
import { RHFTextField } from '../../../../../components/hook-form';
import AdditionalInfoForm from './AdditionalInfoForm';

// ----------------------------------------------------------------------
MultipleItemGroupQuotation.propTypes = {
  order: PropTypes.object,
  handleSend: PropTypes.func,
  loading: PropTypes.bool,
  isEdit: PropTypes.bool,
  onOpenPreview: PropTypes.func,
  handleSetIsMultiCate: PropTypes.func,
  typeOfCategory: PropTypes.string,
  setTypeOfCategory: PropTypes.func,
  customerOrder: PropTypes.array,
};
export default function MultipleItemGroupQuotation({
  order,
  handleSend,
  loading,
  onOpenPreview,
  isEdit,
  handleSetIsMultiCate,
  typeOfCategory,
  setTypeOfCategory,
  customerOrder,
}) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const {
    control,
    setValue,
    watch,
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext();
  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();
  const { toggle: openCustomerForm, onOpen: onOpenCustomerForm, onClose: onCloseCustomerForm } = useToggle();
  const {
    toggle: openCreateNewProduct,
    onOpen: onOpenCreateNewProduct,
    onClose: onCloseCreateNewProduct,
  } = useToggle();
  const mdUp = useResponsive('up', 'xl');

  const [numberCate, setNumberCate] = useState(0);

  const [idxCate, setIdxCate] = useState(0);

  const isCreateQuotation = pathname.includes('tao-bao-gia');

  const { categories, products } = useSelector((state) => state.product);

  const { append: productAppend, remove: productRemove } = useFieldArray({
    control,
    name: 'products',
  });

  const {
    fields: categoryFields,
    append: categoryAppend,
    remove: categoryRemove,
  } = useFieldArray({
    control,
    name: 'categories',
  });

  const values = watch();

  useEffect(() => {
    if (values.categories.length < 1 && categories.length > 0) {
      setValue('categories', categories);
      setNumberCate(categories.length);
    }
    if (values.products.length < 1 && products.length > 0) {
      setValue('products', products);
    }
  }, [values, categories, products, setValue]);

  const handleAdd = (products, idx) => {
    dispatch(addCategories({ products, idxCate }));
    const reducePrs = products.map((pr) => ({
      id: pr.id,
      name: pr.name,
      price: pr.price,
      quantity: 1,
      total: 0,
      weight: Number(pr.weight).toFixed(2),
      priceProduct: pr.price,
      weightProduct: Number(pr.weight).toFixed(2),
      description: pr.description,
      unit: pr.unit,
    }));
    reducePrs.forEach((pr) => {
      const isExisted =
        values?.categories[idx]?.orderDetailList?.length > 0
          ? values?.categories[idx]?.orderDetailList?.map((p) => p?.product?.id).includes(pr?.id)
          : values?.categories?.map((p) => p?.orderDetailList?.map((order) => order?.product?.id)).includes(pr.id);
      if (isExisted) {
        values?.categories[idx]?.orderDetailList?.map((el, index) => {
          if (el?.product?.id === pr.id) {
            setValue(
              `categories[${idx}].orderDetailList[${index}].quantity`,
              values?.categories[idx]?.orderDetailList[index]?.quantity + 1
            );
          }
          return values.categories;
        });
      } else {
        productAppend({
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
          weightProduct: pr.weight,
          indexCate: idxCate,
        });
        categoryFields[idx]?.orderDetailList?.push({
          product: {
            id: pr.id,
            name: pr.name,
            price: pr.price,
            weight: pr.weight,
          },
          quantity: pr.quantity,
          total: 0,
          priceProduct: pr.price,
          weightProduct: pr.weight,
          description: pr.description,
        });
      }
    });
  };

  const handleRemove = (idx, index) => {
    categoryFields[idx]?.orderDetailList?.splice(index, 1);
    productRemove(idx * categoryFields.length + index);
    dispatch(deleteCategoriesProduct({ index, idx }));
  };

  const cntVatTotalPrice = () => {
    let productTotalPrice = 0;
    // eslint-disable-next-line array-callback-return
    values?.categories?.forEach((category) => {
      const y = category?.orderDetailList?.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct) > 0
            ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
      productTotalPrice += y;
    });
    return (productTotalPrice * values?.vat) / 100;
  };

  const cntTotalPrice = () => {
    let productTotalPrice = 0;
    // eslint-disable-next-line array-callback-return
    values?.categories?.forEach((category) => {
      const y = category?.orderDetailList?.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct) > 0
            ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
      productTotalPrice += y;
    });
    return productTotalPrice + convertStringToNumber(values?.freightPrice) + cntVatTotalPrice();
  };

  const handleAddCategory = () => {
    dispatch(addInitCategories(numberCate));
    const category = {
      categoryId: numberCate,
      name: '',
      orderDetailList: [],
    };

    categoryAppend(category);
    setNumberCate(numberCate + 1);
  };
  const handleDeleteCate = (idx, categoryId) => {
    categoryRemove(idx);

    const removeIndex = values.products
      ?.map((item, index) => item.indexCate === idx && index)
      .filter((el) => el !== false);
    productRemove(removeIndex);

    dispatch(deleteCategories({ categoryId, idx }));
  };

  const orders = customerOrder.map((data) => data?.orders);
  const orderOfCustomer = orders.reduce((acc, val) => acc.concat(val), []);
  const orderSale = orderOfCustomer.filter((data) => data?.sale?.id === parseInt(user.id, 10));

  return (
    <>
      <Box sx={{ px: 3, pt: 2, pb: 3 }}>
        <Stack
          spacing={2}
          pb={1}
          // direction="row"
          direction={{ xs: 'column-reverse', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          {!isEdit && (
            <>
              <RHFSwitchOrderCategoryType
                handleSetIsMultiCate={handleSetIsMultiCate}
                typeOfCategory={typeOfCategory}
                setTypeOfCategory={setTypeOfCategory}
              />
            </>
          )}

          {!isCreateQuotation && (
            <Stack spacing={2} px={1} justifyContent="flex-end" direction="row" sx={{ width: 1 }}>
              <Typography variant="h6">Tổng đơn hàng</Typography>
              <Typography variant="h6">{fVietNamCurrency(cntTotalPrice())} VNĐ</Typography>
            </Stack>
          )}
        </Stack>

        {categoryFields.map((itemGroup, idx) => (
          <Card
            key={idx + 1}
            sx={{
              ...(idx % 2 === 0
                ? {
                    backgroundColor: 'background.neutral',
                  }
                : {
                    backgroundColor: 'background.default',
                  }),
              marginTop: 1,
              mb: 1.5,
            }}
          >
            <Stack px={3}>
              <Stack direction="row" justifyContent={'space-between'} sx={{ p: 0 }}>
                <Typography variant="h5" sx={{ py: 2 }}>
                  {`Hạng mục ${idx + 1}`}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={() => handleDeleteCate(idx, itemGroup.categoryId)}
                  sx={{ mt: 1.5 }}
                >
                  Xóa hạng mục
                </Button>
              </Stack>

              <RHFTextField
                fullWidth
                name={`categories[${idx}].name`}
                size="small"
                label="Tên hạng mục"
                value={values.categories[idx].name}
                onChange={(event) => {
                  const categoryName = event.target.value;
                  dispatch(updateCategoryName({ idx, categoryName }));
                  setValue(`categories[${idx}].name`, event.target.value);
                }}
                sx={{
                  '& fieldset': {
                    borderWidth: `1px !important`,
                    borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
                  },
                }}
              />

              <Stack direction="row" justifyContent="space-between" pt={3} pb={3}>
                <Button
                  size="small"
                  startIcon={<Iconify icon="ic:baseline-playlist-add-circle" />}
                  onClick={() => {
                    onOpenFrom();
                    setIdxCate(idx);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  Thêm sản phẩm
                </Button>
              </Stack>

              <Stack spacing={3}>
                {itemGroup.orderDetailList
                  ? itemGroup?.orderDetailList?.map((item, index) => (
                      <Stack key={index} alignItems="flex-end" spacing={1.5}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                          <RHFTextField
                            size="small"
                            name={`categories[${idx}].orderDetailList[${index}].product.name`}
                            label="Tên sản phẩm"
                            value={values.categories[idx].orderDetailList[index].product.name}
                            onChange={() => console.log('Không được sửa')}
                            InputLabelProps={{ shrink: true }}
                          />
                          <RHFTextField
                            size="small"
                            type="number"
                            name={`categories[${idx}].orderDetailList[${index}].quantity`}
                            label="Số lượng"
                            value={values.categories[idx].orderDetailList[index].quantity}
                            onChange={(event) =>
                              setValue(
                                `categories[${idx}].orderDetailList[${index}].quantity`,
                                Number(event.target.value)
                              )
                            }
                            sx={{ maxWidth: { md: 96 } }}
                          />
                          <RHFNumberField
                            size="small"
                            name={`categories[${idx}].orderDetailList[${index}].weightProduct`}
                            value={
                              values?.categories[idx]?.orderDetailList[index]?.weightProduct !== 0
                                ? values?.categories[idx]?.orderDetailList[index]?.weightProduct
                                : values?.categories[idx]?.orderDetailList[index]?.product?.weight
                            }
                            label="Đơn trọng (Kg)"
                            setValue={setValue}
                            InputProps={{
                              endAdornment: <InputAdornment position="start">KG</InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                            sx={{ maxWidth: { md: 120 } }}
                          />
                          <RHFCurrencyField
                            size="small"
                            name={`categories[${idx}].orderDetailList[${index}].priceProduct`}
                            label="Giá"
                            value={
                              values?.categories[idx]?.orderDetailList[index]?.priceProduct !== 0
                                ? fVietNamCurrency(values?.categories[idx]?.orderDetailList[index]?.priceProduct)
                                : fVietNamCurrency(values?.categories[idx]?.orderDetailList[index]?.product?.price)
                            }
                            setValue={setValue}
                            InputProps={{
                              endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                            }}
                            sx={{ maxWidth: { md: 250 } }}
                          />
                          <RHFTextField
                            size="small"
                            name={`categories[${idx}].orderDetailList[${index}].description`}
                            label="Ghi chú"
                            InputLabelProps={{ shrink: true }}
                            // sx={{ maxWidth: { md: 350 } }}
                          />
                          <RHFTextField
                            size="small"
                            name={`categories[${idx}].orderDetailList[${index}].total`}
                            label="Tổng"
                            value={
                              values?.categories[idx].orderDetailList[index]?.priceProduct !== 0
                                ? fVietNamCurrency(
                                    values?.categories[idx]?.orderDetailList[index]?.quantity *
                                      convertStringToNumber(
                                        values?.categories[idx]?.orderDetailList[index]?.priceProduct
                                      ) *
                                      values?.categories[idx]?.orderDetailList[index]?.weightProduct
                                  )
                                : fVietNamCurrency(
                                    values?.categories[idx]?.orderDetailList[index]?.quantity *
                                      convertStringToNumber(
                                        values?.categories[idx]?.orderDetailList[index]?.product?.price
                                      ) *
                                      values?.categories[idx]?.orderDetailList[index]?.product?.weight
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
                            onClick={() => handleRemove(idx, index)}
                          >
                            Xóa
                          </Button>
                        </Stack>
                      </Stack>
                    ))
                  : null}
              </Stack>
              <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
            </Stack>
          </Card>
        ))}
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="ic:baseline-playlist-add-circle" />}
          onClick={handleAddCategory}
          sx={{ flexShrink: 0 }}
        >
          Thêm hạng mục
        </Button>
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
        onSelect={(products) => handleAdd(products, idxCate)}
        createNewProduct={onOpenCreateNewProduct}
      />
      <CreateProductDialog open={openCreateNewProduct} onClose={onCloseCreateNewProduct} />
      <OrderOfQuotationListDialog open={openCustomerForm} onClose={onCloseCustomerForm} orders={orderSale} />
    </>
  );
}
