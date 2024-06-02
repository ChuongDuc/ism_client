// noinspection DuplicatedCode,JSCheckFunctionSignatures

import { Card, Dialog, Stack, Table, TableBody, TableContainer, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import Scrollbar from '../Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableSkeleton } from '../table';
import useTable, { emptyRows } from '../../hooks/useTable';
import UserDialogTableRow from './UserDialogTableRow';
import { DefaultMaxHeight, DefaultRowsPerPageDialog } from '../../constant';
import CommonBackdrop from '../CommonBackdrop';

const LIST_USER = loader('../../graphql/queries/user/getAllUsers.graphql');
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên người dùng', align: 'left' },
  { id: 'account', label: 'Tên tài khoản', align: 'left' },
  { id: 'email', label: 'email', align: 'left' },
  { id: 'phoneNumber', label: 'SĐT', align: 'left' },
];
// ----------------------------------------------------------------------

UserListDialog.propTypes = {
  onClose: PropTypes.func,
  deliverOder: PropTypes.object,
  open: PropTypes.bool,
  role: PropTypes.string,
};

export default function UserListDialog({ open, onClose, role, deliverOder }) {
  const [tableData, setTableData] = useState([]);
  const [filterName] = useState('');
  const [listUser, setListUser] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });
  const { dense, page, order, orderBy, rowsPerPage, setPage } = useTable({
    defaultOrderBy: 'createdAt',
    defaultRowsPerPage: DefaultRowsPerPageDialog,
  });

  const { data: allUsers, fetchMore } = useQuery(LIST_USER, {
    variables: {
      input: {
        searchQuery: filterName,
        role,
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

  useEffect(() => {
    if (allUsers) {
      setListUser(allUsers.users?.edges.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allUsers.users.pageInfo.hasNextPage,
        endCursor: parseInt(allUsers.users.pageInfo.endCursor, 10),
      }));
    }
  }, [allUsers]);

  useEffect(() => {
    if (listUser.length) {
      setTableData(listUser);
    }
  }, [listUser]);

  // const handleFilterName = (filterName) => {
  //   setFilterName(filterName);
  //   setPage(0);
  // };

  const handleClose = () => {
    onClose();
  };

  const tableEl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [open]);

  const scrollListener = useCallback(() => {
    const bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }

    if (tableEl.current.scrollTop > bottom - distanceBottom && pageInfo.hasNextPage && !loading) {
      setLoading(true);
      fetchMore({
        variables: {
          input: {
            searchQuery: filterName,
            role,
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
  }, [setPage, fetchMore, pageInfo.hasNextPage, role, filterName, rowsPerPage, page, loading, distanceBottom]);

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (tableEl.current && dialogOpen) {
      const tableRef = tableEl.current;
      tableRef.addEventListener('scroll', scrollListener);

      return () => {
        tableRef.removeEventListener('scroll', scrollListener);
      };
    }
  }, [tableEl, scrollListener, dialogOpen]);

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!listUser.length && !!filterName) || !listUser.length;

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> Chọn {role}</Typography>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative', height: DefaultMaxHeight }} ref={tableEl}>
            <Table size="small" stickyHeader>
              <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {listUser.map((row, index) =>
                  row ? (
                    <UserDialogTableRow
                      key={index}
                      row={row}
                      idx={index}
                      selectRow={() => {
                        handleClose();
                      }}
                      deliverOder={deliverOder}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}
                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <CommonBackdrop loading={loading} />
      </Card>
    </Dialog>
  );
}
