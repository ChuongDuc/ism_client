// noinspection DuplicatedCode

import PropTypes from 'prop-types';
// @mui
import { Box, Checkbox, Stack, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

TableHeadAndSelectedCustom.propTypes = {
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  sx: PropTypes.object,
  dense: PropTypes.bool,
  actions: PropTypes.node,
  selected: PropTypes.array,
};

export default function TableHeadAndSelectedCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
  dense,
  actions,
  selected,
}) {
  return (
    <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, ...sx }}>
      {selected.length > 0 && (
        <TableRow sx={{ paddingX: 0 }}>
          <TableCell colSpan={headLabel.length + 1} sx={{ position: 'sticky', top: 0, paddingX: 0, paddingTop: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: 1,
                height: 38,
                borderRadius: 0,
                bgcolor: 'primary.lighter',
              }}
            >
              <Checkbox
                size="small"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={(event) => onSelectAllRows(event.target.checked)}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  ml: 1,
                  flexGrow: 1,
                  color: 'primary.main',
                  ...(dense && {
                    ml: 1,
                  }),
                }}
              >
                {numSelected} được chọn
              </Typography>

              {actions && actions}
            </Stack>
          </TableCell>
        </TableRow>
      )}

      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              size="small"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
                sx={{ textTransform: 'none', typography: 'subtitle1' }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
