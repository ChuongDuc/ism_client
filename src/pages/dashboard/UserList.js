import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Container,
  Divider,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
} from '@mui/material';
// routes
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTable, { getComparator } from '../../hooks/useTable';
// _mock_
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { UserTableRow, UserTableToolbar } from '../../sections/@dashboard/user/list';
// constant
import { DefaultMaxHeight, DefaultRowsPerPage, Role, RoleArr } from '../../constant';
import { formatRoleInput } from '../../utils/formatRole';
import useAuth from '../../hooks/useAuth';
import CommonBackdrop from '../../components/CommonBackdrop';

// ----------------------------------------------------------------------
const GET_ALL_USER = loader('../../graphql/queries/user/getAllUsers.graphql');
const DELETE_USER = loader('../../graphql/mutations/user/deleteUser.graphql');
const RESET_PASSWORD = loader('../../graphql/mutations/user/resetPassword.graphql');
const UPDATE_USER = loader('../../graphql/mutations/user/updateUser.graphql');
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tất cả', 'Đang hoạt động', 'Ngừng hoạt động'];

const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left', width: 50 },
  { id: 'name', label: 'Tên người dùng', align: 'left' },
  { id: 'account', label: 'Tên tài khoản', align: 'left' },
  { id: 'phoneNumber', label: 'SĐT', align: 'left' },
  { id: 'role', label: 'Chức vụ', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const {
    page,
    dense,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = useTable({
    defaultRowsPerPage: DefaultRowsPerPage,
  });

  const { user } = useAuth();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  const [filterStatus, setCurrentTab] = useState('Tất cả');

  const [users, setUsers] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    data: allUsers,
    fetchMore,
    refetch,
    loading: loadingUser,
  } = useQuery(GET_ALL_USER, {
    variables: {
      input: {
        role: filterRole !== 'Tất cả' ? formatRoleInput(filterRole) : null,
        isActive: filterStatus === 'Tất cả' ? null : Boolean(filterStatus === 'Đang hoạt động'),
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
      users: {
        ...previousResult.users,
        edges: [...previousResult.users.edges, ...fetchMoreResult.users.edges],
        pageInfo: fetchMoreResult.users.pageInfo,
        totalCount: fetchMoreResult.users.totalCount,
      },
    };
  };

  const [deleteUser, { loading: loadingDeleteUser }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      enqueueSnackbar('Xóa người dùng thành công', {
        variant: 'success',
      });
    },

    onError: (error) => {
      enqueueSnackbar(`Xóa người dùng không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const [updateUserStatus, { loading: loadingUpdateUserStatus }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      enqueueSnackbar('Khôi phục tài khoản thành công!', {
        variant: 'success',
      });
    },
    refetchQueries: () => [
      {
        query: GET_ALL_USER,
      },
    ],
    onError: (error) => {
      enqueueSnackbar(`Khôi phục tài khoản không thành công!. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const [resetPassword, { loading: loadingResetPassword }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      enqueueSnackbar('Mật khẩu đã được cài lại. Mật khẩu mới là: demo1234', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(`Cài lại mật khẩu không thành công. Nguyên nhân: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers.users?.edges.map((user) => user.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allUsers.users?.pageInfo.hasNextPage,
        endCursor: parseInt(allUsers.users?.pageInfo.endCursor, 10),
      }));
    }
  }, [allUsers]);

  useEffect(() => {
    let filteredData = users;
    if (filterStatus !== 'Tất cả') {
      if (filterStatus === 'Đang hoạt động') {
        filteredData = users.filter((user) => user.isActive === true);
      } else {
        filteredData = users.filter((user) => user.isActive === false);
      }
    }

    setTableData(filteredData);
  }, [filterStatus, users]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(1);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
    setPage(1);
  };

  const handleFilterStatus = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(1);
  };

  const handleDeleteRow = async (id) => {
    await deleteUser({
      variables: {
        input: {
          ids: id,
        },
      },
    });
    setSelected([]);
    await refetch();
  };

  const handleDeleteRows = async (selected) => {
    await deleteUser({
      variables: {
        input: {
          ids: selected,
        },
      },
    });

    setSelected([]);
    await refetch();
  };

  const handleUpdateStatusUser = async (id) => {
    await updateUserStatus({
      variables: {
        input: {
          id,
          isActive: true,
        },
      },
    });

    await refetch();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(id));
  };

  const handleResetPassword = async (id) => {
    await resetPassword({
      variables: {
        input: {
          userId: id,
        },
      },
    });
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

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
  }, [setPage, fetchMore, pageInfo.hasNextPage, rowsPerPage, page, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const denseHeight = dense ? 60 : 80;

  return (
    <Page title="Người dùng: Danh sách người dùng">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading="Danh sách người dùng"
          links={[
            { name: 'Thông tin tổng hợp', href: PATH_DASHBOARD.root },
            { name: 'Người dùng', href: PATH_DASHBOARD.user.root },
            { name: 'Danh sách' },
          ]}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event, newValue) => handleFilterStatus(event, newValue)}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={RoleArr}
          />

          <TableContainer
            sx={{ minWidth: 800, position: 'relative', maxHeight: DefaultMaxHeight, minHeight: DefaultMaxHeight }}
            ref={tableEl}
          >
            {selected.length > 0 && filterStatus !== 'Ngừng hoạt động' && (
              <TableSelectedActions
                size={'small'}
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.filter((data) => data.isActive === true).length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.filter((data) => data.isActive === true).map((row) => row.id)
                  )
                }
                actions={
                  <Tooltip title="Khóa tài khoản">
                    <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                      <Iconify icon={'mingcute:user-lock-line'} />
                    </IconButton>
                  </Tooltip>
                }
              />
            )}

            <Table size={'small'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.filter((data) => data.isActive === true).length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={
                  filterStatus !== 'Ngừng hoạt động' && (user?.role === Role.admin || user?.role === Role.director)
                    ? (checked) =>
                        onSelectAllRows(
                          checked,
                          tableData.filter((data) => data.isActive === true).map((row) => row.id)
                        )
                    : null
                }
              />

              <TableBody>
                {dataFiltered.map((row, idx) => (
                  <UserTableRow
                    key={idx}
                    status={filterStatus}
                    row={row}
                    idx={idx}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                    onResetPassword={() => handleResetPassword(row.id)}
                    onResetAccount={() => handleUpdateStatusUser(row.id)}
                  />
                ))}
                <TableEmptyRows height={denseHeight} emptyRows={tableEmptyRows(page, rowsPerPage, users.length)} />
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
        <CommonBackdrop
          loading={loadingUser || loading || loadingDeleteUser || loadingUpdateUserStatus || loadingResetPassword}
        />
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.fullName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
