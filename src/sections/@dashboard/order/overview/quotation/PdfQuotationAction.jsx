// noinspection JSUnresolvedReference

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Button, CircularProgress, Dialog, DialogActions, IconButton, Portal, Tooltip } from '@mui/material';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Iconify from '../../../../../components/Iconify';
import { Role } from '../../../../../constant';
import useAuth from '../../../../../hooks/useAuth';
import InvoicePDFTmp from '../../details/InvoicePDFTmp';
import useToggle from '../../../../../hooks/useToggle';
import useResponsive from '../../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  right: 24,
  zIndex: 9,
  top: 10,
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  alignItems: 'center',
  boxShadow: theme.customShadows.z20,
  padding: theme.spacing(1.5, 1, 1.5, 2),
  borderRadius: theme.shape.borderRadius,
  // backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('lg')]: {
    top: 70,
    right: 5,
    padding: theme.spacing(1.5, 1.5, 1.5, 2),
  },
  [theme.breakpoints.down('sm')]: {
    top: 175,
    right: 1,
    padding: theme.spacing(1.5, 1, 1.5, 2),
  },
}));

// ----------------------------------------------------------------------

PdfQuotationAction.propTypes = {
  sx: PropTypes.object,
  order: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDeniedEdit: PropTypes.func,
  isEdit: PropTypes.bool,
  formMethod: PropTypes.any,
  handlePaid: PropTypes.func,
  handleDeniedPaid: PropTypes.func,
  isPaid: PropTypes.bool,
};

export default function PdfQuotationAction({
  sx,
  order,
  handleEdit,
  isEdit,
  handleDeniedEdit,
  formMethod,
  handleDeniedPaid,
  handlePaid,
  isPaid,
  ...other
}) {
  const { user } = useAuth();
  const isDesktop = useResponsive('up', 'lg');
  const { toggle: openPreviewPdf, onOpen: onOpenPreviewPdf, onClose: onClosePreviewPdf } = useToggle();
  const style = isDesktop ? {} : { mt: 2 };
  return (
    <Portal>
      <StyledRoot sx={sx} {...other}>
        <>
          {(user.role === Role.accountant || (user.role === Role.sales && order?.sale?.id === Number(user?.id))) && (
            <>
              {isPaid ? (
                <Tooltip title="Hủy">
                  <Button
                    size="medium"
                    color="warning"
                    variant="contained"
                    startIcon={<Iconify icon="mdi:denied" />}
                    onClick={handleDeniedPaid}
                    sx={{ mr: 1, ...style }}
                  >
                    {isDesktop ? 'Hủy' : ''}
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Tạo thanh toán">
                  <Button
                    size="medium"
                    color="warning"
                    variant="contained"
                    onClick={() => {
                      handlePaid();
                      handleDeniedEdit();
                    }}
                    startIcon={<Iconify icon="ic:baseline-create" />}
                    sx={{ mr: 1 }}
                  >
                    {isDesktop ? 'Tạo thanh toán' : ''}
                  </Button>
                </Tooltip>
              )}
            </>
          )}

          {order?.sale?.id === Number(user?.id) && (
            <>
              {isEdit ? (
                <Tooltip title="Hủy">
                  <Button
                    size="medium"
                    color="warning"
                    variant="contained"
                    startIcon={<Iconify icon="mdi:clipboard-edit-outline" />}
                    onClick={handleDeniedEdit}
                    sx={{ mr: 1, ...style }}
                  >
                    {isDesktop ? 'Hủy' : ''}
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Sửa Báo Giá">
                  <Button
                    size="medium"
                    color="warning"
                    variant="contained"
                    startIcon={<Iconify icon="mdi:clipboard-edit-outline" />}
                    sx={{ mr: 1, ...style }}
                    onClick={() => {
                      handleEdit();
                      handleDeniedPaid();
                    }}
                  >
                    {isDesktop ? 'Sửa Báo Giá' : ''}
                  </Button>
                </Tooltip>
              )}
            </>
          )}
          <Tooltip title="Xem PDF">
            <Button
              size="medium"
              color="warning"
              variant="contained"
              startIcon={<Iconify icon="material-symbols:data-check-rounded" />}
              onClick={onOpenPreviewPdf}
              sx={{ mr: 1, fontSize: '0.75rem', ...style }}
            >
              {isDesktop ? 'Xem PDF' : ''}
            </Button>
          </Tooltip>

          <PDFDownloadLink
            document={<InvoicePDFTmp invoice={order} formMethod={formMethod} isEdit={isEdit} />}
            fileName={order.invoiceNo}
          >
            {({ loading }) => (
              <Tooltip title="Tải Báo Giá">
                <Button
                  size="medium"
                  color="warning"
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={12} color="info" /> : <Iconify icon={'carbon:generate-pdf'} />
                  }
                  sx={{ mr: 1, fontSize: '0.75rem', ...style }}
                >
                  {isDesktop ? 'Tải Báo Giá' : ''}
                </Button>
              </Tooltip>
            )}
          </PDFDownloadLink>
        </>
      </StyledRoot>
      <Dialog fullScreen open={openPreviewPdf}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '1px !important',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Đóng">
              <IconButton color="inherit" onClick={onClosePreviewPdf}>
                <Iconify icon={'eva:close-fill'} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%">
              <InvoicePDFTmp invoice={order} formMethod={formMethod} isEdit={isEdit} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Portal>
  );
}
