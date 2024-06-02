// noinspection JSValidateTypes,DuplicatedCode

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Stack, Tab, Table, TableBody, TableContainer, Tabs } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
import useTabs from '../../hooks/useTabs';
import useTable from '../../hooks/useTable';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableNoData } from '../../components/table';
import { AllLabel, DefaultMaxHeight, DefaultRowsPerPage, OrderStatus, Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import { DeliveryOrderTableRow } from '../../sections/@dashboard/delivery';
import DeliverOrderToolbar from '../../sections/@dashboard/order/delivery-order/DeliverOrderToolbar';
import CommonBackdrop from '../../components/CommonBackdrop';
import EditOrderDialog from '../../sections/@dashboard/order/list/EditOrderDialog';
import TableHeadWithoutCheckBoxCustom from '../../components/table/TableHeadWithoutCheckBoxCustom';

// ----------------------------------------------------------------------

const LIST_ALL_DELIVER_ORDER = loader('../../graphql/queries/deliverOrder/listAllDeliverOrder.graphql');
const DELETE_DELIVER_ORDERS = loader('../../graphql/mutations/deliverOrder/deleteDeliverOrders.graphql');
const GET_ALL_USER = loader('../../graphql/queries/user/getAllUsers.graphql');

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left', width: 50 },
  { id: 'invoiceNumber', label: 'Mã đơn hàng', align: 'left' },
  { id: 'customer', label: 'Khách hàng', align: 'left' },
  { id: 'driver', label: 'Lái xe', align: 'left', minWidth: 80 },
  { id: 'createDate', label: 'Tạo ngày', align: 'left' },
  { id: 'dueDate', label: 'Ngày giao hàng', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left', width: 160 },
  { id: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function DeliveryOrderList() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [countOrder, setCountOrder] = useState({
    allOrderCounter: 0,
    creatNewOrderCounter: 0,
    doneOrderCounter: 0,
    inProcessingCounter: 0,
  });

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    onSort,
  } = useTable({ defaultOrderBy: 'createDate', defaultRowsPerPage: DefaultRowsPerPage });

  const { data: getAllSales } = useQuery(GET_ALL_USER, {
    variables: {
      input: {
        role: Role.sales,
      },
    },
  });

  const { data: getAllDrivers } = useQuery(GET_ALL_USER, {
    variables: {
      input: {
        role: Role.driver,
      },
    },
  });

  const [deliverOrder, setDeliverOrder] = useState([]);
  const [filterUserId, setFilterUserId] = useState(null);

  const [filterName, setFilterName] = useState('');
  const [filterSales, setFilterSales] = useState('Tất cả');
  const [filterDrivers, setFilterDrivers] = useState('Tất cả');

  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const [listSales, setListSales] = useState();
  const [listDrivers, setListDrivers] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
  };

  const handleFilter = (event) => {
    setFilterSales(event.target.value);
  };

  const handleFilterDriver = (event) => {
    setFilterDrivers(event.target.value);
  };

  const handleGetSaleId = (event) => {
    setSelectedSaleId(event);
  };
  const handleGetDriverId = (event) => {
    setSelectedDriverId(event);
  };

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('Tất cả');

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  useEffect(() => {
    if (getAllSales) {
      setListSales(getAllSales?.users?.edges.map((edges) => edges.node));
    }
  }, [getAllSales]);

  useEffect(() => {
    if (getAllDrivers) {
      setListDrivers(getAllDrivers?.users?.edges.map((edges) => edges.node));
    }
  }, [getAllDrivers]);

  useEffect(() => {
    if (user.role === Role.driver) {
      setFilterUserId(Number(user.id));
    } else {
      setFilterUserId(null);
    }
  }, [user]);

  const {
    data: allDeliverOrder,
    fetchMore,
    refetch,
    loading: loadingDeliverOrder,
  } = useQuery(LIST_ALL_DELIVER_ORDER, {
    variables: {
      input: {
        driverId: user.role === Role.driver ? filterUserId : selectedDriverId,
        queryString: filterName,
        saleId: selectedSaleId,
        status: filterStatus === 'Tất cả' ? null : filterStatus,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const [deleteDeliverOrders, { loading: loadingDelete }] = useMutation(DELETE_DELIVER_ORDERS, {
    onCompleted: () => {
      enqueueSnackbar('Xóa lệnh giao hàng thành công', {
        variant: 'success',
      });
    },

    onError: (error) => {
      enqueueSnackbar(`Xóa lệnh giao hàng không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllDeliverOrder: {
        ...previousResult?.listAllDeliverOrder,
        deliverOrder: {
          edges: [
            ...previousResult.listAllDeliverOrder?.deliverOrder?.edges,
            ...fetchMoreResult?.listAllDeliverOrder?.deliverOrder?.edges,
          ],
          pageInfo: fetchMoreResult?.listAllDeliverOrder?.deliverOrder?.pageInfo,
          totalCount: fetchMoreResult?.listAllDeliverOrder?.deliverOrder?.totalCount,
        },
        doneOrderCounter: fetchMoreResult.listAllDeliverOrder.doneOrderCounter,
        allOrderCounter: fetchMoreResult.listAllDeliverOrder.allOrderCounter,
        creatNewOrderCounter: fetchMoreResult.listAllDeliverOrder.creatNewOrderCounter,
        inProcessingCounter: fetchMoreResult.listAllDeliverOrder.inProcessingCounter,
      },
    };
  };
  useEffect(() => {
    if (allDeliverOrder) {
      setDeliverOrder(allDeliverOrder?.listAllDeliverOrder?.deliverOrder?.edges?.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allDeliverOrder?.listAllDeliverOrder?.deliverOrder?.pageInfo.hasNextPage,
        endCursor: parseInt(allDeliverOrder?.listAllDeliverOrder?.deliverOrder?.pageInfo.endCursor, 10),
      }));
      setCountOrder((prevState) => ({
        ...prevState,
        allOrderCounter: parseInt(allDeliverOrder.listAllDeliverOrder.allOrderCounter, 10),
        creatNewOrderCounter: parseInt(allDeliverOrder.listAllDeliverOrder.creatNewOrderCounter, 10),
        doneOrderCounter: parseInt(allDeliverOrder.listAllDeliverOrder.doneOrderCounter, 10),
        inProcessingCounter: parseInt(allDeliverOrder.listAllDeliverOrder.inProcessingCounter, 10),
      }));
    }
  }, [allDeliverOrder]);

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
      fetchMore({
        variables: {
          input: {
            driverId: filterUserId ? Number(filterUserId) : null,
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
  }, [setPage, fetchMore, pageInfo.hasNextPage, rowsPerPage, page, filterUserId, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  const handleDeleteRows = async (id) => {
    await deleteDeliverOrders({
      variables: {
        input: {
          ids: [Number(id)],
          deleteBy: Number(user.id),
        },
      },
    });
    await refetch();
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.saleAndMarketing.view(id));
  };

  const denseHeight = dense ? 56 : 76;

  const isNotFound = !deliverOrder.length;

  const TABS = [
    { value: AllLabel, label: AllLabel, color: 'info', count: countOrder.allOrderCounter },
    {
      value: OrderStatus.new,
      label: 'Mới',
      color: 'info',
      count: countOrder.creatNewOrderCounter,
    },
    {
      value: OrderStatus.inProgress,
      label: 'Đang thực hiện',
      color: 'warning',
      count: countOrder.inProcessingCounter,
    },
    {
      value: OrderStatus.completed,
      label: 'Hoàn thành',
      color: 'success',
      count: countOrder.doneOrderCounter,
    },
  ];

  const handleOpenEditDialog = (row) => {
    setIsOpen(true);
    setSelectedOrder(row);
  };

  const handleCloseEditDialog = () => {
    setIsOpen(false);
    setIsOpenView(false);
  };

  const handleOpenViewDialog = (row) => {
    setIsOpen(true);
    setIsOpenView(true);
    setSelectedOrder(row);
  };

  return (
    <Page title="Danh sách lệnh xuất hàng">
      <Container maxWidth={false}>
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

          <DeliverOrderToolbar
            handleGetDriverId={handleGetDriverId}
            filterDrivers={filterDrivers}
            drivers={listDrivers}
            onFilterDrivers={handleFilterDriver}
            handleGetSaleId={handleGetSaleId}
            onFilterName={handleFilterName}
            onFilterSales={handleFilter}
            filterName={filterName}
            filterSales={filterSales}
            sales={listSales}
          />

          <Scrollbar>
            <TableContainer
              sx={{ minWidth: 800, position: 'relative', minHeight: DefaultMaxHeight, maxHeight: DefaultMaxHeight }}
              ref={tableEl}
            >
              <Table size={'small'}>
                <TableHeadWithoutCheckBoxCustom
                  onSort={onSort}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  order={order}
                />

                <TableBody>
                  {deliverOrder.map((row, idx) => (
                    <DeliveryOrderTableRow
                      key={idx}
                      row={row}
                      idx={idx}
                      onViewRow={() => handleViewRow(row?.order?.id)}
                      onEditRow={handleOpenEditDialog}
                      driverViewRow={handleOpenViewDialog}
                      onDeleteRow={() => handleDeleteRows(row?.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={tableEmptyRows(page, rowsPerPage, deliverOrder.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
        <CommonBackdrop loading={loadingDeliverOrder || loading || loadingDelete} />

        {selectedOrder !== undefined && (
          <EditOrderDialog
            onClose={handleCloseEditDialog}
            isOpen={isOpen}
            row={selectedOrder}
            refetchData={refetch}
            isOpenView={isOpenView}
          />
        )}
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
