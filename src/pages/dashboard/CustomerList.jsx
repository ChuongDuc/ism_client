import { Box, Button, Card, Container, Stack, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useTable from '../../hooks/useTable';
import { DefaultMaxHeight, DefaultRowsPerPage, Role } from '../../constant';
import Iconify from '../../components/Iconify';
import useResponsive from '../../hooks/useResponsive';
import useAuth from '../../hooks/useAuth';
import CustomerToolbar from '../../sections/@dashboard/customer/CustomerToolbar';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableNoData } from '../../components/table';
import CommonBackdrop from '../../components/CommonBackdrop';
import CustomerTableRow from '../../sections/@dashboard/customer/list/CustomerTableRow';
import TableHeadAndSelectedCustom from '../../components/table/TableHeadAndSelectedCustom';

// ----------------------------------------------------------------------
const LIST_ALL_CUSTOMER = loader('../../graphql/queries/customer/listAllCustomer.graphql');

const DELETE_CUSTOMER = loader('../../graphql/mutations/customer/deleteCustomer.graphql');

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left', width: 50 },
  { id: 'customer', label: 'Khách hàng', align: 'left' },
  { id: 'company', label: 'Tên công ty', align: 'left', minWidth: 150 },
  { id: 'phoneNumber', label: 'SĐT', align: 'left' },
  { id: 'address', label: 'Địa chỉ', align: 'left' },
  { id: 'email', label: 'Email', align: 'left', minWidth: 120 },
  { id: '', align: 'right' },
];

