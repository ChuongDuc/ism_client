// noinspection DuplicatedCode,JSCheckFunctionSignatures,JSUnresolvedReference

import {
  Button,
  Card,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import { ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';
import { TableEmptyRows, TableSkeleton } from '../table';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
import ProductDialogTableRow from './ProductDialogTableRow';
import { DefaultMaxHeight, DefaultRowsPerPageDialog } from '../../constant';
import TableHeadAndSelectedCustom from '../table/TableHeadAndSelectedCustom';
import { PATH_DASHBOARD } from '../../routes/paths';

const LIST_ALL_PRODUCT = loader('../../graphql/queries/products/listAllProduct.graphql');
const ALL_PRODUCT_CATEGORIES = loader('../../graphql/queries/products/getAllCategory.graphql');
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left', width: 50 },
  { id: 'productName', label: 'Tên sản phẩm', align: 'left' },
  { id: 'length', label: 'Độ dài', align: 'left' },
  { id: 'weight', label: 'Trọng lượng', align: 'left' },
  { id: 'priceWithoutVAT', label: 'Giá chưa VAT', align: 'left', editable: true },
  { id: 'totalPriceWithoutVAT', label: 'Tổng giá chưa VAT', align: 'left' },
  { id: 'priceWithVAT', label: 'Giá có VAT', align: 'left' },
  { id: 'totalPriceWithVAT', label: 'Tổng giá có VAT', align: 'left' },
  { id: '' },
];

export const DEFAULT_CATEGORY = {
  id: 0,
  name: 'Chọn danh mục',
};

export const UNIT = [
  { label: 'Cây', value: 'pipe' },
  { label: 'Tấm', value: 'plate' },
  { label: 'Cái', value: 'cai' },
  { label: 'Chiếc', value: 'chiec' },
  { label: 'Mét', value: 'm' },
  { label: 'Kg', value: 'kg' },
];
// ----------------------------------------------------------------------

ProductsDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  createNewProduct: PropTypes.func,
};

export default function ProductsDialog({ open, onClose, onSelect, createNewProduct }) {
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState(DEFAULT_CATEGORY);

  const navigate = useNavigate();

  const [products, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });
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
  } = useTable({
    defaultRowsPerPage: DefaultRowsPerPageDialog,
  });

  const { data: allProduct, fetchMore } = useQuery(LIST_ALL_PRODUCT, {
    variables: {
      input: {
        name: filterName,
        category: filterCategory.id === 0 ? undefined : filterCategory.id,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });
  const { data: allCategories } = useQuery(ALL_PRODUCT_CATEGORIES, {
    fetchPolicy: 'cache-first',
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listAllProducts: {
        ...previousResult.listAllProducts,
        edges: [...previousResult.listAllProducts.edges, ...fetchMoreResult.listAllProducts.edges],
        pageInfo: fetchMoreResult.listAllProducts.pageInfo,
        totalCount: fetchMoreResult.listAllProducts.totalCount,
      },
    };
  };

  useEffect(() => {
    if (allCategories) {
      setCategories(allCategories?.getAllCategory);
    }
  }, [allCategories]);

  useEffect(() => {
    if (allProduct) {
      setProduct(allProduct.listAllProducts?.edges.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allProduct.listAllProducts.pageInfo.hasNextPage,
        endCursor: parseInt(allProduct.listAllProducts.pageInfo.endCursor, 10),
      }));
    }
  }, [allProduct]);

  useEffect(() => {
    setTableData(products);
  }, [products]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  const handleFilterCategory = (event) => {
    if (event?.target?.value) {
      setFilterCategory(event?.target?.value);
      setPage(0);
    }
  };

  const handleAddSingleRow = (product) => {
    onSelect([product]);
    setSelected([]);
    setFilterName('');
    setPage(0);
    onClose();
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

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
            productName: filterName,
            category: filterCategory.id === 0 ? undefined : filterCategory.id,
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
    fetchMore,
    filterName,
    filterCategory.id,
    rowsPerPage,
    page,
    setPage,
  ]);

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

  const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;

  const handleSelectMultiple = (productIds) => {
    const productRows = tableData.filter((pr) => productIds.includes(pr.id));
    onSelect(productRows);
    setSelected([]);
    setFilterName('');
    setPage(0);
    onClose();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.product.edit(id));
  };

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="subtitle1"> Chọn sản phẩm </Typography>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => {
            onClose();
            createNewProduct();
          }}
        >
          Tạo sản phẩm mới
        </Button>
      </Stack>

      <Card>
        <ProductTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          categories={categories}
          filterCategory={filterCategory}
          onFilterCategory={handleFilterCategory}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative', height: DefaultMaxHeight }} ref={tableEl}>
            <Table size="small" stickyHeader>
              <TableHeadAndSelectedCustom
                dense={dense}
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onSort={onSort}
                rowCount={products.length}
                numSelected={selected.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                selected={selected}
                actions={
                  <Tooltip title="Thêm sản phẩm vào báo giá">
                    <IconButton color="primary" onClick={() => handleSelectMultiple(selected)}>
                      <Iconify icon={'material-symbols:assignment-add-rounded'} />
                    </IconButton>
                  </Tooltip>
                }
              />

              <TableBody>
                {dataFiltered.map((row, index) =>
                  row ? (
                    <ProductDialogTableRow
                      key={index}
                      row={row}
                      idx={index}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onAddSingleRow={() => handleAddSingleRow(row)}
                      selectRow={() => {
                        handleAddSingleRow(row);
                      }}
                      onEditRow={() => handleEditRow(row.id)}
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
      </Card>
    </Dialog>
  );
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
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
