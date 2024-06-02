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

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  col6FlexEnd: { width: '50%', alignItems: 'flex-end' },
  col65: { width: '65%' },
  col35FlexEnd: { width: '35%', alignItems: 'flex-end' },
  pt140: { paddingTop: 140 },
  pt160: { paddingTop: 160 },
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  mt5: { marginTop: 5 },
  header: {
    left: 0,
    right: 0,
    top: 15,
    position: 'absolute',
  },
  fontWeight400: {
    fontWeight: 400,
  },
  h2: { fontFamily: 'Roboto', fontSize: 20, fontWeight: 700, textTransform: 'normal' },
  h3: { fontFamily: 'Roboto', fontSize: 16, fontWeight: 700, textTransform: 'normal' },
  h4: { fontFamily: 'Roboto', fontSize: 15.5, fontWeight: 700, textTransform: 'normal' },
  body1: { fontFamily: 'Roboto', fontSize: 10, textTransform: 'normal' },
  body2: { fontFamily: 'Roboto', fontSize: 11.5, textTransform: 'normal' },
  borderBody2: { fontFamily: 'Roboto', fontSize: 11.5, textTransform: 'normal', fontWeight: 700 },
  subtitle: { fontFamily: 'Roboto', fontSize: 11.5, fontWeight: 350, textTransform: 'normal' },
  subtitle2: { fontFamily: 'Roboto', fontSize: 11.5, fontWeight: 700, textTransform: 'normal' },
  subtitle3: { fontFamily: 'Roboto', fontSize: 11.5, fontWeight: 550, textTransform: 'normal' },
  subtitle4: { fontFamily: 'Roboto', fontSize: 11, fontWeight: 500, textTransform: 'normal' },
  alignRight: { textAlign: 'right' },
  alignLeft: { textAlign: 'left' },
  alignCenter: { textAlign: 'center' },
  alignItemsLeft: { alignItems: 'left', paddingLeft: 1 },
  page: {
    padding: '20px 25px 10px 25px',
    fontSize: 11.5,
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
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  headlineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#aebbcb',
  },
  headlineContainer1: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  redColor: { color: '#FF0000' },
  table: { display: 'flex', width: 'auto' },
  tableWithBorder: { display: 'flex', width: 'auto' },
  border: { borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1 },
  borderBody: { borderRightWidth: 1, borderLeftWidth: 1 },
  // borderBody2: { borderRightWidth: 1, borderLeftWidth: 1 },
  borderTop: { borderTopWidth: 1 },
  tableHeader: { borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1 },
  row: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#aebbcb',
    minHeight: 25,
  },
  row2: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#aebbcb',
    minHeight: 25,
  },
  tableBody: {},
  tableBodyRow: {
    borderBottomWidth: 1,
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
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#fcfc2b',
  },
  tableFooterRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderColor: '#212B36',
  },
  tableFooterRowColor: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderColor: '#212B36',
    backgroundColor: '#fcfc2b',
  },
  tableFooterRow1: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderColor: '#aebbcb',
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
  tableCellWithBorderBase: {
    borderStyle: 'solid',
    borderColor: '#aebbcb',
    alignItems: 'left',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  tableCellWithBorderBase2: {
    borderStyle: 'solid',
    borderColor: '#aebbcb',
    alignItems: 'left',
    justifyContent: 'center',
  },
  tableCellWithBorder: {
    borderStyle: 'solid',
    borderColor: '#212B36',
    justifyContent: 'center',
    minHeight: 35,
  },
  tableCellWithBorderColor: {
    borderStyle: 'solid',
    borderColor: '#212B36',
    justifyContent: 'center',
    minHeight: 35,
    backgroundColor: '#fcfc2b',
  },
  tableCellFooter: {
    borderStyle: 'solid',
    borderColor: '#212B36',
    justifyContent: 'center',
    minHeight: 20,
  },
  cellWithBorderBase: {
    borderRightWidth: 1,
  },
  cellWithBorderBaseLeft: {
    borderLeftWidth: 1,
  },
  lastCellWithBorderBase: {
    borderRightWidth: 0,
  },
  cell1With: {
    width: '55%',
  },
  cell2With: {
    width: '10%',
  },
  cell2With1: {
    width: '13%',
  },
  cell3With: {
    width: '45%',
  },
  cell4With: {
    width: '12%',
  },
  cell4With1: {
    width: '13%',
  },
  cell5With: {
    width: '13%',
  },
  cell5With1: {
    width: '15%',
  },
  cell5With18: {
    width: '18%',
  },
  cellWidth: {
    width: '100%',
  },
  headerCell1WithBorder: {
    width: '3%',
  },
  headerCell2WithBorder: {
    width: '28%',
  },
  headerCell3WithBorder: {
    width: '12%',
  },
  headerCell4WithBorder: {
    width: '21%',
  },
  headerCell5WithBorder: {
    width: '31%',
  },
  headerCell6WithBorder: {
    width: '36%',
  },
});

export default styles;
