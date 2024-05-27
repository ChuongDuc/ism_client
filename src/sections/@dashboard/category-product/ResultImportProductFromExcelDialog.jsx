import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

// ----------------------------------------------------------------------
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  // '& .MuiDialog-paper': {
  //     backgroundColor: theme.palette.grey[200]
  // },
}));
// ----------------------------------------------------------------------
ResultImportProductFromExcelDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  errorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  addNewMessage: PropTypes.string.isRequired,
  updateMessage: PropTypes.string.isRequired,
};

export default function ResultImportProductFromExcelDialog({
  open,
  onClose,
  errorMessages,
  addNewMessage,
  updateMessage,
}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <BootstrapDialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle sx={{ my: 2, py: 2, px: 2 }} id="customized-dialog-title">
        {addNewMessage}
        <br />
        {updateMessage}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 4,
          color: (theme) => theme.palette.grey[700],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      <DialogContent>
        {errorMessages.length < 1 && (
          <DialogContentText id="alert-dialog-description">Không có dữ liệu lỗi!</DialogContentText>
        )}
        {errorMessages.length >= 1 &&
          errorMessages.map((eMessage, idx) => (
            <DialogContentText color="error.main" fontWeight={'bold'} key={idx} id="alert-dialog-description">
              {`${eMessage}`}
            </DialogContentText>
          ))}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ m: 0, p: 1 }}>
        <Button autoFocus onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
