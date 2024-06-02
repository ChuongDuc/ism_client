// noinspection JSValidateTypes,DuplicatedCode

import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  convertStringToNumber,
  formatNumberWithCommas,
  formatPhoneNumber,
  fVietNamCurrency,
} from '../../../../utils/formatNumber';
import styles from './InvoiceStyle';
import { fDateToDay, fDateToMonth, fDateToYear } from '../../../../utils/formatTime';
import { formatUnit } from '../../../../utils/getFormatProduct';

// ----------------------------------------------------------------------

InvoicePDFTmp.propTypes = {
  invoice: PropTypes.object,
  formMethod: PropTypes.any,
  isEdit: PropTypes.bool,
};

export default function InvoicePDFTmp({ invoice, formMethod, isEdit }) {
  const {
    customer,
    freightPrice,
    sale,
    paymentList,
    itemGroupList,
    totalMoney,
    executionTimeDescription,
    deliveryMethodDescription,
    // createdAt,
    deliverAddress,
    VAT,
    reportingValidityAmount,
    percentOfAdvancePayment,
    updatedAt,
    shippingTax,
  } = invoice;
  const [totalPayment, setTotalPayment] = useState(0);

  const [paymentLeft, setPaymentLeft] = useState(0);

  const [itemGroupListPdf, setItemGroupListPdf] = useState([]);

  const values = formMethod?.watch();

  const vat = (totalMoney * VAT) / 100;

  const tax = (freightPrice * shippingTax) / 100;

  const totalPrice = totalMoney + freightPrice + vat + tax;

  let productTotalPrice = 0;
  if (values?.categories.length < 1) {
    if (values?.products.length < 0) {
      productTotalPrice = 0;
    } else {
      productTotalPrice = values?.products?.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct)
            ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
    }
  } else if (values?.categories.length >= 1) {
    values?.categories?.forEach((category) => {
      const y = category?.orderDetailList?.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct)
            ? total + convertStringToNumber(data?.priceProduct) * Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
      productTotalPrice += y;
    });
  }
  let totalWeightEdit = 0;
  if (values?.categories.length < 1) {
    if (values?.products.length < 0) {
      totalWeightEdit = 0;
    } else {
      totalWeightEdit = values?.products?.reduce(
        (total, data) =>
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct)
            ? total + Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
    }
  } else if (values?.categories.length >= 1) {
    values?.categories?.forEach((category) => {
      const y = category?.orderDetailList?.reduce(
        (total, data) =>
          data?.priceProduct &&
          data?.quantity &&
          convertStringToNumber(data?.priceProduct) > 0 &&
          Number(data?.quantity) > 0 &&
          data?.weightProduct &&
          Number(data?.weightProduct)
            ? total + Number(data?.quantity) * Number(data?.weightProduct)
            : total,
        0
      );
      totalWeightEdit += y;
    });
  }
  let totalQuantityEdit = 0;
  if (values?.categories.length < 1) {
    if (values?.products.length < 0) {
      totalQuantityEdit = 0;
    } else {
      totalQuantityEdit = values?.products?.reduce(
        (total, data) => (data?.quantity && Number(data?.quantity) > 0 ? total + Number(data?.quantity) : total),
        0
      );
    }
  } else if (values?.categories.length >= 1) {
    values?.categories?.forEach((category) => {
      const y = category?.orderDetailList?.reduce(
        (total, data) => (data?.quantity && Number(data?.quantity) > 0 ? total + Number(data?.quantity) : total),
        0
      );
      totalQuantityEdit += y;
    });
  }

  let vatProductTotalPrice = 0;

  let shippingTaxForm = 0;
  if (isEdit) {
    vatProductTotalPrice = (productTotalPrice * values?.vat) / 100;

    shippingTaxForm = (convertStringToNumber(values?.freightPrice) * values?.shippingTax) / 100;
  }

  const orderTotalMoney =
    productTotalPrice + convertStringToNumber(values?.freightPrice) + vatProductTotalPrice + shippingTaxForm;
  const totalWeight = itemGroupList.reduce(
    (total, data) =>
      total +
      data.orderDetailList.reduce((total, orderDetail) => total + orderDetail.quantity * orderDetail?.weightProduct, 0),
    0
  );
  const totalQuantity = itemGroupList.reduce(
    (total, data) => total + data.orderDetailList.reduce((total, orderDetail) => total + orderDetail.quantity, 0),
    0
  );

  useEffect(() => {
    if (paymentList.length > 0) {
      setTotalPayment(paymentList?.map((payment) => payment.money).reduce((total, money) => total + money));
    }
  }, [paymentList]);

  useEffect(() => {
    if (values && isEdit === true && itemGroupList.length <= 1) {
      setItemGroupListPdf(values?.products);
    } else if (values && isEdit === true && itemGroupList.length > 1) {
      setItemGroupListPdf(values?.categories);
    } else {
      setItemGroupListPdf(itemGroupList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, values]);

  useEffect(() => {
    if (totalPayment > 0) {
      if (values && isEdit === true) {
        setPaymentLeft(Math.abs(Number(totalPayment) - Number(orderTotalMoney)));
      }
      setPaymentLeft(Math.abs(Number(totalPayment) - Number(totalPrice)));
    }
  }, [totalPayment, totalPrice, orderTotalMoney, values, isEdit]);

  // console.log('itemGroupListPdf', itemGroupList);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header]}>
          <Image source="/logo/cmd-steel-logo-2.png" style={{ height: '100px', width: '150px', marginTop: -20 }} />
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 65, left: 27, fontSize: 11, color: '#353538' }}
          >
            {'Điện thoại: 04.858.92918'}
          </Text>
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 78, left: 27, fontSize: 11, color: '#353538' }}
          >
            {'Fax: 043.3560.129'}
          </Text>
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 92, left: 27, fontSize: 11, color: '#353538' }}
          >
            {`Di động:${formatPhoneNumber(sale?.phoneNumber)}`}
          </Text>
        </View>

        <View style={[styles.headlineContainer, styles.pt140]}>
          <Text style={[styles.h3]}>BÁO GIÁ KIÊM XÁC NHẬN ĐƠN HÀNG</Text>
        </View>

        <View style={[styles.tableRow]}>
          <View style={[styles.headerCell2]}>
            <Text style={[styles.bodyHeader, styles.alignLeft]}>Trân trọng báo cho:</Text>
          </View>
          <View style={[styles.headerCell6]}>
            <Text style={[styles.bodyHeader, styles.alignLeft, styles.ml2]}>MR/MS.{customer?.name}</Text>
          </View>
          <View style={[styles.headerCell7]}>
            <Text style={[styles.bodyHeader, styles.alignCenter]}>Điện thoại:</Text>
          </View>
          <View style={[styles.headerCell4]}>
            <Text style={[styles.bodyHeader, styles.alignLeft]}>{customer?.phoneNumber}</Text>
          </View>
        </View>
        <View style={[styles.tableRow]}>
          <View style={[styles.cell4WithBorder]}>
            <Text style={[styles.bodyHeader, styles.alignCenter]}>Đơn vị:</Text>
          </View>

          <View style={[styles.tableCell]}>
            <Text style={[styles.bodyHeader, styles.alignLeft, styles.ml2]}>{customer?.company?.companyName}</Text>
          </View>
        </View>
        <View style={[styles.tableRow]}>
          <View style={[styles.cell4WithBorder]}>
            <Text style={[styles.bodyHeader, styles.alignLeft]}>Địa chỉ:</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Text style={[styles.bodyHeader, styles.alignLeft, styles.ml2]}>
              {values && isEdit === true ? values?.deliverAddress : deliverAddress}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb8]}>
          <Text style={styles.bodyHeader}>
            Giá thép hình, U, I, L, H, tấm lá, thép ống hộp đen, thép ống hộp mạ kẽm và phụ kiện như sau:
          </Text>
        </View>

        <View style={styles.tableWithBorder}>
          <View style={[styles.tableBorder]} fixed>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Stt</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell2WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Sản phẩm</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Đvt</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>S.L</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Đơn trọng (Kg/Đvt)</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Tổng trọng (Kg)</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Đơn giá</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Thành tiền</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell9WithBorder, styles.lastCellWithBorderBase]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>Ghi chú</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {isEdit === true ? (
              <View>
                {itemGroupListPdf && values?.categories.length > 0
                  ? itemGroupListPdf.map((row, index) => (
                      <div key={index}>
                        <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
                          <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                            <Text style={[styles.subtitle2, styles.alignCenter]}>{`H${index + 1}`}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                            <Text style={[styles.subtitle2, styles.alignCenter]}>{row?.name}</Text>
                          </View>
                          <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]} />
                          <View
                            style={[
                              styles.tableCellWithBorderBase,
                              styles.lastCellWithBorderBase,
                              styles.cell9WithBorder,
                            ]}
                          />
                        </View>
                        {row?.orderDetailList?.map((orderDetail, idx) => (
                          <View style={[styles.tableRow, styles.tableBodyRow]} key={index.toString() + idx}>
                            <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                              <Text style={[styles.alignCenter]}>{idx + 1}</Text>
                            </View>

                            <View
                              style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}
                            >
                              <Text style={[styles.alignLeft]}>{orderDetail?.product?.name}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                              <Text style={[styles.alignCenter]}>{formatUnit(orderDetail?.product)}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                              <Text style={[styles.alignCenter]}>{orderDetail?.quantity}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                              <Text style={[styles.alignCenter]}>{orderDetail?.weightProduct}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                              <Text style={[styles.alignCenter]}>
                                {formatNumberWithCommas(orderDetail?.weightProduct * orderDetail.quantity)}
                              </Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                              <Text style={[styles.alignRight, { marginRight: 2 }]}>
                                {fVietNamCurrency(convertStringToNumber(orderDetail?.priceProduct))}
                              </Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                              <Text style={[styles.alignRight, { marginRight: 2 }]}>
                                {fVietNamCurrency(
                                  convertStringToNumber(orderDetail?.priceProduct) *
                                    Number(orderDetail?.quantity) *
                                    Number(orderDetail?.weightProduct)
                                )}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.tableCellWithBorderBase,
                                styles.lastCellWithBorderBase,
                                styles.cell9WithBorder,
                              ]}
                            >
                              <Text style={[styles.alignCenter]}>{orderDetail?.description}</Text>
                            </View>
                          </View>
                        ))}
                      </div>
                    ))
                  : itemGroupListPdf?.map((orderDetail, index) => (
                      <View style={[styles.tableRow, styles.tableBodyRow]} key={index}>
                        <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                          <Text style={[styles.alignCenter]}>{index + 1}</Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                          <Text style={[styles.alignCenter]}>{orderDetail?.product?.name}</Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                          <Text style={[styles.alignCenter]}>{formatUnit(orderDetail?.product)}</Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                          <Text style={[styles.alignCenter]}>{orderDetail?.quantity}</Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                          <Text style={[styles.alignCenter]}>{orderDetail?.weightProduct}</Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                          <Text style={[styles.alignCenter]}>
                            {formatNumberWithCommas(orderDetail?.weightProduct * orderDetail.quantity)}
                          </Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                          <Text style={[styles.alignRight, { marginRight: 2 }]}>
                            {fVietNamCurrency(convertStringToNumber(orderDetail?.priceProduct))}
                          </Text>
                        </View>

                        <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                          <Text style={[styles.alignRight, { marginRight: 2 }]}>
                            {fVietNamCurrency(
                              convertStringToNumber(orderDetail?.priceProduct) *
                                Number(orderDetail?.quantity) *
                                Number(orderDetail?.weightProduct)
                            )}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.tableCellWithBorderBase,
                            styles.lastCellWithBorderBase,
                            styles.cell9WithBorder,
                          ]}
                        >
                          <Text style={[styles.alignCenter]}>{orderDetail?.description}</Text>
                        </View>
                      </View>
                    ))}
              </View>
            ) : (
              <View>
                {itemGroupListPdf && itemGroupListPdf.length > 1
                  ? itemGroupListPdf.map((row, index) => (
                      <div key={index}>
                        <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
                          <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                            <Text style={[styles.subtitle2, styles.alignCenter]}>{`H${index + 1}`}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                            <Text style={[styles.subtitle2, styles.alignCenter]}>{row?.name}</Text>
                          </View>
                          <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]} />
                          <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]} />
                          <View
                            style={[
                              styles.tableCellWithBorderBase,
                              styles.lastCellWithBorderBase,
                              styles.cell9WithBorder,
                            ]}
                          />
                        </View>
                        {row?.orderDetailList?.map((orderDetail, idx) => (
                          <View style={[styles.tableRow, styles.tableBodyRow]} key={index.toString() + idx}>
                            <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                              <Text style={[styles.alignCenter]}>{idx + 1}</Text>
                            </View>

                            <View
                              style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}
                            >
                              <Text style={[styles.alignLeft]}>{orderDetail?.product?.name}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                              <Text style={[styles.alignCenter]}>{formatUnit(orderDetail?.product)}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                              <Text style={[styles.alignCenter]}>{orderDetail?.quantity}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                              <Text style={[styles.alignCenter]}>{orderDetail?.weightProduct}</Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                              <Text style={[styles.alignCenter]}>
                                {formatNumberWithCommas(orderDetail?.weightProduct * orderDetail.quantity)}
                              </Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                              <Text style={[styles.alignRight, { marginRight: 2 }]}>
                                {fVietNamCurrency(convertStringToNumber(orderDetail?.priceProduct))}
                              </Text>
                            </View>

                            <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                              <Text style={[styles.alignRight, { marginRight: 2 }]}>
                                {fVietNamCurrency(
                                  convertStringToNumber(orderDetail?.priceProduct) *
                                    Number(orderDetail?.quantity) *
                                    Number(orderDetail?.weightProduct)
                                )}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.tableCellWithBorderBase,
                                styles.lastCellWithBorderBase,
                                styles.cell9WithBorder,
                              ]}
                            >
                              <Text style={[styles.alignCenter]}>{orderDetail?.description}</Text>
                            </View>
                          </View>
                        ))}
                      </div>
                    ))
                  : itemGroupListPdf.map((row, index) =>
                      row?.orderDetailList?.map((orderDetail, idx) => (
                        <View style={[styles.tableRow, styles.tableBodyRow]} key={index.toString() + idx}>
                          <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                            <Text style={[styles.alignCenter]}>{idx + 1}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                            <Text style={[styles.alignCenter]}>{orderDetail?.product?.name}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                            <Text style={[styles.alignCenter]}>{formatUnit(orderDetail?.product)}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                            <Text style={[styles.alignCenter]}>{orderDetail?.quantity}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                            <Text style={[styles.alignCenter]}>{orderDetail?.weightProduct}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                            <Text style={[styles.alignCenter]}>
                              {formatNumberWithCommas(orderDetail?.weightProduct * orderDetail.quantity)}
                            </Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                            <Text style={[styles.alignRight, { marginRight: 2 }]}>
                              {fVietNamCurrency(convertStringToNumber(orderDetail?.priceProduct))}
                            </Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                            <Text style={[styles.alignRight, { marginRight: 2 }]}>
                              {fVietNamCurrency(
                                convertStringToNumber(orderDetail?.priceProduct) *
                                  Number(orderDetail?.quantity) *
                                  Number(orderDetail?.weightProduct)
                              )}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.tableCellWithBorderBase,
                              styles.lastCellWithBorderBase,
                              styles.cell9WithBorder,
                            ]}
                          >
                            <Text style={[styles.alignCenter]}>{orderDetail?.description}</Text>
                          </View>
                        </View>
                      ))
                    )}
              </View>
            )}
            <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
              <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>I</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Cộng</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>
              <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                <Text style={[styles.alignCenter]}>
                  {values && isEdit === true ? Number(totalQuantityEdit) : Number(totalQuantity)}
                </Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                <Text style={[styles.alignCenter]}>
                  {values && isEdit === true
                    ? formatNumberWithCommas(totalWeightEdit)
                    : formatNumberWithCommas(totalWeight)}
                </Text>
              </View>
              <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                  {values && isEdit === true
                    ? fVietNamCurrency(Number(productTotalPrice))
                    : fVietNamCurrency(Number(totalMoney))}
                </Text>
              </View>

              <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                <Text />
              </View>
            </View>
            <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
              <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>II</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Thuế VAT</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>
              <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>
              <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                  {vatProductTotalPrice > 0
                    ? fVietNamCurrency(Number(vatProductTotalPrice))
                    : fVietNamCurrency(Number(vat))}
                </Text>
              </View>

              <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                <Text />
              </View>
            </View>

            {isEdit && isEdit === true ? (
              <View>
                {values?.categories.length > 0 ? (
                  <View style={[styles.tableRow, styles.tableBodyRow]}>
                    <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                      <Text style={[styles.borderBody2, styles.alignCenter]}>III</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                      <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>
                        {`Tiền vận chuyển (${values && isEdit === true ? values?.shippingTax : shippingTax}%)`}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>
                    <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                      <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                        {values && isEdit === true
                          ? fVietNamCurrency(
                              convertStringToNumber(convertStringToNumber(values?.freightPrice) + shippingTaxForm)
                            )
                          : fVietNamCurrency(Number(freightPrice + tax))}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                      <Text />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.tableRow, styles.tableBodyRow]}>
                    <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                      <Text style={[styles.borderBody2, styles.alignCenter]}>III</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                      <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>
                        {`Tiền vận chuyển (${values && isEdit === true ? values?.shippingTax : shippingTax}%)`}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>
                    <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                      <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                        {values && isEdit === true
                          ? fVietNamCurrency(
                              convertStringToNumber(convertStringToNumber(values?.freightPrice) + shippingTaxForm)
                            )
                          : fVietNamCurrency(Number(freightPrice + tax))}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                      <Text />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {itemGroupListPdf.length > 1 ? (
                  <View style={[styles.tableRow, styles.tableBodyRow]}>
                    <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                      <Text style={[styles.borderBody2, styles.alignCenter]}>III</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                      <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>
                        {`Tiền vận chuyển (${values && isEdit === true ? values?.shippingTax : shippingTax}%)`}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>
                    <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                      <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                        {values && isEdit === true
                          ? fVietNamCurrency(
                              convertStringToNumber(convertStringToNumber(values?.freightPrice) + shippingTaxForm)
                            )
                          : fVietNamCurrency(Number(freightPrice + tax))}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                      <Text />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.tableRow, styles.tableBodyRow]}>
                    <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                      <Text style={[styles.borderBody2, styles.alignCenter]}>III</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                      <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>
                        {`Tiền vận chuyển (${values && isEdit === true ? values?.shippingTax : shippingTax}%)`}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>
                    <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                      <Text style={[styles.alignCenter]} />
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                      <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                        {values && isEdit === true
                          ? fVietNamCurrency(
                              convertStringToNumber(convertStringToNumber(values?.freightPrice) + shippingTaxForm)
                            )
                          : fVietNamCurrency(Number(freightPrice + tax))}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                      <Text />
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={[styles.tableRow, styles.tableBodyRow, { backgroundColor: '#cbdaf5' }]} wrap={false}>
              <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                <Text style={[styles.borderBody2, styles.alignCenter]}>IV</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Tổng cộng</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>
              <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                <Text style={[styles.alignCenter]} />
              </View>
              <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                  {vatProductTotalPrice > 0
                    ? fVietNamCurrency(Number(orderTotalMoney))
                    : fVietNamCurrency(Number(totalPrice))}
                </Text>
              </View>

              <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                <Text />
              </View>
            </View>
          </View>

          {paymentList.length > 0 && (
            <>
              {paymentList.length > 0 && (
                <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
                  <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                    <Text style={[styles.borderBody2, styles.alignCenter]}>IV</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell2WithBorder]}>
                    <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>
                      Khách thanh toán
                    </Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>
                  <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>
                  <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                    <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                      {values && isEdit === true
                        ? fVietNamCurrency(Number(totalPayment))
                        : fVietNamCurrency(Number(totalPayment))}
                    </Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                    <Text />
                  </View>
                </View>
              )}
              {paymentList.map((payment, index) => (
                <View key={index} style={[styles.tableRow, styles.tableBodyRow]} wrap>
                  <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                    <Text style={[styles.borderBody2NoBold, styles.alignCenter]}>{index + 1}</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell2WithBorder]}>
                    <Text
                      wrap={false}
                      style={[
                        styles.borderBody2NoBold,
                        styles.marginLeft2px,
                        styles.alignLeft,
                        { alignItems: 'center' },
                      ]}
                    >
                      {payment?.description}
                    </Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>
                  <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                    <Text style={[styles.alignCenter]} />
                  </View>
                  <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                    <Text style={[styles.borderBody2NoBold, styles.alignRight, { marginRight: 2 }]}>
                      {fVietNamCurrency(Number(payment?.money))}
                    </Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                    <Text />
                  </View>
                </View>
              ))}
              <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
                <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cell2WithBorder]}>
                  <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>
                    {Number(totalPayment) > Number(totalPrice) ? 'Thừa của khách' : 'Còn lại'}
                  </Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                  <Text style={[styles.alignCenter]} />
                </View>
                <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                  <Text style={[styles.alignCenter]} />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                  <Text style={[styles.alignCenter]} />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                  <Text style={[styles.alignCenter]} />
                </View>
                <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                  <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                    <Text style={[styles.alignRight, { marginRight: 2 }]}>{fVietNamCurrency(Number(paymentLeft))}</Text>
                  </Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                  <Text />
                </View>
              </View>
            </>
          )}
        </View>

        <View style={[styles.gridContainer, styles.mb8]} wrap={false}>
          <View style={[styles.col60, { paddingTop: 5 }]}>
            <Text style={[styles.overline]}>- Thanh toán bằng chuyển khoản</Text>
            <Text style={[styles.overline]}>{`- Đã bao gồm ${
              values && isEdit === true ? values?.vat : VAT
            }% thuế VAT`}</Text>
            <Text style={[styles.overline]}>{`- Báo giá có hiệu lực ${
              values?.reportingValidity ?? reportingValidityAmount
            } ngày`}</Text>

            <Text style={[styles.overline]}>{`- Thanh toán ${
              values && isEdit === true ? values?.pay : percentOfAdvancePayment
            }% đơn hàng ngay khi đặt hàng`}</Text>

            {(values?.executionTime || executionTimeDescription) && (
              <Text style={[styles.overline]}>
                {`- Thời gian thực hiện: ${
                  values && isEdit === true ? values?.executionTime : executionTimeDescription
                }`}
              </Text>
            )}

            {(values?.deliveryMethod || deliveryMethodDescription) && (
              <Text style={[styles.overline]}>{`- Phương thức giao hàng: ${
                values && isEdit === true ? values?.deliveryMethod : deliveryMethodDescription
              }`}</Text>
            )}
          </View>

          <View style={[styles.col40FlexEnd, { paddingTop: 5 }]}>
            <Text style={[styles.h5, { textAlign: 'center', alignItems: 'center' }]}>{`Hà nội, ngày ${fDateToDay(
              updatedAt
            )} tháng ${fDateToMonth(updatedAt)} năm ${fDateToYear(updatedAt)}`}</Text>
            <Text
              style={[
                styles.h5,
                styles.mb4,
                { textAlign: 'center', alignSelf: 'center', alignItems: 'center', marginLeft: 25 },
              ]}
            >
              NGƯỜI BÁO GIÁ
            </Text>
            <Text
              style={[
                styles.h5,
                styles.mb4,
                { textAlign: 'center', alignSelf: 'center', alignItems: 'center', marginLeft: 25 },
              ]}
            >
              {sale?.fullName} - {sale?.phoneNumber}
            </Text>
          </View>
        </View>

        <View style={[styles.footer]}>
          <Image source="/static/footer-quotation.png" style={{ opacity: 0.9 }} />
        </View>
      </Page>
    </Document>
  );
}