export default function CustomerList() {
  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

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
    onSort,
  } = useTable({
    defaultOrderBy: 'createDate',
    defaultRowsPerPage: DefaultRowsPerPage,
  });

  const [filterName, setFilterName] = useState('');

  const [customers, setCustomer] = useState([]);

  // const [exportData, setExportData] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const {
    data: allCustomer,
    fetchMore,
    refetch: refetchCustomer,
    loading: loadingCustomer,
  } = useQuery(LIST_ALL_CUSTOMER, {
    variables: {
      input: {
        searchQuery: filterName,
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
      listAllCustomer: {
        ...previousResult.listAllCustomer,
        edges: [...previousResult.listAllCustomer.edges, ...fetchMoreResult.listAllCustomer.edges],
        pageInfo: fetchMoreResult.listAllCustomer.pageInfo,
        totalCount: fetchMoreResult.listAllCustomer.totalCount,
      },
    };
  };

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => {
      enqueueSnackbar('Xóa khách hàng thành công.', {
        variant: 'success',
      });
    },
    onError: (error) => {
      let errMessage = `Xóa khách hàng không thành công: ${error.message ?? error}`;
      if (error.message && error.message.includes('a foreign key constraint fails')) {
        errMessage = 'Không thể xoá khách hàng đã hoặc đang có đơn hàng';
      }
      enqueueSnackbar(`${errMessage}`, {
        variant: 'error',
        autoHideDuration: 15000,
      });
    },
  });

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

  const handleDeleteCustomer = async (selected) => {
    await deleteCustomer({
      variables: {
        input: {
          ids: selected,
        },
      },
    });
    setSelected([]);
    await refetchCustomer();
  };

  const customerListTableRef = useRef();
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const scrollListener = useCallback(() => {
    const bottom = customerListTableRef.current?.scrollHeight - customerListTableRef.current?.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }

    if (customerListTableRef.current?.scrollTop > bottom - distanceBottom && pageInfo.hasNextPage && !loading) {
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
  }, [distanceBottom, pageInfo.hasNextPage, loading, fetchMore, filterName, rowsPerPage, page, setPage]);

  useLayoutEffect(() => {
    const tableRef = customerListTableRef.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  // TODO: xem lai thu bien xlsx-populate
  // const getSheetData = (data, header, isUseHeader = true) => {
  //   if (data === null || data === undefined || data.length < 1) {
  //     return [[]];
  //   }
  //   const sheetData = data.map((row) => header.map((fieldName) => (row[fieldName] ? row[fieldName] : 0.0)));
  //   if (isUseHeader) {
  //     sheetData.unshift(header);
  //   }
  //   return sheetData;
  // };
  // useEffect(() => {
  //   if (customers) {
  //     const arrayData = [];
  //     customers.map((customer, index) =>
  //       arrayData.push({
  //         [`STT`]: index + 1,
  //         [`Tên`]: customer?.name,
  //         [`Tên công ty`]: customer?.company,
  //         [`Điện thoại`]: customer?.phoneNumber,
  //         [`Địa chỉ`]: customer?.address,
  //       })
  //     );
  //     setExportData(arrayData);
  //   }
  // }, [customers]);
  //
  // const handleSaveAsExcel = () => {
  //   const header = ['STT', 'Tên khách hàng', 'Tên công ty', 'Điện thoại', 'Địa chỉ'];
  //
  //   XlsxPopulate.fromBlankAsync().then(async (workbook) => {
  //     const sheet1 = workbook.sheet(0).name('Danh sách khách hàng');
  //     const sheetData = getSheetData(exportData, header);
  //
  //     sheet1.cell('A1').value(sheetData);
  //
  //     sheet1.column('A').width(35).style({
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'left',
  //     });
  //     sheet1.column('B').width(8).style({
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'center',
  //     });
  //     sheet1.column('C').width(13).style({
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'right',
  //     });
  //     sheet1.column('D').width(14).style({
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'right',
  //     });
  //     sheet1.column('E').width(18).style({
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'right',
  //     });
  //
  //     // Get the range of the entire data in the sheet
  //     const range = sheet1.usedRange();
  //
  //     // Set the border style of the entire range
  //     range.style({
  //       border: true,
  //       borderColor: '959595',
  //       borderStyle: 'medium',
  //       fontFamily: 'Arial',
  //       fontSize: 11,
  //       fontColor: '666666',
  //     });
  //
  //     for (let i = 1; i <= range._maxRowNumber; i += 1) {
  //       sheet1.row(i).height(25.2);
  //     }
  //
  //     sheet1.cell('A1').style({
  //       fontFamily: 'Arial',
  //       fontSize: 11,
  //       fontColor: '000000',
  //       border: false,
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'left',
  //     });
  //     sheet1.cell('B1').style({
  //       fontFamily: 'Arial',
  //       fontSize: 11,
  //       fontColor: '000000',
  //       border: false,
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'left',
  //     });
  //     sheet1.cell('C1').style({
  //       fontFamily: 'Arial',
  //       fontSize: 11,
  //       fontColor: '000000',
  //       border: false,
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'left',
  //     });
  //     sheet1.cell('D1').style({
  //       fontFamily: 'Arial',
  //       fontSize: 11,
  //       fontColor: '000000',
  //       border: false,
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'left',
  //     });
  //     sheet1.cell('E1').style({
  //       fontFamily: 'Arial',
  //       fontSize: 11,
  //       fontColor: '000000',
  //       border: false,
  //       verticalAlignment: 'center',
  //       horizontalAlignment: 'left',
  //     });
  //
  //     return workbook.outputAsync().then((res) => {
  //       saveAs(res, `Danh_sach_KH.xlsx`);
  //     });
  //   });
  // };

  const isNotFound = !customers.length && !!filterName;

  const isDesktop = useResponsive('up', 'md');

  return (
    <Page title="Khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Khách hàng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Khách hàng', href: PATH_DASHBOARD.customer.root },
            { name: 'Danh sách' },
          ]}
          action={
            <>
              {(user.role === Role.sales || user.role === Role.admin) && (
                <Stack direction={isDesktop ? 'row' : 'column'} justifyContent="space-between" sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Button
                      size="medium"
                      variant="contained"
                      component={RouterLink}
                      to={PATH_DASHBOARD.customer.new}
                      startIcon={<Iconify icon={'eva:plus-fill'} />}
                    >
                      Tạo mới
                    </Button>
                  </Box>
                </Stack>
              )}
            </>
          }
        />

        <Card>
          <CustomerToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            // onDownloadExcel={handleSaveAsExcel}
          />

          <Scrollbar>
            <TableContainer
              sx={{ minWidth: 800, position: 'relative', maxHeight: DefaultMaxHeight, minHeight: DefaultMaxHeight }}
              ref={customerListTableRef}
            >
              <Table size="small" stickyHeader>
                <TableHeadAndSelectedCustom
                  dense={dense}
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                  rowCount={customers.length}
                  numSelected={selected.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      customers.map((row) => row.id)
                    )
                  }
                  selected={selected}
                  actions={
                    <Tooltip title="Xóa khách hàng">
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ minWidth: '145px' }}
                        startIcon={<Iconify icon={'fluent:person-delete-24-filled'} />}
                        onClick={() => handleDeleteCustomer(selected)}
                      >
                        Xóa
                      </Button>
                    </Tooltip>
                  }
                />

                <TableBody>
                  {customers.map((row, idx) => (
                    <CustomerTableRow
                      key={idx}
                      row={row}
                      idx={idx}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      refetchData={refetchCustomer}
                    />
                  ))}

                  <TableEmptyRows height={56} emptyRows={tableEmptyRows(page, rowsPerPage, customers.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <CommonBackdrop loading={loadingCustomer || loading} />
        </Card>
      </Container>
    </Page>
  );
}

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}
