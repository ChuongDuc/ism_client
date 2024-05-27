import { Container, Dialog, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CategoryProductNewEditForm from './CategoryProductNewEditForm';

CreateCategory.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default function CreateCategory({ open, onClose }) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Container maxWidth={'md'} sx={{ my: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
          Tạo danh mục sản phẩm
        </Typography>
        <CategoryProductNewEditForm onClose={onClose} />
      </Container>
    </Dialog>
  );
}
