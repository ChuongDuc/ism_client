// noinspection JSCheckFunctionSignatures

import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  col6FlexEnd: { width: '50%', alignItems: 'flex-end' },
  col65: { width: '65%' },
  col35FlexEnd: { width: '35%', alignItems: 'flex-end' },
  pt140: { paddingTop: 140 },
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  header: {
    left: 0,
    right: 0,
    top: 15,
    position: 'absolute',
  },
  overline: {
    fontFamily: 'Roboto',
    fontSize: 10,
    // marginBottom: 6,
    fontWeight: 700,
    // textTransform: 'normal',
  },
  fontWeight400: {
    fontWeight: 400,
  },
  h2: { fontFamily: 'Roboto', fontSize: 20, fontWeight: 700, textTransform: 'normal' },
  h3: { fontFamily: 'Roboto', fontSize: 16, fontWeight: 700, textTransform: 'normal' },
  h4: { fontFamily: 'Roboto', fontSize: 13, fontWeight: 700, textTransform: 'normal' },
  body1: { fontFamily: 'Roboto', fontSize: 10, textTransform: 'normal' },
  body2: { fontFamily: 'Roboto', fontSize: 9, textTransform: 'normal' },
  borderBody2: { fontFamily: 'Roboto', fontSize: 9, textTransform: 'normal', fontWeight: 700 },
  subtitle2: { fontFamily: 'Roboto', fontSize: 9, fontWeight: 700, textTransform: 'normal' },
  alignRight: { textAlign: 'right' },
  alignLeft: { textAlign: 'left' },
  alignItemsLeft: { alignItems: 'left', paddingLeft: 1 },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
  },
  footer: {
    left: 0,
    right: 0,
    position: 'absolute',
    bottom: 15,
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  headlineContainer: { flexDirection: 'row', justifyContent: 'center' },
  table: { display: 'flex', width: 'auto' },
  tableWithBorder: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableHeaderRow: {
    backgroundColor: '#AAF27F',
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
    minHeight: 35,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  cellWithBorderBase: {
    borderRightWidth: 1,
  },
  lastCellWithBorderBase: {
    borderRightWidth: 0,
  },
  cell1WithBorder: {
    width: '3%',
  },
  bodyCell1WithBorder: {
    width: '2.85%',
  },
  cell2WithBorder: {
    width: '30%',
  },
  bodyCell2WithBorder: {
    width: '28.58%',
  },
  cell3WithBorder: {
    width: '6%',
  },
  bodyCell3WithBorder: {
    width: '5.72%',
  },
  cell4WithBorder: {
    width: '8%',
  },
  bodyCell4WithBorder: {
    width: '7.62%',
  },
  cell5WithBorder: {
    width: '11%',
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
    width: '14%',
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
    width: '8%',
  },
  bodyCell2FreightPriceWithBorder: {
    width: '52.4%',
  },
});

export default styles;
