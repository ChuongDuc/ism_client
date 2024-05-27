// noinspection JSUnresolvedReference,JSValidateTypes

import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Container,
  Input,
  Link,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as xlsx from 'xlsx';
import { useNavigate, useParams } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import isString from 'lodash/isString';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { formatUnit, formatIdToFileName } from '../../../../utils/getFormatProduct';
import { TableEmptyRows, TableNoData, TableSkeleton } from '../../../../components/table';
import Scrollbar from '../../../../components/Scrollbar';
import useTable, { getComparator } from '../../../../hooks/useTable';
import PriceListTableRow from './PriceListTableRow';
import PriceTableToolbar from './PriceTableToolbar';
import Iconify from '../../../../components/Iconify';
import useResponsive from '../../../../hooks/useResponsive';
import useAuth from '../../../../hooks/useAuth';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { DefaultMaxHeight, DefaultRowsPerPage, Role } from '../../../../constant';
import TableHeadAndSelectedCustom from '../../../../components/table/TableHeadAndSelectedCustom';
import CommonBackdrop from '../../../../components/CommonBackdrop';
import useToggle from '../../../../hooks/useToggle';
import ResultImportProductFromExcelDialog from '../../category-product/ResultImportProductFromExcelDialog';
import DialogVATFormType from './DialogVATFormType';

const LIST_ALL_PRODUCT = loader('../../../../graphql/queries/products/listAllProduct.graphql');
const IMPORT_EXCEL = loader('../../../../graphql/mutations/products/importExcelFile.graphql');
const GET_ALL_CATEGORY = loader('../../../../graphql/queries/products/getAllCategory.graphql');
const UPDATE_CATEGORY_PRODUCT = loader('../../../../graphql/mutations/categoryProduct/updateCategoryProduct.graphql');
const DELETE_PRODUCT = loader('../../../../graphql/mutations/products/deleteProductById.graphql');

// ----------------------------------------------------------------------
export const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left', width: 50 },
  { id: 'name', label: 'Tên sản phẩm', align: 'left' },
  { id: 'code', label: 'Mã sản phẩm', align: 'left' },
  { id: 'height', label: 'Chiều dài', align: 'left' },
  { id: 'weight', label: 'Đơn trọng', align: 'left' },
  { id: 'price', label: 'Giá', align: 'left' },
  { id: 'totalPrice', label: 'Tổng giá sản phẩm', align: 'left' },
  { id: '' },
];

