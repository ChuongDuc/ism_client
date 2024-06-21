import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
} from '@mui/material';
// routes
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
// _mock_
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import TransportationTableRow from '../../sections/@dashboard/transportation/list/TransportationTableRow';
import { DefaultMaxHeight, DefaultRowsPerPage, Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import { formatVehicles } from '../../utils/formatVehicles';
import CommonBackdrop from '../../components/CommonBackdrop';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections

// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['Tất cả', 'Xe Container', 'Xe Tải'];

const TABLE_HEAD_ADMIN = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên người lái', align: 'left' },
  { id: 'type', label: 'Loại xe', align: 'left' },
  { id: 'weight', label: 'Tải trọng', align: 'left' },
  { id: 'licensePlates', label: 'Biển số xe', align: 'left' },
  { id: '', width: 80 },
];
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên người lái', align: 'left' },
  { id: 'type', label: 'Loại xe', align: 'left' },
  { id: 'weight', label: 'Tải trọng', align: 'left' },
  { id: 'licensePlates', label: 'Biển số xe', align: 'left' },
];
// ----------------------------------------------------------------------
const GET_LIST_VEHICLES = loader('../../graphql/queries/vehicle/listAllVehicle.graphql');
const DELETE_VEHICLES = loader('../../graphql/mutations/vehicle/deleteVehicle.graphql');

// ----------------------------------------------------------------------
export default function TransportationList() {
  const {
    dense,
    page,
    order,
    orderBy,
    setPage,
    rowsPerPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = useTable({ defaultRowsPerPage: DefaultRowsPerPage });

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const { currentTab: filterType, onChangeTab: onChangeFilterType } = useTabs('Tất cả');
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const {
    data: getVehicles,
    refetch,
    fetchMore,
    loading: loadingVehicle,
  } = useQuery(GET_LIST_VEHICLES, {
    variables: {
      input: {
        typeVehicle: filterType !== 'Tất cả' ? formatVehicles(filterType) : null,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllVehicle: {
        ...previousResult.listAllVehicle,
        edges: [...previousResult.listAllVehicle.edges, ...fetchMoreResult.listAllVehicle.edges],
        pageInfo: fetchMoreResult.listAllVehicle.pageInfo,
        totalCount: fetchMoreResult.listAllVehicle.totalCount,
      },
    };
  };
  const [deleteVehicles, { loading: loadingDelete }] = useMutation(DELETE_VEHICLES, {});
  useEffect(() => {
    if (getVehicles) {
      setTableData(getVehicles?.listAllVehicle?.edges.map((edges) => edges.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: getVehicles.listAllVehicle.pageInfo.hasNextPage,
        endCursor: parseInt(getVehicles.listAllVehicle.pageInfo.endCursor, 10),
      }));
    }
  }, [getVehicles]);

  const handleDeleteRow = async (id) => {
    try {
      await deleteVehicles({
        variables: {
          input: {
            ids: Number(id),
            deletedBy: Number(user.id),
          },
        },
      });
      setSelected([]);
      enqueueSnackbar('Xóa thành công!', {
        variant: 'success',
      });
      await refetch();
    } catch (error) {
      enqueueSnackbar(`Xóa không thành công!`, error, {
        variant: 'error',
      });
    }
  };

  const handleDeleteRows = async (selected) => {
    try {
      await deleteVehicles({
        variables: {
          input: {
            ids: selected,
            deletedBy: Number(user.id),
          },
        },
      });
      setSelected([]);
      enqueueSnackbar('Xóa thành công!', {
        variant: 'success',
      });
      await refetch();
    } catch (error) {
      enqueueSnackbar(`Xóa không thành công!`, error, {
        variant: 'error',
      });
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.transportation.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length || (!dataFiltered.length && !!filterType);
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
          inputVehicles: {
            typeVehicle: filterType !== 'Tất cả' ? formatVehicles(filterType) : null,
            args: {
              first: rowsPerPage,
              after: 0,
            },
          },
          inputDate: {},
        },
        updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
      }).then(() => {
        setLoading(false);
        setPage(page + 1);
      });
    }
  }, [setPage, fetchMore, pageInfo.hasNextPage, rowsPerPage, page, loading, distanceBottom, filterType]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);
  return (
    <>
      <Page title="Danh sách Xe-phương tiện">
        <Container maxWidth={false}>
          <HeaderBreadcrumbs
            heading="Danh sách Xe-phương tiện"
            links={[
              { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
              { name: 'Xe-phương tiện', href: PATH_DASHBOARD.transportation.root },
              { name: 'Danh sách' },
            ]}
          />

          {(user.role === Role.admin || user.role === Role.director || user.role === Role.transporterManager) && (
            <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.transportation.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm Xe-phương tiện
              </Button>
            </Box>
          )}

          <Card>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterType}
              onChange={onChangeFilterType}
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Scrollbar>
              <TableContainer
                sx={{ minWidth: 800, position: 'relative', maxHeight: 800, minHeight: DefaultMaxHeight }}
                ref={tableEl}
              >
                {selected.length > 0 &&
                  (user.role === Role.admin ||
                    user.role === Role.director ||
                    user.role === Role.transporterManager) && (
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
                        <Tooltip title="Delete">
                          <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                            <Iconify icon={'eva:trash-2-outline'} />
                          </IconButton>
                        </Tooltip>
                      }
                    />
                  )}

                <Table size="small">
                  {user.role === Role.admin || user.role === Role.director || user.role === Role.transporterManager ? (
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD_ADMIN}
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
                  ) : (
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      numSelected={selected.length}
                      onSort={onSort}
                      onSelectAllRows={null}
                    />
                  )}
                  <TableBody>
                    {dataFiltered.map((row, idx) => (
                      <TransportationTableRow
                        key={idx}
                        row={row}
                        idx={idx}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(tableData.length)} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
          <CommonBackdrop loading={loadingDelete || loading || loadingVehicle} />
        </Container>
      </Page>
    </>
  );
}
// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  tableData = stabilizedThis.map((el) => el[0]);
  return tableData;
}
