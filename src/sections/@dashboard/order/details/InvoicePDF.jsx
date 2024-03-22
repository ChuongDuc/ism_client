// noinspection JSValidateTypes,DuplicatedCode

import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import { fVietNamCurrency } from '../../../../utils/formatNumber';
import styles from './InvoiceStyle';
import { orderPropTypes } from '../../../../constant';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: orderPropTypes().isRequired,
};

export default function InvoicePDF({ invoice }) {
  const { products, customer, freightPrice, sale } = invoice;
  let totalPrice = products
    ? products.reduce(
        (total, data) =>
          data?.price && data?.weight && Number(data?.price) > 0 && Number(data?.weight) > 0
            ? total + Number(data?.price) * Number(data?.weight) * Number(data?.quantity)
            : total + 0,
        0
      )
    : 0;
  totalPrice = freightPrice ? totalPrice + freightPrice : totalPrice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header]}>
          <Image source="/static/header-quotation.png" style={{ height: 'auto', marginTop: -20 }} />
        </View>

        <View style={[styles.headlineContainer, styles.pt140]}>
          <Text style={[styles.h2]}>BÁO GIÁ</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb6]}>Trân trọng báo cho: Mr/Ms.{customer.name}</Text>
            <Text style={[styles.overline, styles.mb6]}>Đơn vị: {customer.company.companyName}</Text>
            <Text style={[styles.overline, styles.mb6]}>Địa chỉ: {customer.company.address}</Text>
          </View>

          <View style={styles.col6FlexEnd}>
            <Text style={[styles.overline, styles.mb6]}>Email: {customer.email}</Text>
            <Text style={[styles.overline, styles.mb6]}>Điện thoại: {customer.phoneNumber}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <Text style={styles.body2}>
            Công ty chúng tôi trân trọng gửi tới Quý Công Ty báo giá các sản phẩm thép hình U, I, V, H, thép tấm, thép
            nhám, ống hợp đen, ống hộp mạ kẽm, thép mạ kẽm nóng và các sản phẩm phụ kiện ngành thép như sau
          </Text>
        </View>

        <View style={styles.tableWithBorder}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.cell1WithBorder]}>
                <Text style={styles.subtitle2}>Stt</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell2WithBorder]}>
                <Text style={styles.subtitle2}>Sản phẩm</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell3WithBorder]}>
                <Text style={styles.subtitle2}>Đvt</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell4WithBorder]}>
                <Text style={styles.subtitle2}>Số lượng</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell5WithBorder]}>
                <Text style={styles.subtitle2}>Đơn trọng (Kg/Đvt)</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell6WithBorder]}>
                <Text style={styles.subtitle2}>Tổng trọng (Kg)</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell7WithBorder]}>
                <Text style={styles.subtitle2}>Đơn giá</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell8WithBorder]}>
                <Text style={styles.subtitle2}>Thành tiền</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.cell9WithBorder, styles.lastCellWithBorderBase]}>
                <Text style={styles.subtitle2}>Ghi chú</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {products &&
              products.length > 0 &&
              products.map((product, index) => (
                <View style={[styles.tableRow, styles.tableBodyRow]} key={product.id}>
                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                    <Text>{index + 1}</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                    <Text>{product.name}</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell3WithBorder]}>
                    <Text>Cây</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                    <Text>{product.quantity}</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell5WithBorder]}>
                    <Text>12.83</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                    <Text>1,283</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                    <Text>{fVietNamCurrency(Number(product.price) * Number(product.weight))}</Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                    <Text>
                      {fVietNamCurrency(Number(product.price) * Number(product.weight) * Number(product.quantity))}
                    </Text>
                  </View>

                  <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                    <Text />
                  </View>
                </View>
              ))}

            <View style={[styles.tableRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                <Text>{products.length + 1}</Text>
              </View>

              <View
                style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2FreightPriceWithBorder]}
              >
                <Text>Cước vận chuyển</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]} />

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                <Text>{fVietNamCurrency(Number(freightPrice))}</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                <Text />
              </View>
            </View>

            <View style={[styles.tableRow, styles.tableBodyRow]}>
              <View style={[styles.tableCellWithBorderBase, styles.bodyCell1WithBorder]}>
                <Text style={styles.borderBody2}>I</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.alignItemsLeft, styles.bodyCell2WithBorder]}>
                <Text style={[styles.borderBody2, { alignItems: 'center', alignSelf: 'center' }]}>Tổng đơn hàng</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell3WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell4WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell5WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell6WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell7WithBorder]}>
                <Text />
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.bodyCell8WithBorder]}>
                <Text style={styles.borderBody2}>{fVietNamCurrency(Number(totalPrice))}</Text>
              </View>

              <View style={[styles.tableCellWithBorderBase, styles.lastCellWithBorderBase]}>
                <Text />
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <View style={[styles.col65, { paddingTop: 5 }]}>
            <Text style={[styles.h3, styles.mb6]}>Báo giá trên:</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Đã bao gồm 10% thuế VAT</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Giao theo bazem nhà máy</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Báo giá có hiệu lực 3 ngày</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>- Thời gian thực hiện: 1-2 ngày</Text>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>
              - Thanh toán 100% đơn hàng ngay khi đặt hàng
            </Text>
          </View>

          <View style={[styles.col35FlexEnd, { paddingTop: 10 }]}>
            <Text style={[styles.overline, styles.fontWeight400, styles.mb4]}>Hà Nội, ngày 30 tháng 11 năm 2022</Text>
            <Text
              style={[
                styles.overline,
                styles.mb4,
                { textAlign: 'center', alignSelf: 'center', alignItems: 'center', paddingTop: 10 },
              ]}
            >
              NGƯỜI BÁO GIÁ
            </Text>
            <Text
              style={[
                styles.overline,
                styles.mb4,
                styles.fontWeight400,
                { textAlign: 'center', alignSelf: 'center', alignItems: 'center', paddingTop: 10 },
              ]}
            >
              {sale.displayName} - {sale.phone}
            </Text>
          </View>
        </View>

        <View style={[styles.footer]}>
          <Image source="/static/footer-quotation.png" style={{ zIndex: 8989 }} />
        </View>
      </Page>
    </Document>
  );
}
