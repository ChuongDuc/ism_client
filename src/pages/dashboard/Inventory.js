// noinspection JSUnresolvedReference,DuplicatedCode

import { Button, Card, Container, Input, Stack, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSkeleton } from '../../components/table';
import Scrollbar from '../../components/Scrollbar';
import { DefaultRowsPerPage } from '../../constant';
import useTable, { getComparator } from '../../hooks/useTable';
import Iconify from '../../components/Iconify';
import useResponsive from '../../hooks/useResponsive';
import Page from '../../components/Page';
import { fddMMYYYYWithSlash } from '../../utils/formatTime';
import InventoryTableToolbar from '../../sections/@dashboard/inventory/inventory-list/InventoryTableToolbar';
import InventoryListTableRow from '../../sections/@dashboard/inventory/inventory-list/InventoryListTableRow';
import CommonBackdrop from '../../components/CommonBackdrop';

// ----------------------------------------------------------------------
const LIST_ALL_INVENTORY = loader('../../graphql/queries/inventory/listAllInventory.graphql');
const IMPORT_EXCEL_INVENTORY = loader('../../graphql/mutations/inventory/importFileExcelInventory.graphql');

// ----------------------------------------------------------------------

export const TABLE_HEAD_INVENTORY = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'code', label: 'Mã hàng', align: 'left' },
  { id: 'name', label: 'Tên hàng', align: 'left' },
  { id: 'unit', label: 'Đơn vị', align: 'left' },
  { id: 'quantity', label: 'Số lượng', align: 'left' },
  { id: 'weight', label: 'Đơn trọng', align: 'left' },
];
export default function Inventory() {
  const { enqueueSnackbar } = useSnackbar();
  const { dense, page, order, orderBy, rowsPerPage, setPage, onSort } = useTable({
    defaultOrderBy: 'createdAt',
    defaultRowsPerPage: DefaultRowsPerPage,
  });

  const [inventory, setInventory] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [isImported, setIsImported] = useState(false);

  const [excelFile, setExcelFile] = useState(null);

  const [fileName, setFileName] = useState('');

  const [date, setDate] = useState(new Date());

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const {
    data: allInventory,
    fetchMore,
    refetch: refetchInventory,
    loading: loadingInventory,
  } = useQuery(LIST_ALL_INVENTORY, {
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

  const [importInventory, { loading: loadingImport }] = useMutation(IMPORT_EXCEL_INVENTORY, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    const updatedEdges = [...previousResult.listAllInventory.edges, ...fetchMoreResult.listAllInventory.edges];
    return {
      ...previousResult,
      listAllInventory: {
        ...previousResult.listAllInventory,
        edges: updatedEdges,
        pageInfo: fetchMoreResult.listAllInventory.pageInfo,
        totalCount: fetchMoreResult.listAllInventory.totalCount,
      },
    };
  };

  useEffect(() => {
    if (allInventory) {
      setInventory(allInventory.listAllInventory?.edges.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allInventory.listAllInventory.pageInfo.hasNextPage,
        endCursor: parseInt(allInventory.listAllInventory.pageInfo.endCursor, 10),
      }));
    }
  }, [allInventory]);

  useEffect(() => {
    if (inventory[0]) {
      setDate(new Date(inventory[0].updatedAt));
    }
  }, [inventory]);

  const importExcel = async (e) => {
    const file = e?.target?.files[0];
    setExcelFile(file);
    setFileName(file.name);
  };

  const handleConfirmFile = async () => {
    try {
      const response = await importInventory({
        variables: {
          input: {
            fileExcelInventory: excelFile,
            fileName,
          },
        },
        onError: (error) => {
          enqueueSnackbar(`Thêm không thành công. Sản phẩm đã tồn tại hoặc nhập thiếu thông tin ${error}.`, {
            variant: 'error',
            autoHideDuration: 10000,
          });
        },
      });

      if (!response.errors) {
        if (response.data?.importFileExcelInventory?.length > 0) {
          enqueueSnackbar(`Thêm thành công ${response.data?.importFileExcelInventory?.length} sản phẩm`, {
            variant: 'success',
            autoHideDuration: 10000,
          });
          setPage(0);
        }
      }
      setIsImported(true);
      await refetchInventory();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const dataFiltered = applySortFilter({
    inventory,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = dense ? 60 : 80;

  const isDesktop = useResponsive('up', 'md');

  const tableEl = useRef();
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);

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

  const isNotFound = !dataFiltered.length || (!allInventory?.loading && !dataFiltered.length);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef.addEventListener('scroll', scrollListener);
    return () => {
      tableRef.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  return (
    <Page title="Danh sách tồn kho">
      <Container maxWidth={false}>
        <Stack direction={isDesktop ? 'row' : 'column'} justifyContent={{ xs: 'flex-start', md: 'space-between' }}>
          <Stack alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ textAlign: { xs: 'left', md: 'center' }, marginRight: 2, color: 'text.primary' }}
            >
              {`Tồn kho cập nhật ngày ${isImported ? fddMMYYYYWithSlash(new Date()) : fddMMYYYYWithSlash(date)}`}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'space-between' }} alignItems="center">
            <Typography variant="subtitle1" sx={{ textAlign: 'center', marginRight: 2, color: 'text.primary' }}>
              {excelFile?.name}
            </Typography>
            <Input
              inputComponent="input"
              type={'file'}
              onChange={importExcel}
              inputRef={inputRef}
              inputProps={{ accept: '.xlsx,.csv' }}
              sx={{ display: 'none' }}
            />

            <Button
              sx={{
                maxHeight: 50,
                alignSelf: 'center',
                marginRight: 1,
              }}
              size="small"
              disabled={!excelFile}
              variant="contained"
              color="warning"
              onClick={handleConfirmFile}
              startIcon={<Iconify icon="mingcute:file-import-fill" />}
            >
              Import sản phẩm
            </Button>

            <Button
              sx={{
                maxHeight: 50,
                alignSelf: 'center',
              }}
              size="small"
              variant="contained"
              color="warning"
              onClick={handleClick}
              startIcon={<Iconify icon="mdi:file-find-outline" />}
            >
              Chọn file
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ mt: 1 }}>
          <InventoryTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar sx={{ mt: 1 }}>
            <TableContainer
              sx={{ minWidth: 800, position: 'relative', maxHeight: '84dvh', minHeight: '84dvh' }}
              ref={tableEl}
            >
              <Table size="small" stickyHeader>
                <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD_INVENTORY} onSort={onSort} />
                <TableBody>
                  {dataFiltered.map((row, index) =>
                    row ? (
                      <InventoryListTableRow key={index} row={row} idx={index} />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={tableEmptyRows(page, rowsPerPage, inventory.length)}
                  />
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
        <CommonBackdrop loading={loadingInventory || loading || loadingImport} />
      </Container>
    </Page>
  );
}
function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}

function applySortFilter({ inventory, comparator }) {
  const stabilizedThis = inventory?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inventory = stabilizedThis.map((el) => el[0]);

  return inventory;
}
