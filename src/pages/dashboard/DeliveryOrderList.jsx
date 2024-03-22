// noinspection JSValidateTypes,DuplicatedCode

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
import { _orders } from '../../_mock';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import { OrderTableToolbar } from '../../sections/@dashboard/order/list';
import { AllLabel, OrderStatus, Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import { DeliveryOrderTableRow } from '../../sections/@dashboard/delivery';

// ----------------------------------------------------------------------
const filterDeliveryOrderFromOrder = (user, orders) => {
  if (
    user.role === Role.admin ||
    user.role === Role.manager ||
    user.role === Role.director ||
    user.role === Role.transporterManager ||
    user.role === Role.accountant
  ) {
    return orders.filter((ord) => ord.deliverOrder?.id);
  }
  if (user.role === Role.sales) {
    return orders.filter((ord) => ord.deliverOrder?.id).filter((x) => x.sale.id === user.id);
  }
  if (user.role === Role.driver) {
    return orders.filter((ord) => ord.driver && ord.driver?.id === user.id);
  }
  return [];
};
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Mã đơn hàng', align: 'left' },
  { id: 'customer', label: 'Khách hàng', align: 'left' },
  { id: 'driver', label: 'Lái xe', align: 'left' },
  { id: 'createDate', label: 'Tạo ngày', align: 'left' },
  { id: 'dueDate', label: 'Ngày giao hàng', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left', width: 160 },
  { id: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function DeliveryOrderList() {
  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate', defaultRowsPerPage: 10 });

  const [tableData, setTableData] = useState(filterDeliveryOrderFromOrder(user, _orders));

  const [filterName, setFilterName] = useState('');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('Tất cả');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const TABS = [
    { value: AllLabel, label: AllLabel, color: 'info', count: tableData.length },
    {
      value: OrderStatus.newDeliverExport,
      label: 'Mới',
      color: 'info',
      count: getLengthByStatus(OrderStatus.newDeliverExport),
    },
    {
      value: OrderStatus.inProgress,
      label: 'Đang thực hiện',
      color: 'warning',
      count:
        getLengthByStatus(OrderStatus.inProgress) +
        getLengthByStatus(OrderStatus.deliverSuccess) +
        getLengthByStatus(OrderStatus.paid) +
        getLengthByStatus(OrderStatus.confirmByAccProcessing),
    },
    {
      value: OrderStatus.completed,
      label: 'Hoàn thành',
      color: 'success',
      count: getLengthByStatus(OrderStatus.completed),
    },
  ];

  return (
    <Page title="Danh sách lệnh xuất hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lệnh xuất hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Lệnh xuất hàng', href: PATH_DASHBOARD.saleAndMarketing.root },
            { name: 'Danh sách' },
          ]}
        />
        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab, idx) => (
              <Tab
                disableRipple
                key={idx + 1}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <OrderTableToolbar
            filterName={filterName}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            customSearchStr="Tìm theo mã đơn hàng, khách hàng, số điện thoại..."
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Tải về máy">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="In">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <DeliveryOrderTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              labelRowsPerPage="Số lượng trên trang"
              labelDisplayedRows={(from = page) =>
                `${from.from}-${from.to === -1 ? from.count : from.to}/${from.count}`
              }
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Thu gọn bảng"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterStartDate, filterEndDate }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.invoiceNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.customer.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== AllLabel) {
    if (filterStatus === OrderStatus.inProgress) {
      tableData = tableData.filter(
        (item) =>
          item.status === OrderStatus.inProgress ||
          item.status === OrderStatus.paid ||
          item.status === OrderStatus.confirmByAccProcessing ||
          item.status === OrderStatus.deliverSuccess
      );
    } else {
      tableData = tableData.filter((item) => item.status === filterStatus);
    }
  }

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        item.createDate.getTime() >= filterStartDate.getTime() && item.createDate.getTime() <= filterEndDate.getTime()
    );
  }

  return tableData;
}
