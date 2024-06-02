// noinspection JSValidateTypes,DuplicatedCode

import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
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

PreviewQuotationCommonPDF.propTypes = {
  invoice: PropTypes.any,
  freightPrice: PropTypes.any,
  values: PropTypes.object.isRequired,
  userValues: PropTypes.object,
};

export default function PreviewQuotationCommonPDF({ invoice, freightPrice, values, userValues }) {
  let productTotalPrice = 0;
  let totalQuantity = 0;
  let totalWeight = 0;
  if (values.products.length > 0) {
    productTotalPrice = values.products.reduce(
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
    totalQuantity = values.products.reduce(
      (total, data) => (data?.quantity && Number(data?.quantity) > 0 ? total + Number(data?.quantity) : total),
      0
    );
    totalWeight = values.products.reduce(
      (total, data) =>
        data?.weightProduct && Number(data?.weightProduct) ? total + Number(data?.weightProduct) : total,
      0
    );
  }

  const vat = (productTotalPrice * values?.vat) / 100;

  const shippingTaxForm = (convertStringToNumber(freightPrice) * values?.shippingTax) / 100;

  const orderTotalMoney = productTotalPrice + convertStringToNumber(freightPrice) + vat + shippingTaxForm;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header]}>
          {/* <Image source="/static/header-quotation2.png" style={{ height: 'auto', marginTop: -20 }} /> */}
          <Image source="/logo/cmd-steel.png" style={{ height: '100px', width: '150px', marginTop: -20 }} />
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 65, left: 27, fontSize: 12, color: '#353538' }}
          >
            Điện thoại: 04.858.92918
          </Text>
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 78, left: 27, fontSize: 12, color: '#353538' }}
          >
            Fax: 0433560129
          </Text>
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 92, left: 27, fontSize: 12, color: '#353538' }}
          >
            Di động: {formatPhoneNumber(userValues?.phoneNumber)}
          </Text>
        </View>

        <View style={[styles.headlineContainer, styles.pt140]}>
          <Text style={[styles.h3]}>BÁO GIÁ KIÊM XÁC NHẬN ĐƠN HÀNG</Text>
        </View>

        <View style={[styles.tableRow, styles.tableRow]}>
          <View style={[styles.headerCell2]}>
            <Text style={[styles.bodyHeader, styles.alignLeft]}>Trân trọng báo cho:</Text>
          </View>
          <View style={[styles.headerCell6]}>
            <Text style={[styles.bodyHeader, styles.alignLeft, styles.ml2]}>MR/MS.{invoice?.customer?.name}</Text>
          </View>
          <View style={[styles.headerCell7]}>
            <Text style={[styles.bodyHeader, styles.alignCenter]}>Điện thoại:</Text>
          </View>
          <View style={[styles.headerCell4]}>
            <Text style={[styles.bodyHeader, styles.alignLeft]}>{invoice?.customer?.phoneNumber}</Text>
          </View>
        </View>
        <View style={[styles.tableRow, styles.tableRow]}>
          <View style={[styles.cell4WithBorder]}>
            <Text style={[styles.bodyHeader, styles.alignCenter]}>Đơn vị:</Text>
          </View>

          <View style={[styles.tableCell]}>
            <Text style={[styles.bodyHeader, styles.alignLeft, styles.ml2]}>
              {invoice?.customer?.company?.companyName}
            </Text>
          </View>
        </View>
        <View style={[styles.tableRow, styles.tableRow]}>
          <View style={[styles.cell4WithBorder]}>
            <Text style={[styles.bodyHeader, styles.alignLeft]}>Địa chỉ:</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Text style={[styles.bodyHeader, styles.alignLeft, styles.ml2]}>
              {values?.deliverAddress ?? invoice?.deliverAddress}
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
            {values?.categories && values?.categories.length > 0
              ? values?.categories?.map((data, index) => (
                  <View key={index}>
                    <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
                      <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                        <Text style={[styles.subtitle2, styles.alignCenter]}>H{index + 1}</Text>
                      </View>

                      <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                        <Text style={[styles.subtitle2, styles.alignCenter]}>{data?.name}</Text>
                      </View>
                      <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]} />
                      <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]} />
                      <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]} />
                      <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]} />
                      <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]} />
                      <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]} />
                      <View
                        style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase, styles.cell9WithBorder]}
                      />
                    </View>

                    {data?.orderDetailList &&
                      data?.orderDetailList.length > 0 &&
                      data?.orderDetailList?.map((product, index) => (
                        <View style={[styles.tableRow, styles.tableBodyRow]} key={index} wrap={false}>
                          <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                            <Text style={[styles.alignCenter]}>{index + 1}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                            <Text style={[styles.alignLeft]}>{product?.product.name}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                            <Text style={[styles.alignCenter]}>{formatUnit(product?.product)}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                            <Text style={[styles.alignCenter]}>{product?.quantity}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                            <Text style={[styles.alignCenter]}>{product?.weightProduct}</Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                            <Text style={[styles.alignCenter]}>
                              {formatNumberWithCommas(product?.weightProduct * product?.quantity)}
                            </Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                            <Text style={[styles.alignRight, { marginRight: 2 }]}>
                              {fVietNamCurrency(convertStringToNumber(product?.priceProduct))}
                            </Text>
                          </View>

                          <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                            <Text style={[styles.alignRight, { marginRight: 2 }]}>
                              {fVietNamCurrency(
                                convertStringToNumber(product?.priceProduct) *
                                  Number(product?.quantity) *
                                  Number(product?.weightProduct)
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
                            <Text style={[styles.alignCenter]}>{product.description}</Text>
                          </View>
                        </View>
                      ))}
                  </View>
                ))
              : values.products &&
                values.products.length > 0 &&
                values.products.map((product, index) => (
                  <View style={[styles.tableRow, styles.tableBodyRow]} key={index}>
                    <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                      <Text style={[styles.alignCenter]}>{index + 1}</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                      <Text style={[styles.alignCenter]}>{product.product.name}</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                      <Text style={[styles.alignCenter]}>{formatUnit(product?.product)}</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                      <Text style={[styles.alignCenter]}>{product.quantity}</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                      <Text style={[styles.alignCenter]}>{product.weightProduct}</Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                      <Text style={[styles.alignCenter]}>
                        {formatNumberWithCommas(product?.weightProduct * product.quantity)}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                      <Text style={[styles.alignRight, { marginRight: 2 }]}>
                        {fVietNamCurrency(convertStringToNumber(product.priceProduct))}
                      </Text>
                    </View>

                    <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                      <Text style={[styles.alignRight, { marginRight: 2 }]}>
                        {fVietNamCurrency(
                          convertStringToNumber(product.priceProduct) *
                            Number(product.quantity) *
                            Number(product?.weightProduct)
                        )}
                      </Text>
                    </View>

                    <View
                      style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase, styles.cell9WithBorder]}
                    >
                      <Text style={[styles.alignCenter]}>{product.description}</Text>
                    </View>
                  </View>
                ))}

            <View wrap={false}>
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
                  <Text style={[styles.alignCenter]}>{Number(totalQuantity)}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                  <Text style={[styles.alignCenter]} />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                  <Text style={[styles.alignCenter]}>{formatNumberWithCommas(totalWeight)}</Text>
                </View>
                <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                  <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                    {fVietNamCurrency(Number(productTotalPrice))}
                  </Text>
                </View>
                <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                  <Text />
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableBodyRow]}>
                <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                  <Text style={[styles.borderBody2, styles.alignCenter]}>II</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                  <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Thuế VAT</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell3WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell4WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell5WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell6WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                  <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                    {fVietNamCurrency(Number(vat))}
                  </Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                  <Text />
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableBodyRow]}>
                <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                  <Text style={[styles.borderBody2, styles.alignCenter]}>III</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                  <Text
                    style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}
                  >{`Tiền vận chuyển (${values?.shippingTax}%)`}</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell3WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell4WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell5WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell6WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                  <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                    {fVietNamCurrency(convertStringToNumber(convertStringToNumber(freightPrice) + shippingTaxForm))}
                  </Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                  <Text />
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableBodyRow, { backgroundColor: '#cbdaf5' }]}>
                <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                  <Text style={[styles.borderBody2, styles.alignCenter]}>IV</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.cell2WithBorder]}>
                  <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Tổng đơn hàng</Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell3WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell4WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell5WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell6WithBorder]}>
                  <Text />
                </View>

                <View style={[styles.tableCellWithBorderBase, styles.cellMerge]}>
                  <Text style={[styles.borderBody2, styles.alignRight, { marginRight: 2 }]}>
                    {fVietNamCurrency(Number(orderTotalMoney))}
                  </Text>
                </View>

                <View style={[styles.tableCellWithBorderBase2, styles.cell9WithBorder]}>
                  <Text />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb8]} wrap={false}>
          <View style={[styles.col60, { paddingTop: 5 }]}>
            <Text style={[styles.overline]}>- Thanh toán bằng chuyển khoản</Text>
            <Text style={[styles.overline]}>{`- Đã bao gồm ${values?.vat ?? 10}% thuế VAT`}</Text>
            <Text style={[styles.overline]}>{`- Báo giá có hiệu lực ${values?.reportingValidity ?? 3} ngày`}</Text>

            <Text style={[styles.overline]}>{`- Thanh toán ${values?.pay ?? 100}% đơn hàng ngay khi đặt hàng`}</Text>

            <Text style={[styles.overline]}>{`- Thời gian thực hiện: ${values.executionTime}`}</Text>

            <Text style={[styles.overline]}>{`- Phương thức giao hàng: ${values.deliveryMethod}`}</Text>
          </View>

          <View style={[styles.col40FlexEnd, { paddingTop: 5 }]}>
            <Text style={[styles.h5, { textAlign: 'center' }]}>{`Hà Nội, ngày ${fDateToDay(
              new Date()
            )} tháng ${fDateToMonth(new Date())} năm ${fDateToYear(new Date())}`}</Text>
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
              {userValues?.displayName} - {userValues?.phoneNumber}
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
