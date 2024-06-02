// noinspection JSUnresolvedReference

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Button, CircularProgress, Dialog, DialogActions, IconButton, Portal, Tooltip } from '@mui/material';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { forwardRef } from 'react';
import Iconify from '../../../../../components/Iconify';
import useToggle from '../../../../../hooks/useToggle';
import useResponsive from '../../../../../hooks/useResponsive';
import DeliveryOrderPDF from '../../details/deliver-order/DeliveryOrderPDF';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  right: 10,
  zIndex: 9,
  top: 10,
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  alignItems: 'center',
  boxShadow: theme.customShadows.z20,
  padding: theme.spacing(1.5, 3, 1.5, 2),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('lg')]: {
    top: 40,
    right: 5,
    padding: theme.spacing(1.5, 1.5, 1.5, 2),
  },
  [theme.breakpoints.down('sm')]: {
    top: 115,
    right: 1,
    padding: theme.spacing(1.5, 1.5, 1.5, 2),
  },
}));

const PdfActionButton = forwardRef(({ children, size = 'small', title, ...other }, ref) => (
  <Tooltip title={title}>
    <Button size={size} ref={ref} {...other}>
      {children}
    </Button>
  </Tooltip>
));

PdfActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

// ----------------------------------------------------------------------

PdfAction.propTypes = {
  sx: PropTypes.object,
  formMethod: PropTypes.object.isRequired,
};

export default function PdfAction({ sx, formMethod, ...other }) {
  const isDesktop = useResponsive('up', 'lg');
  const { toggle: openPreviewPdf, onOpen: onOpenPreviewPdf, onClose: onClosePreviewPdf } = useToggle();

  const style = isDesktop ? {} : { mt: 2 };
  return (
    <Portal>
      <StyledRoot sx={sx} {...other}>
        <>
          <PdfActionButton
            title="Xem lệnh xuất hàng"
            size="small"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon="material-symbols:data-check-rounded" />}
            onClick={onOpenPreviewPdf}
            sx={{ mr: 1, fontSize: '0.75rem', ...style }}
          >
            {isDesktop ? 'Xem File' : ''}
          </PdfActionButton>

          <PDFDownloadLink document={<DeliveryOrderPDF formMethod={formMethod} deliveryOrder={formMethod} />}>
            {({ loading }) => (
              <PdfActionButton
                title="Tải lệnh xuất hàng"
                variant="contained"
                size="small"
                color="warning"
                startIcon={
                  loading ? <CircularProgress size={12} color="info" /> : <Iconify icon={'carbon:generate-pdf'} />
                }
                sx={{ mr: 1, fontSize: '0.75rem', ...style }}
              >
                {isDesktop ? 'Tải File' : ''}
              </PdfActionButton>
            )}
          </PDFDownloadLink>
        </>
      </StyledRoot>
      <Dialog fullScreen open={openPreviewPdf}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
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
              <DeliveryOrderPDF formMethod={formMethod} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Portal>
  );
}