export default function PriceList() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const {
    dense,
    page,
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
    defaultOrderBy: 'createdAt',
    defaultRowsPerPage: DefaultRowsPerPage,
  });

  const {
    toggle: isOpenErrorImportFileDialog,
    onOpen: onOpenErrorImportFileDialog,
    onClose: onCloseErrorImportFileDialog,
  } = useToggle();

  const [errorMessages, setErrorMessages] = useState([]);
  const [addNewMessage, setAddNewMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [products, setProduct] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [categories, setCategories] = useState([]);

  const [excelFile, setExcelFile] = useState(null);

  const [exportData, setExportData] = useState([]);

  const [convertData, setConvertData] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const [totalCount, setTotalCount] = useState(0);

  const inputRef = useRef(null);

  const { data: exportProduct, refetch: refetchExportProduct } = useQuery(LIST_ALL_PRODUCT, {
    variables: {
      input: {
        category: Number(id),
      },
    },
  });

  const { data: getAllCategory, refetch: refetchAllCategory } = useQuery(GET_ALL_CATEGORY);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      enqueueSnackbar('Xóa sản phẩm thành công', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(`Xóa lệnh gom hàng không thành công. ${error.message}`, {
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (exportProduct) {
      setConvertData(exportProduct.listAllProducts?.edges.map((edge) => edge.node));
    }
  }, [exportProduct]);

  useEffect(() => {
    if (getAllCategory) {
      setCategories(getAllCategory?.getAllCategory.filter((category) => category?.id === Number(id)));
    }
  }, [getAllCategory, id]);

  const {
    data: allProduct,
    refetch: refetchProduct,
    fetchMore,
    loading: productLoading,
  } = useQuery(LIST_ALL_PRODUCT, {
    variables: {
      input: {
        category: Number(id),
        name: filterName,
        args: {
          first: rowsPerPage,
          after: 0,
        },
      },
    },
  });

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    const updatedEdges = [...previousResult.listAllProducts.edges, ...fetchMoreResult.listAllProducts.edges];
    return {
      ...previousResult,
      listAllProducts: {
        ...previousResult.listAllProducts,
        edges: updatedEdges,
        pageInfo: fetchMoreResult.listAllProducts.pageInfo,
        totalCount: fetchMoreResult.listAllProducts.totalCount,
      },
    };
  };

  useEffect(() => {
    if (allProduct) {
      setProduct(allProduct.listAllProducts?.edges.map((edge) => edge.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: allProduct.listAllProducts.pageInfo.hasNextPage,
        endCursor: parseInt(allProduct.listAllProducts.pageInfo.endCursor, 10),
      }));
      setTotalCount(allProduct?.listAllProducts?.totalCount);
    }
  }, [allProduct]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (convertData) {
      const arrayData = [];
      convertData.map((product) =>
        arrayData.push({
          [`Tên`]: product?.name,
          [`Trọng lượng`]: product?.weight,
          [`Giá sản phẩm`]: product?.price,
          [`Độ dài`]: product?.height,
          [`Mã sản phẩm`]: product?.code,
          [`Danh mục`]: product?.category?.name,
          [`Đơn vị`]: formatUnit(product),
        })
      );
      setExportData(arrayData);
    }
  }, [convertData]);

  const [importProduct, { loading: loadingImport }] = useMutation(IMPORT_EXCEL);

  const importExcel = async (e) => {
    const file = e?.target?.files[0];
    setExcelFile(file);
  };

  const handleConfirmFile = async () => {
    try {
      const response = await importProduct({
        variables: {
          input: {
            fileExcelProducts: excelFile,
            categoryId: Number(id),
          },
        },
        onCompleted: async (res) => {
          if (res) {
            return res;
          }
          return null;
        },
        onError: () => {
          enqueueSnackbar(`Lỗi khi import sản phẩm từ file excel. Thông tin sai hoặc bị trùng`, {
            variant: 'error',
            autoHideDuration: 10000,
          });
        },
      });

      if (response && !response.errors) {
        if (response.data && response.data?.importFileExcelProducts) {
          setErrorMessages(response.data?.importFileExcelProducts?.validationErrors || []);
          setAddNewMessage(response.data?.importFileExcelProducts?.addNewMessage);
          setUpdateMessage(response.data?.importFileExcelProducts?.updateMessage);
          setPage(0);
          onOpenErrorImportFileDialog();
        }
        if (
          response.data?.importFileExcelProducts?.validationErrors &&
          response.data?.importFileExcelProducts?.validationErrors.length &&
          response.data?.importFileExcelProducts?.validationErrors.length < 1
        ) {
          setExcelFile(null);
        }
        await refetchProduct();
        await refetchExportProduct();
      }
      await refetchProduct();
      await refetchExportProduct();
    } catch (error) {
      console.error(error);
    }
  };

  const dataFiltered = applySortFilter({
    products,
    comparator: getComparator(order, orderBy),
  });

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.product.edit(id));
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
    setSelected([]);
  };

  const getSheetData = (data, header, isUseHeader = true) => {
    if (data === null || data === undefined || data.length < 1) {
      return [[]];
    }
    const sheetData = data.map((row) => header.map((fieldName) => (row[fieldName] ? row[fieldName] : 0.0)));
    if (isUseHeader) {
      sheetData.unshift(header);
    }
    return sheetData;
  };

  const handleSaveAsExcel = () => {
    const header = ['Tên', 'Độ dài', 'Trọng lượng', 'Giá sản phẩm', 'Danh mục', 'Mã sản phẩm', 'Đơn vị'];

    const sheetData = getSheetData(exportData, header);

    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.aoa_to_sheet(sheetData);

    workSheet['!cols'] = [{ wpx: 250 }, { wpx: 50 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 50 }];

    // Define styles
    const colAStyle = {
      alignment: { vertical: 'center', horizontal: 'left' },
    };

    const colBStyle = {
      alignment: { vertical: 'center', horizontal: 'center' },
    };

    const colCStyle = {
      alignment: { vertical: 'center', horizontal: 'right' },
    };

    const colDStyle = {
      alignment: { vertical: 'center', horizontal: 'right' },
    };

    const colEStyle = {
      alignment: { vertical: 'center', horizontal: 'center' },
    };

    const colFStyle = {
      alignment: { vertical: 'center', horizontal: 'right' },
    };

    const colGStyle = {
      alignment: { vertical: 'center', horizontal: 'right' },
    };

    // Apply styles to all cells in columns A and B
    const range = xlsx.utils.decode_range(workSheet['!ref']);
    // eslint-disable-next-line no-plusplus
    for (let row = range.s.r; row <= range.e.r; ++row) {
      // Column A
      const cellA = workSheet[xlsx.utils.encode_cell({ c: 0, r: row })];
      if (cellA) cellA.s = colAStyle;

      // Column B
      const cellB = workSheet[xlsx.utils.encode_cell({ c: 1, r: row })];
      if (cellB) cellB.s = colBStyle;

      // Column C
      const cellC = workSheet[xlsx.utils.encode_cell({ c: 2, r: row })];
      if (cellC) cellC.s = colCStyle;

      // Column D
      const cellD = workSheet[xlsx.utils.encode_cell({ c: 3, r: row })];
      if (cellD) cellD.s = colDStyle;

      // Column E
      const cellE = workSheet[xlsx.utils.encode_cell({ c: 4, r: row })];
      if (cellE) cellE.s = colEStyle;

      // Column F
      const cellF = workSheet[xlsx.utils.encode_cell({ c: 5, r: row })];
      if (cellF) cellF.s = colFStyle;

      // Column G
      const cellG = workSheet[xlsx.utils.encode_cell({ c: 6, r: row })];
      if (cellG) cellG.s = colGStyle;
    }

    xlsx.utils.book_append_sheet(workBook, workSheet, 'Bang_gia_chung');
    xlsx.writeFile(workBook, `${formatIdToFileName(Number(id))}.xlsx`);
  };

  const denseHeight = dense ? 60 : 80;

  const isNotFound = !dataFiltered.length || (!productLoading && !dataFiltered.length);

  const isDesktop = useResponsive('up', 'md');

  const [updateCategoryProductFn] = useMutation(UPDATE_CATEGORY_PRODUCT, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
  });

  const [valueInput, setValueInput] = useState();

  const [isEditCategory, setIsEditCategory] = useState(false);

  useEffect(() => {
    if (categories) {
      setValueInput(categories[0]?.name);
    }
  }, [categories]);

  const handleInputChange = (e) => {
    let name = valueInput;
    if (e?.target?.value !== undefined) {
      name = e?.target?.value;
    }
    setValueInput(name);
  };

  const handleEdit = () => {
    setIsEditCategory(true);
  };

  const handleCancelEdit = () => {
    setIsEditCategory(false);
  };

  const handleUpdateCategory = async (name) => {
    const response = await updateCategoryProductFn({
      variables: {
        input: {
          name,
          id: categories[0]?.id,
        },
      },
      onError: () => {
        enqueueSnackbar(`Cập nhật không thành công.`, {
          variant: 'error',
        });
      },
    });
    if (!response.errors) {
      enqueueSnackbar('Cập nhật thành công', {
        variant: 'success',
      });
    }
  };

  const handleDeleteRows = async (selected) => {
    await deleteProduct({
      variables: {
        input: {
          productId: selected,
        },
      },
    });
    setSelected([]);
    await refetchProduct();
  };

  const onSubmit = async () => {
    setIsEditCategory(false);
    await handleUpdateCategory(valueInput);
    await refetchAllCategory();
  };

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
            category: Number(id),
            productName: filterName,
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
  }, [setPage, fetchMore, pageInfo.hasNextPage, id, filterName, rowsPerPage, page, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef.addEventListener('scroll', scrollListener);
    return () => {
      tableRef.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);
  return (
    <Container maxWidth={false}>
      <Stack direction={isDesktop ? 'row' : 'column'} justifyContent="space-between">
        <HeaderBreadcrumbs
          mb={0}
          heading={
            <Stack direction="row">
              {!isEditCategory ? (
                <Typography variant="h6" gutterBottom>
                  {`${valueInput} (${totalCount} sản phẩm) `}
                </Typography>
              ) : (
                <Input name="name" onChange={handleInputChange} type="text" value={`${valueInput}`} />
              )}
              {(user.role === Role.admin || user.role === Role.director) &&
                (!isEditCategory ? (
                  <>
                    <Button
                      sx={{
                        maxHeight: 50,
                        alignSelf: 'center',
                      }}
                      size={'medium'}
                      onClick={handleEdit}
                    >
                      <Iconify
                        icon={'material-symbols:edit'}
                        sx={{
                          maxHeight: 50,
                          alignSelf: 'center',
                        }}
                      />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      sx={{
                        maxHeight: 50,
                        alignSelf: 'center',
                      }}
                      size={'medium'}
                      onClick={onSubmit}
                    >
                      <Iconify icon={'material-symbols:check'} />
                    </Button>
                    <Button
                      sx={{
                        maxHeight: 50,
                        alignSelf: 'center',
                      }}
                      size={'medium'}
                      onClick={handleCancelEdit}
                    >
                      <Iconify
                        icon={'material-symbols:close'}
                        sx={{
                          maxHeight: 50,
                          alignSelf: 'center',
                        }}
                      />
                    </Button>
                  </>
                ))}
            </Stack>
          }
          links={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Bảng giá chung', href: PATH_DASHBOARD.priceList.root },
            { name: 'Bảng giá thép ' },
          ]}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
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
          <Button
            sx={{
              ml: 1,
              maxHeight: 50,
              alignSelf: 'center',
            }}
            size="small"
            color="warning"
            variant="contained"
            onClick={handleSaveAsExcel}
            startIcon={<Iconify icon={'material-symbols:download-rounded'} />}
          >
            Tải file
          </Button>
        </Stack>
      </Stack>

      <Card>
        <PriceTableToolbar filterName={filterName} onFilterName={handleFilterName} />
        <Scrollbar sx={{ mt: 1 }}>
          <TableContainer
            sx={{
              minWidth: 800,
              position: 'relative',
              maxHeight: DefaultMaxHeight,
              minHeight: DefaultMaxHeight,
            }}
            ref={tableEl}
          >
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
                    products?.map((row) => row.id)
                  )
                }
                selected={selected}
                actions={
                  <Stack spacing={1} direction="row">
                    <Tooltip title="Sửa giá chưa VAT">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="material-symbols:edit-rounded" width={16} height={16} />}
                        onClick={() => {
                          handleOpenDialog();
                        }}
                      >
                        Sửa giá sản phẩm
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon={'eva:trash-2-outline'} width={16} height={16} />}
                        onClick={() => {
                          handleDeleteRows(selected).catch((error) => {
                            console.error(error);
                          });
                        }}
                      >
                        Xóa
                      </Button>
                    </Tooltip>
                  </Stack>
                }
              />
              <TableBody>
                {dataFiltered.map((row, index) =>
                  row ? (
                    <PriceListTableRow
                      key={index}
                      row={row}
                      idx={index}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

                <TableEmptyRows height={denseHeight} emptyRows={tableEmptyRows(page, rowsPerPage, products.length)} />
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <CommonBackdrop loading={productLoading || loading || loadingImport} />
      </Card>

      <DialogVATFormType productId={selected} isOpen={open} onClose={handleCloseDialog} refetchData={refetchProduct} />

      <ResultImportProductFromExcelDialog
        open={isOpenErrorImportFileDialog}
        onClose={onCloseErrorImportFileDialog}
        errorMessages={errorMessages}
        addNewMessage={addNewMessage}
        updateMessage={updateMessage}
      />
    </Container>
  );
}

function tableEmptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, rowsPerPage - arrayLength) : 0;
}

function applySortFilter({ products, comparator }) {
  const stabilizedThis = products?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  products = stabilizedThis.map((el) => el[0]);

  return products;
}

HeaderBreadcrumbs.propTypes = {
  links: PropTypes.array,
  action: PropTypes.node,
  heading: PropTypes.object,
  moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sx: PropTypes.object,
  mb: PropTypes.number,
};

function HeaderBreadcrumbs({ links, action, heading, moreLink = '' || [], sx, mb = 5, ...other }) {
  const { user } = useAuth();
  return (
    <Box sx={{ mb, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {heading}
          </Typography>
          <Breadcrumbs links={links} {...other} />
        </Box>

        {(action && user?.role === Role.admin) || user?.role === Role.director ? (
          <Box sx={{ flexShrink: 0 }}>{action}</Box>
        ) : null}
      </Box>
      <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" rel="noopener" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>{' '}
    </Box>
  );
}
