// noinspection JSCheckFunctionSignatures

import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

Font.register({
  family: 'Tahoma',
  fonts: [{ src: '/fonts/Tahoma-Regular-font.ttf' }, { src: '/fonts/tahomabd.ttf' }],
});

Font.register({
  family: 'Avo',
  fonts: [{ src: '/fonts/SVN-Avo bold.ttf' }, { src: '/fonts/SVN-Avo.ttf' }],
});

Font.register({
  family: 'Times-New-Roman',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fonts: [
    { src: '/fonts/Times-New-Roman-Regular.ttf' },
    {
      src: '/fonts/Times-New-Roman-Bold.ttf',
    },
  ],
});
const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '55%' },
  col6FlexEnd: { width: '45%', alignItems: 'flex-end' },
  col60: { width: '60%' },
  col40FlexEnd: { width: '40%', alignItems: 'flex-end' },
  pt125: { paddingTop: 125 },
  pt140: { paddingTop: 140 },
  mb4: { marginBottom: 4 },
  mb2: { marginBottom: 2 },
  mb6: { marginBottom: 6 },
  mb7: { marginBottom: 7 },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  ml2: { marginLeft: 2 },
  header: {
    left: 0,
    right: 0,
    top: 15,
    position: 'absolute',
  },
  overline: {
    fontFamily: 'Times-New-Roman',
    fontSize: 11,
    lineHeight: 1.5,
    fontWeight: 700,
  },
  overline2: {
    fontFamily: 'Roboto',
    fontSize: 11.5,
    fontWeight: 350,
  },
  fontWeight400: {
    fontWeight: 400,
  },
  h2: { fontFamily: 'Roboto', fontSize: 20, fontWeight: 700, textTransform: 'normal' },
  h3: { fontFamily: 'Avo', fontSize: 20, fontWeight: 350, textTransform: 'normal' },
  h4: { fontFamily: 'Roboto', fontSize: 13, fontWeight: 700, textTransform: 'normal' },
  h5: { fontFamily: 'Avo', fontSize: 10, fontWeight: 350, textTransform: 'normal' },
  h7: { fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, textTransform: 'normal' },
  h7Size115: { fontFamily: 'Roboto', fontSize: 11.5, fontWeight: 600, textTransform: 'normal' },
  body1: { fontFamily: 'Roboto', fontSize: 10, textTransform: 'normal' },
  body2: { fontFamily: 'Roboto', fontSize: 11.5, textTransform: 'normal' },
  bodyHeader: { fontFamily: 'Roboto', fontSize: 11.5, textTransform: 'normal' },
  borderBody2: { fontFamily: 'Roboto', fontSize: 10, textTransform: 'normal', fontWeight: 600 },
  borderBody2NoBold: { fontFamily: 'Roboto', fontSize: 10, textTransform: 'normal', fontWeight: 300 },
  subtitle2: { fontFamily: 'Roboto', fontSize: 11.5, fontWeight: 700, textTransform: 'normal' },
  alignCenter: { textAlign: 'center' },
  alignRight: { textAlign: 'right' },
  alignLeft: { textAlign: 'left' },
  marginLeft2px: { marginLeft: '2px' },
  alignItemsLeft: { alignItems: 'left', paddingLeft: 1 },
  page: {
    padding: '40px 25px 0 25px',
    fontSize: 10,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
  },
  footer: {
    left: 0,
    right: 0,
    position: 'absolute',
    bottom: 0,
  },
  gridContainer: { flexDirection: 'row' },
  headlineContainer: { flexDirection: 'row', justifyContent: 'center' },
  table: { display: 'flex', width: 'auto' },
  tableWithBorder: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableHeaderRow: {
    backgroundColor: '#cbdaf5',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#212B36',
    minHeight: 35,
  },
  tableBody: {},
  tableBodyRow: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderColor: '#212B36',
    minHeight: 24,
  },
  borderTopWidth1: {
    borderTopWidth: 1,
  },
  borderTopWidth0: {
    borderTopWidth: 0,
  },
  borderBottomWidth0: {
    borderBottomWidth: 0,
  },
  lastTableBodyRow: {
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
  tableCellWithBorderBase: {
    borderStyle: 'solid',
    borderColor: '#212B36',
    paddingVertical: 0,
    marginVertical: 0,
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  cellWithBorderBase: {
    borderRightWidth: 1,
  },
  lastCellWithBorderBase: {
    borderRightWidth: 0,
  },
  lastCellWithBorderBaseDescription: {
    maxWidth: '5%',
  },
  cell1WithBorder: {
    width: '4%',
  },
  cell1WithBorder3point5: {
    width: '3.5%',
  },
  bodyCell1WithBorder: {
    width: '2.85%',
  },
  cell2WithBorder: {
    width: '25%',
  },
  bodyCell2WithBorder: {
    width: '28.58%',
  },
  cell2WithBorderColSpan2To7: {
    width: '70%',
  },
  cell3WithBorderColSpan3To7: {
    width: '45%',
  },
  cell3WithBorder: {
    width: '6%',
  },
  bodyCell3WithBorder: {
    width: '6%',
  },
  cell4WithBorder: {
    width: '7%',
  },
  bodyCell4WithBorder: {
    width: '7.62%',
  },
  cell5WithBorder: {
    width: '10%',
  },
  bodyCell5WithBorder: {
    width: '10.48%',
  },
  cell6WithBorder: {
    width: '10%',
  },
  bodyCell6WithBorder: {
    width: '9.52%',
  },
  cell7WithBorder: {
    width: '12%',
  },
  bodyCell7WithBorder: {
    width: '13.32%',
  },
  cell8WithBorder: {
    width: '15%',
  },
  bodyCell8WithBorder: {
    width: '14.32%',
  },
  cell9WithBorder: {
    width: '16%',
  },
  bodyCell2FreightPriceWithBorder: {
    width: '52.4%',
  },
  bodyCell2Paid: {
    width: '73.4%',
  },
  headerCell: {
    width: '7%',
  },
  headerCell2: {
    width: '18%',
  },
  headerCell3: {
    width: '15%',
  },
  headerCell4: {
    width: '23%',
  },
  headerCell5: {
    width: '69%',
  },
  headerCell6: {
    width: '48%',
  },
  headerCell7: {
    width: '11%',
  },
  headerCell8: {
    width: '13%',
  },
  cellMerge: {
    width: '27%',
  },
});

export default styles;
