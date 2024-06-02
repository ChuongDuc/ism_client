// noinspection JSValidateTypes,DuplicatedCode

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Button, Card, Container, Divider, Stack, Tab, Table, TableBody, TableContainer, Tabs } from '@mui/material';
import { loader } from 'graphql.macro';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';
import { PATH_DASHBOARD } from '../../routes/paths';
import useTabs from '../../hooks/useTabs';
import useTable from '../../hooks/useTable';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import InvoiceAnalytic from '../../sections/@dashboard/order/InvoiceAnalytic';
import { AllLabel, DefaultMaxHeight, DefaultRowsPerPage, getDateRange, OrderStatus, Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import { reformatStatus } from '../../utils/getOrderFormat';
import Label from '../../components/Label';
import { OrderTableRow, OrderTableToolbar } from '../../sections/@dashboard/order/list';
import TableHeadWithoutCheckBoxCustom from '../../components/table/TableHeadWithoutCheckBoxCustom';
import { TableEmptyRows, TableNoData } from '../../components/table';
import CommonBackdrop from '../../components/CommonBackdrop';

// ----------------------------------------------------------------------

const FILTER_ALL_ORDER = loader('../../graphql/queries/order/filterAllOrder.graphql');
const DELETE_ORDER = loader('../../graphql/mutations/order/deleteOrder.graphql');
const GET_ALL_SALES = loader('../../graphql/queries/user/getAllUsers.graphql');

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left', width: 50 },
  { id: 'customer', label: 'Khách hàng', align: 'left' },
  { id: 'company', label: 'Công ty', align: 'left' },
  { id: 'freightPrice', label: 'Cước vận chuyển', align: 'left', minWidth: 160 },
  { id: 'price', label: 'Tổng đơn', align: 'left', minWidth: 160 },
  { id: 'status', label: 'Trạng thái', align: 'left', minWidth: 180 },
  { id: 'createDate', label: 'Ngày tạo', align: 'left' },
  { id: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function OrderList() {
  const { user } = useAuth();

  const theme = useTheme();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { page, order, orderBy, rowsPerPage, setPage, selected, setSelected, onSelectRow, onSelectAllRows, onSort } =
    useTable({ defaultRowsPerPage: DefaultRowsPerPage });

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const { startDate, endDate } = getDateRange();

  const [filterStartDate, setFilterStartDate] = useState(startDate);

  const [filterEndDate, setFilterEndDate] = useState(endDate);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const [countOrder, setCountOrder] = useState({
    allOrderCounter: 0,
    priceQuotationOrderCounter: 0,
    creatNewOrderCounter: 0,
    createExportOrderCounter: 0,
    deliveryOrderCounter: 0,
    successDeliveryOrderCounter: 0,
    paymentConfirmationOrderCounter: 0,
    paidOrderCounter: 0,
    doneOrderCounter: 0,
  });

  const [totalRevenue, setTotalRevenue] = useState(0);

  const [totalCompleted, setTotalCompleted] = useState(0);

  const [totalPaid, setTotalPaid] = useState(0);

  const [totalDeliver, setTotalDeliver] = useState(0);

  const [listSales, setListSales] = useState([]);

  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const [filterSales, setFilterSales] = useState('Tất cả');

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('Tất cả');

  const { data: getAllSales } = useQuery(GET_ALL_SALES, {
    variables: {
      input: {
        role: Role.sales,
      },
    },
  });

  const {
    data: getOrder,
    fetchMore: fetchMoreOrder,
    loading: loadingOrder,
  } = useQuery(FILTER_ALL_ORDER, {
    variables: {
      input: {
        queryString: filterName,
        saleId: user.role === Role.sales ? Number(user.id) : selectedSaleId,
        status: filterStatus === 'Tất cả' ? null : reformatStatus(filterStatus),
        createAt:
          filterStartDate && filterEndDate
            ? {
                startAt: filterStartDate,
                endAt: filterEndDate,
              }
            : null,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    const updatedEdges = [
      ...previousResult.filterAllOrder.orders.edges,
      ...fetchMoreResult.filterAllOrder.orders.edges,
    ];
    return {
      ...previousResult,
      filterAllOrder: {
        ...previousResult.filterAllOrder,
        orders: {
          ...previousResult.filterAllOrder.orders,
          edges: updatedEdges,
          pageInfo: fetchMoreResult.filterAllOrder.orders.pageInfo,
          totalCount: fetchMoreResult.filterAllOrder.orders.totalCount,
        },
        totalCompleted: fetchMoreResult.filterAllOrder.totalCompleted,
        totalDeliver: fetchMoreResult.filterAllOrder.totalDeliver,
        totalPaid: fetchMoreResult.filterAllOrder.totalPaid,
        totalRevenue: fetchMoreResult.filterAllOrder.totalRevenue,
        allOrderCounter: fetchMoreResult.filterAllOrder.allOrderCounter,
        priceQuotationOrderCounter: fetchMoreResult.filterAllOrder.priceQuotationOrderCounter,
        creatNewOrderCounter: fetchMoreResult.filterAllOrder.creatNewOrderCounter,
        createExportOrderCounter: fetchMoreResult.filterAllOrder.createExportOrderCounter,
        deliveryOrderCounter: fetchMoreResult.filterAllOrder.deliveryOrderCounter,
        successDeliveryOrderCounter: fetchMoreResult.filterAllOrder.successDeliveryOrderCounter,
        paymentConfirmationOrderCounter: fetchMoreResult.filterAllOrder.paymentConfirmationOrderCounter,
        paidOrderCounter: fetchMoreResult.filterAllOrder.paidOrderCounter,
        doneOrderCounter: fetchMoreResult.filterAllOrder.doneOrderCounter,
      },
    };
  };

  useEffect(() => {
    if (getOrder) {
      setTableData(getOrder.filterAllOrder.orders.edges.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: getOrder.filterAllOrder.orders.pageInfo.hasNextPage,
        endCursor: parseInt(getOrder.filterAllOrder.orders.pageInfo.endCursor, 10),
      }));
      setTotalRevenue(getOrder.filterAllOrder.totalRevenue);
      setTotalCompleted(getOrder.filterAllOrder.totalCompleted);
      setTotalPaid(getOrder.filterAllOrder.totalPaid);
      setTotalDeliver(getOrder.filterAllOrder.totalDeliver);
      setCountOrder((prevState) => ({
        ...prevState,
        allOrderCounter: parseInt(getOrder.filterAllOrder.allOrderCounter, 10),
        priceQuotationOrderCounter: parseInt(getOrder.filterAllOrder.priceQuotationOrderCounter, 10),
        creatNewOrderCounter: parseInt(getOrder.filterAllOrder.creatNewOrderCounter, 10),
        createExportOrderCounter: parseInt(getOrder.filterAllOrder.createExportOrderCounter, 10),
        deliveryOrderCounter: parseInt(getOrder.filterAllOrder.deliveryOrderCounter, 10),
        successDeliveryOrderCounter: parseInt(getOrder.filterAllOrder.successDeliveryOrderCounter, 10),
        paymentConfirmationOrderCounter: parseInt(getOrder.filterAllOrder.paymentConfirmationOrderCounter, 10),
        paidOrderCounter: parseInt(getOrder.filterAllOrder.paidOrderCounter, 10),
        doneOrderCounter: parseInt(getOrder.filterAllOrder.doneOrderCounter, 10),
      }));
    }
  }, [getOrder, user]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const [deleteOrder, { loading: loadingDelete }] = useMutation(DELETE_ORDER, {
    onCompleted: () => {
      enqueueSnackbar('Xóa đơn hàng thành công', {
        variant: 'success',
      });
    },
    refetchQueries: () => [
      {
        query: FILTER_ALL_ORDER,
        variables: {
          input: {
            queryString: filterName,
            saleId: user.role === Role.sales ? Number(user.id) : selectedSaleId,
            status: filterStatus === 'Tất cả' ? null : reformatStatus(filterStatus),
            createAt:
              filterStartDate && filterEndDate
                ? {
                    startAt: filterStartDate,
                    endAt: filterEndDate,
                  }
                : null,
            args: {
              first: rowsPerPage,
              after: 0,
            },
          },
        },
      },
    ],
    onError: (error) => {
      enqueueSnackbar(`Xóa đơn hàng không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const handleDeleteRow = async (id) => {
    await deleteOrder({
      variables: {
        input: {
          orderId: Number(id),
        },
      },
    });
    setSelected([]);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const isNotFound =
    (!tableData.length && !!filterName) ||
    (!tableData.length && !!filterStatus) ||
    (!tableData.length && !!filterEndDate) ||
    (!tableData.length && !!filterStartDate);

  const getPercentByStatus = (statusCount) => (statusCount / countOrder.allOrderCounter) * 100;

  const TABS = [
    {
      value: AllLabel,
      label: AllLabel,
      color: 'info',
      count: countOrder.allOrderCounter,
    },
    {
      value: OrderStatus.new,
      label: 'Mới',
      color: 'success',
      count: countOrder.creatNewOrderCounter,
    },
    {
      value: OrderStatus.quotationAndDeal,
      label: 'Đang báo giá',
      color: 'info',
      count: countOrder.priceQuotationOrderCounter,
    },
    {
      value: OrderStatus.newDeliverExport,
      label: 'Đã chốt đơn',
      color: 'success',
      count: countOrder.createExportOrderCounter,
    },
    {
      value: OrderStatus.inProgress,
      label: 'Đang giao hàng',
      color: 'warning',
      count: countOrder.deliveryOrderCounter,
    },
    {
      value: OrderStatus.deliverSuccess,
      label: 'Giao hàng thành công',
      color: 'default',
      count: countOrder.successDeliveryOrderCounter,
    },
    {
      value: OrderStatus.paid,
      label: 'Đang thanh toán',
      color: 'success',
      count: countOrder.paidOrderCounter,
    },
    {
      value: OrderStatus.confirmByAccProcessing,
      label: 'Kế toán đang xác nhận',
      color: 'warning',
      count: countOrder.paymentConfirmationOrderCounter,
    },
    {
      value: OrderStatus.completed,
      label: 'Hoàn thành',
      color: 'success',
      count: countOrder.doneOrderCounter,
    },
  ];

  const tableEl = useRef();
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);

  const scrollListener = useCallback(() => {
    const bottom = tableEl.current?.scrollHeight - tableEl.current?.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }

    if (tableEl.current?.scrollTop > bottom - distanceBottom && pageInfo.hasNextPage && !loading) {
      setLoading(true);
      fetchMoreOrder({
        variables: {
          input: {
            queryString: filterName,
            saleId: user.role === Role.sales ? Number(user.id) : selectedSaleId,
            status: filterStatus === 'Tất cả' ? null : reformatStatus(filterStatus),
            createAt:
              filterStartDate && filterEndDate
                ? {
                    startAt: filterStartDate,
                    endAt: filterEndDate,
                  }
                : null,
            args: {
              first: rowsPerPage,
              after: (page + 1) * rowsPerPage,
            },
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
      }).then(() => {
        setLoading(false);
        setPage(page + 1);
      });
    }
  }, [
    distanceBottom,
    pageInfo.hasNextPage,
    loading,
    fetchMoreOrder,
    filterName,
    user.role,
    user.id,
    selectedSaleId,
    filterStatus,
    filterStartDate,
    filterEndDate,
    rowsPerPage,
    page,
    setPage,
  ]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  useEffect(() => {
    if (getAllSales) {
      setListSales(getAllSales?.users?.edges.map((user) => user.node));
    }
  }, [getAllSales]);

  const handleGetSaleId = (event) => {
    setSelectedSaleId(event);
  };

  const handleFilterSale = (event) => {
    setFilterSales(event.target.value);
  };

  return (
    <Page title="Danh sách đơn hàng">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Danh sách đơn hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Đơn hàng', href: PATH_DASHBOARD.saleAndMarketing.root },
            { name: 'Danh sách' },
          ]}
          action={
            <>
              {user.role === Role.sales && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.saleAndMarketing.new}
                  startIcon={<Iconify icon={'eva:plus-fill'} />}
                >
                  Đơn hàng mới
                </Button>
              )}
            </>
          }
        />

        <Card sx={{ mb: 3 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Tổng"
                total={countOrder.allOrderCounter}
                percent={100}
                price={totalRevenue}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Đã hoàn thành"
                total={countOrder.doneOrderCounter}
                percent={getPercentByStatus(countOrder.doneOrderCounter)}
                price={totalCompleted}
                icon="ion:checkmark-done-circle-sharp"
                color={theme.palette.success.dark}
              />
              <InvoiceAnalytic
                title="Đang thanh toán"
                total={countOrder.paidOrderCounter}
                percent={getPercentByStatus(countOrder.paidOrderCounter)}
                price={totalPaid}
                icon="flat-color-icons:paid"
                color={theme.palette.success.dark}
              />
              <InvoiceAnalytic
                title="Đang giao hàng"
                total={countOrder.deliveryOrderCounter}
                percent={getPercentByStatus(countOrder.deliveryOrderCounter)}
                price={totalDeliver}
                icon="carbon:in-progress-warning"
                color={theme.palette.warning.dark}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 3, bgcolor: 'background.neutral' }}
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
              setPage(0);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
              setPage(0);
            }}
            filterSales={filterSales}
            sales={listSales}
            handleGetSaleId={handleGetSaleId}
            onFilterSales={handleFilterSale}
          />

          <Scrollbar>
            <TableContainer
              sx={{ minWidth: 800, position: 'relative', maxHeight: DefaultMaxHeight, minHeight: DefaultMaxHeight }}
              ref={tableEl}
            >
              <Table size={'small'} stickyHeader>
                <TableHeadWithoutCheckBoxCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.orderId)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row, idx) => (
                    <OrderTableRow
                      key={idx}
                      row={row}
                      idx={idx}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}
                  <TableEmptyRows height={56} emptyRows={tableEmptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <CommonBackdrop loading={loadingOrder || loading || loadingDelete} />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
