// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { Button, Card, Dialog, Stack, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import useTable, { getComparator } from '../../../../hooks/useTable';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import CustomerTableToolbar from '../../customer/list/CustomerTableToolbar';
import { TableEmptyRows, TableHeadCustom, TableSkeleton } from '../../../../components/table';
import CustomerTableRow from '../../customer/CustomerTableRow';
import { DefaultMaxHeight, DefaultRowsPerPage } from '../../../../constant';

const LIST_ALL_CUSTOMER = loader('../../../../graphql/queries/customer/listAllCustomer.graphql');

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên khách hàng', align: 'left' },
  { id: 'phoneNumber', label: 'Số điện thoại', align: 'left' },
  { id: 'email', label: 'email', align: 'left' },
  { id: 'company', label: 'Công ty', align: 'left' },
];

CustomerListDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  createNewCustomer: PropTypes.func,
};

export default function CustomerListDialog({ open, onClose, onSelect, createNewCustomer }) {
  const { page, order, orderBy, rowsPerPage, setPage, selected, onSort } = useTable({
    defaultOrderBy: 'createdAt',
    defaultRowsPerPage: DefaultRowsPerPage,
  });

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const [filterName, setFilterName] = useState('');

  const [customers, setCustomer] = useState([]);

  const {
    data: allCustomer,
    fetchMore,
    refetch,
  } = useQuery(LIST_ALL_CUSTOMER, {
    variables: {
      input: {
        searchQuery: filterName,
        args: {
          first: DefaultRowsPerPage,
          after: 0,
        },
      },
    },
  });

  const handleSelect = (customer) => {
    onSelect(customer);
    refetch().catch((e) => console.error(e));
    setPage(0);
    onClose();
  };

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllCustomer: {
        ...previousResult.listAllCustomer,
        edges: [...previousResult.listAllCustomer.edges, ...fetchMoreResult.listAllCustomer.edges],
        pageInfo: fetchMoreResult.listAllCustomer.pageInfo,
        totalCount: fetchMoreResult.listAllCustomer.totalCount,
      },
    };
  };

  useEffect(() => {
    if (allCustomer) {
      setCustomer(allCustomer?.listAllCustomer?.edges.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allCustomer?.listAllCustomer?.pageInfo.hasNextPage,
        endCursor: parseInt(allCustomer?.listAllCustomer?.pageInfo.endCursor, 10),
      }));
    }
  }, [allCustomer]);

  const dataFiltered = applySortFilter({
    tableData: customers,
    comparator: getComparator(order, orderBy),
  });

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
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
  }, [setPage, fetchMore, pageInfo.hasNextPage, filterName, rowsPerPage, page, loading, distanceBottom]);

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

  const isNotFound = (!dataFiltered?.length && !!filterName) || !dataFiltered?.length;

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="subtitle1"> Chọn khách hàng </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => {
            onClose();
            createNewCustomer();
          }}
        >
          Tạo khách hàng mới
        </Button>
      </Stack>

      <Card>
        <CustomerTableToolbar filterName={filterName} onFilterName={handleFilterName} />

        <Scrollbar sx={{ p: 1.5, pt: 0 }}>
          <TableContainer
            sx={{ minWidth: 800, position: 'relative', maxHeight: DefaultMaxHeight, minHeight: DefaultMaxHeight }}
            ref={tableEl}
          >
            <Table size="small" stickyHeader>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={customers.length}
                onSort={onSort}
              />

              <TableBody>
                {dataFiltered?.map((row, index) =>
                  row ? (
                    <CustomerTableRow
                      key={index}
                      row={row}
                      idx={index}
                      selected={selected.includes(row.id)}
                      selectRow={() => {
                        handleSelect(row);
                      }}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: 60 }} />
                  )
                )}
                <TableEmptyRows height={60} emptyRows={tableEmptyRows(page, rowsPerPage, customers?.length)} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Dialog>
  );
}

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}

function applySortFilter({ tableData, comparator }) {
  const stabilizedThis = tableData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis?.map((el) => el[0]);

  return tableData;
}
