import { Stack } from '@mui/material';
// components

// ----------------------------------------------------------------------

TransportationTableToolbar.propTypes = {};

export default function TransportationTableToolbar() {
  return <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }} />;
}
