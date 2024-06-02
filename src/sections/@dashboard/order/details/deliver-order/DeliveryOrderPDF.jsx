// noinspection DuplicatedCode,JSValidateTypes

import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styles from './deliveryOrderStyle';
import { fddMMYYYYWithSlash } from '../../../../../utils/formatTime';
import { formatNumberWithCommas, formatPhoneNumber } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

DeliveryOrderPDF.propTypes = {
  formMethod: PropTypes.object.isRequired,
};

export default function DeliveryOrderPDF({ formMethod }) {
  const { watch } = formMethod;
  const values = watch();

  const dOrder = useMemo(
    () => ({
      customer: values?.customer,
      sale: values?.sale,
      itemGroupList: values?.itemGroupList,
      documentNote: values?.documentNote,
      cranesNote: values?.cranesNote,
      receivingNote: values?.receivingNote,
      deliveryPayable: values?.deliveryPayable,
      otherNote: values?.otherNote,
      deliveryDate: values?.deliveryDate,
      deliverAddress: values?.deliverAddress,
      VAT: values?.VAT,
    }),
    [
      values?.deliverAddress,
      values?.cranesNote,
      values?.customer,
      values?.deliveryDate,
      values?.deliveryPayable,
      values?.documentNote,
      values?.itemGroupList,
      values?.otherNote,
      values?.receivingNote,
      values?.sale,
      values?.VAT,
    ]
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header]}>
          {/* <Image source="/static/header-quotation2.png" style={{ height: 'auto', marginTop: -20 }} /> */}
          <Image source="/logo/cmd-steel.png" style={{ height: '100px', width: '150px', marginTop: -20 }} />
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 65, left: 27, fontSize: 11, color: '#353538' }}
          >
            Điện thoại: 04.858.92918
          </Text>
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 78, left: 27, fontSize: 11, color: '#353538' }}
          >
            Fax: 0433560129
          </Text>
          <Text
            style={{ position: 'absolute', fontFamily: 'Tahoma', top: 92, left: 27, fontSize: 11, color: '#353538' }}
          >
            Di động: {formatPhoneNumber(values?.sale?.phoneNumber)}
          </Text>
        </View>

        <View style={[styles.headlineContainer1, styles.redColor, styles.pt160]}>
          <Text style={[styles.h4]}>LỆNH XUẤT HÀNG</Text>
        </View>
        <View style={styles.border} wrap={false}>
          <View style={[styles.headlineContainer, styles.redColor, styles.mt5]}>
            <Text style={[styles.body2]}>Kho vận tải kiểm tra kỹ trước khi thực hiện</Text>
          </View>
          <View style={[styles.tableRow, styles.row]}>
            <View style={[styles.tableCellWithBorderBase, styles.cell1With, styles.cellWithBorderBase]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>Người bán hàng: {dOrder?.sale?.fullName}</Text>
            </View>
            <View style={[styles.tableCellWithBorderBase, styles.tableCell]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>
                Thời gian nhận: {dOrder?.deliveryDate ? fddMMYYYYWithSlash(new Date(dOrder?.deliveryDate)) : ''}
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, styles.row]}>
            <View style={[styles.tableCellWithBorderBase, styles.cell1With, styles.cellWithBorderBase]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>Người nhận hàng: {dOrder?.customer?.name}</Text>
            </View>
            <View style={[styles.tableCellWithBorderBase, styles.tableCell]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>
                Số điện thoại người nhận: {dOrder?.customer?.phoneNumber}
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, styles.row2]}>
            <View style={[styles.tableCellWithBorderBase2, styles.cell4With1]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>Tên Công ty: </Text>
            </View>
            <View style={[styles.tableCellWithBorderBase]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>{dOrder?.customer?.company?.companyName}</Text>
            </View>
          </View>
          <View style={[styles.tableRow, styles.row2]}>
            <View style={[styles.tableCellWithBorderBase, styles.cell5With18]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>Địa chỉ công ty:</Text>
            </View>
            <View style={[styles.tableCellWithBorderBase, styles.tableCell]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>{dOrder?.customer?.company?.address}</Text>
            </View>
          </View>
          <View style={[styles.tableRow, styles.row2]}>
            <View style={[styles.tableCellWithBorderBase, styles.cell5With18]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>Địa chỉ giao hàng:</Text>
            </View>
            <View style={[styles.tableCellWithBorderBase, styles.tableCell]}>
              <Text style={[styles.subtitle, { marginLeft: 2 }]}>{dOrder?.deliverAddress}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tableWithBorder}>
          <View style={styles.tableHeader} fixed>
            <View style={[styles.tableHeaderRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorder, styles.headerCell1WithBorder, styles.cellWithBorderBase]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Stt</Text>
              </View>
              <View style={[styles.tableCellWithBorder, styles.headerCell2WithBorder, styles.cellWithBorderBase]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Thông tin đơn hàng</Text>
              </View>
              <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Phương thức giao nhận</Text>
              </View>
              <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Số lượng</Text>
              </View>
              <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Đơn trọng</Text>
              </View>
              <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Tổng trọng</Text>
              </View>
              <View style={[styles.tableCellWithBorder, styles.headerCell4WithBorder]}>
                <Text style={[styles.subtitle3, styles.redColor, styles.alignCenter]}>Hàng gom</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableBody}>
            <View style={styles.borderBody}>
              {dOrder?.itemGroupList && dOrder?.itemGroupList.length > 1
                ? dOrder?.itemGroupList.map((row, index) => (
                    <div key={index}>
                      <View style={[styles.tableRow, styles.tableBodyRow]} wrap={false}>
                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell1WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle2, styles.alignCenter]}>H{index + 1}</Text>
                        </View>

                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell2WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle2, styles.alignCenter]}>{row?.name}</Text>
                        </View>
                        <View style={[styles.tableCellWithBorderBase, styles.bodyCell3WithBorder]} />
                        <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]} />
                        <View style={[styles.tableCellWithBorderBase, styles.bodyCell5WithBorder]} />
                        <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]} />
                        <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]} />
                        <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]} />
                        <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]} />
                      </View>
                      {row?.orderDetailList?.map((orderDetail, idx) => (
                        <View style={[styles.tableRow, styles.tableBodyRow]} key={idx} wrap={false}>
                          <View
                            style={[
                              styles.tableCellWithBorder,
                              styles.headerCell1WithBorder,
                              styles.cellWithBorderBase,
                            ]}
                          >
                            <Text style={[styles.subtitle, styles.alignCenter]}>{idx + 1}</Text>
                          </View>

                          <View
                            style={[
                              styles.tableCellWithBorder,
                              styles.headerCell2WithBorder,
                              styles.cellWithBorderBase,
                            ]}
                          >
                            <Text style={[styles.subtitle, styles.alignLeft]}>{orderDetail.product?.name}</Text>
                          </View>

                          <View
                            style={[
                              styles.tableCellWithBorder,
                              styles.headerCell3WithBorder,
                              styles.cellWithBorderBase,
                            ]}
                          >
                            <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail?.deliveryMethodNote}</Text>
                          </View>

                          <View
                            style={[
                              styles.tableCellWithBorder,
                              styles.headerCell3WithBorder,
                              styles.cellWithBorderBase,
                            ]}
                          >
                            <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail.quantity}</Text>
                          </View>

                          <View
                            style={[
                              styles.tableCellWithBorder,
                              styles.headerCell3WithBorder,
                              styles.cellWithBorderBase,
                            ]}
                          >
                            <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail?.weightProduct}</Text>
                          </View>

                          <View
                            style={[
                              styles.tableCellWithBorder,
                              styles.headerCell3WithBorder,
                              styles.cellWithBorderBase,
                            ]}
                          >
                            <Text style={[styles.subtitle, styles.alignCenter]}>
                              {formatNumberWithCommas(orderDetail.quantity * orderDetail?.weightProduct)}
                            </Text>
                          </View>

                          <View style={[styles.tableCellWithBorder, styles.headerCell4WithBorder]}>
                            <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail?.otherNote}</Text>
                          </View>
                        </View>
                      ))}
                    </div>
                  ))
                : dOrder?.itemGroupList.map((row, index) =>
                    row?.orderDetailList?.map((orderDetail, idx) => (
                      <View style={[styles.tableRow, styles.tableBodyRow]} key={index.toString() + idx} wrap={false}>
                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell1WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle, styles.alignCenter]}>{idx + 1}</Text>
                        </View>

                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell2WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle, styles.alignLeft]}>{orderDetail.product?.name}</Text>
                        </View>

                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail?.deliveryMethodNote}</Text>
                        </View>

                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail.quantity}</Text>
                        </View>

                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail?.weightProduct}</Text>
                        </View>

                        <View
                          style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}
                        >
                          <Text style={[styles.subtitle, styles.alignCenter]}>
                            {formatNumberWithCommas(orderDetail.quantity * orderDetail?.weightProduct)}
                          </Text>
                        </View>

                        <View style={[styles.tableCellWithBorder, styles.headerCell4WithBorder]}>
                          <Text style={[styles.subtitle, styles.alignCenter]}>{orderDetail?.otherNote}</Text>
                        </View>
                      </View>
                    ))
                  )}
            </View>
            <View style={styles.borderBody} wrap={false}>
              <View style={[styles.tableRow, styles.tableBodyRow]}>
                <View style={[styles.tableCellWithBorder, styles.headerCell1WithBorder, styles.cellWithBorderBase]}>
                  <Text style={[styles.subtitle2, styles.alignCenter]}>II</Text>
                </View>
                <View style={[styles.tableCellWithBorder, styles.headerCell2WithBorder, styles.cellWithBorderBase]}>
                  <Text style={[styles.subtitle3, styles.alignCenter]}>TỔNG</Text>
                </View>
                <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                  <Text style={[styles.subtitle3, styles.alignCenter]} />
                </View>
                <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                  <Text style={[styles.subtitle3, styles.alignCenter]} />
                </View>
                <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                  <Text style={[styles.subtitle3, styles.alignCenter]} />
                </View>
                <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                  <Text style={[styles.subtitle3, styles.alignCenter]}>
                    {formatNumberWithCommas(
                      dOrder?.itemGroupList.reduce(
                        (total, data) =>
                          total +
                          data.orderDetailList.reduce(
                            (total, orderDetail) => total + orderDetail.quantity * orderDetail?.weightProduct,
                            0
                          ),
                        0
                      )
                    )}
                  </Text>
                </View>
                <View style={[styles.tableCellWithBorder, styles.headerCell4WithBorder]}>
                  <Text style={[styles.subtitle3, styles.alignCenter]} />
                </View>
              </View>
            </View>
            <View style={styles.borderBody} wrap={false}>
              <View style={[styles.tableFooterRow]}>
                <View style={[styles.tableCellFooter, styles.headerCell5WithBorder, styles.cellWithBorderBase]}>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignRight]}>Hàng đã giao </Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignRight]}>Cẩu hạ hàng </Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignRight]}>Còn tiền phải thu </Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignRight]}>Cước vận chuyển phải thu </Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignRight]}>Kèm chứng chỉ giấy tờ khách </Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignRight]}>Dặn dò khác </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableCellWithBorder, styles.headerCell6WithBorder, styles.cellWithBorderBase]}>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>{dOrder?.receivingNote}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>{dOrder?.cranesNote}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRowColor, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>Còn tiền</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>{dOrder?.deliveryPayable}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>{dOrder?.documentNote}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>{dOrder?.otherNote}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableCellWithBorder, styles.headerCell3WithBorder, styles.cellWithBorderBase]}>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>Cân/bazem</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>Có/không</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>TM/CK</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>Có/không</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>Có/không</Text>
                    </View>
                  </View>
                  <View style={[styles.tableFooterRow, styles.lastTableBodyRow]}>
                    <View style={[styles.tableCellFooter, styles.cellWidth]}>
                      <Text style={[styles.subtitle, styles.alignCenter]}>Có/không</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.tableCellWithBorderColor,
                    styles.headerCell4WithBorder,
                    styles.lastTableBodyRow,
                    { paddingRight: 2 },
                  ]}
                >
                  <Text style={[styles.subtitle4, styles.alignCenter, styles.redColor]}>CHỈ LƯU HÀNH NỘI BỘ</Text>
                  <Text style={[styles.subtitle4, styles.alignCenter, styles.redColor]}>
                    KHÔNG PHÁT HÀNH RA NGOÀI CÔNG TY
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.footer]}>
          <Image source="/static/footer-quotation.png" />
        </View>
      </Page>
    </Document>
  );
}
