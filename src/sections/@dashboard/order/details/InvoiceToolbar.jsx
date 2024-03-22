// noinspection JSValidateTypes

import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Box, CircularProgress, Dialog, DialogActions, IconButton, Stack, Tooltip } from '@mui/material';
import useToggle from '../../../../hooks/useToggle';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/Iconify';
import InvoicePDF from './InvoicePDF';
import { orderPropTypes } from '../../../../constant';

// ----------------------------------------------------------------------

InvoiceToolbar.propTypes = {
  invoice: orderPropTypes().isRequired,
};

export default function InvoiceToolbar({ invoice }) {
  const navigate = useNavigate();

  const { toggle: open, onOpen, onClose } = useToggle();

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.saleAndMarketing.edit(invoice.id));
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="flex-start"
        alignItems={{ sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignSelf: 'flex-end' }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton onClick={handleEdit}>
              <Iconify icon={'eva:edit-fill'} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xem file PDF báo giá">
            <IconButton onClick={onOpen}>
              <Iconify icon={'eva:eye-fill'} />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} />}
            fileName={invoice.invoiceNumber}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Tải báo giá">
                <IconButton>
                  {loading ? <CircularProgress size={24} color="inherit" /> : <Iconify icon={'eva:download-fill'} />}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <Tooltip title="In">
            <IconButton>
              <Iconify icon={'eva:printer-fill'} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chia sẻ">
            <IconButton>
              <Iconify icon={'eva:share-fill'} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Dialog fullScreen open={open}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Đóng">
              <IconButton color="inherit" onClick={onClose}>
                <Iconify icon={'eva:close-fill'} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF invoice={invoice} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
