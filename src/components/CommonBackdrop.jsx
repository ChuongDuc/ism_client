import PropTypes from 'prop-types';
import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

CommonBackdrop.propTypes = {
  loading: PropTypes.bool,
};
export default function CommonBackdrop({ loading }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [loading]);

  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
