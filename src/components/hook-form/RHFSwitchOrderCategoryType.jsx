// noinspection RequiredAttributes,JSValidateTypes

import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slide,
  Stack,
} from '@mui/material';
import { forwardRef } from 'react';
import { ITEM_GROUP } from '../../constant';
import useToggle from '../../hooks/useToggle';
import { useDispatch } from '../../redux/store';
import { resetCart } from '../../redux/slices/product';

// ----------------------------------------------------------------------
const RHFSwitchOrderCategoryTypeTransition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
// ----------------------------------------------------------------------

RHFSwitchOrderCategoryType.propTypes = {
  typeOfCategory: PropTypes.string.isRequired,
  setTypeOfCategory: PropTypes.func.isRequired,
  handleSetIsMultiCate: PropTypes.func.isRequired,
};

// Component này phải đc đặt trong FormProvider
export default function RHFSwitchOrderCategoryType({
  handleSetIsMultiCate,
  typeOfCategory = ITEM_GROUP.single,
  setTypeOfCategory,
}) {
  const { toggle: openConfirmDialog, onOpen: onOpenConfirmDialog, onClose: onCloseConfirmDialog } = useToggle();
  const { reset } = useFormContext();
  const dispatch = useDispatch();

  // const [typeOfCategory, setTypeOfCategory] = useState(ITEM_GROUP.single);
  const handleCancelChangeRadio = () => {
    // Nếu cancel thì trả lại giá trị radio ban đầu
    if (typeOfCategory === ITEM_GROUP.single) {
      setTypeOfCategory(ITEM_GROUP.multiple);
    } else {
      setTypeOfCategory(ITEM_GROUP.single);
    }
    onCloseConfirmDialog();
  };
  const handleOnChangeRadio = (event) => {
    setTypeOfCategory(event?.target?.value);
    onOpenConfirmDialog();
  };

  const handleConfirmChangeRadio = () => {
    reset();
    dispatch(resetCart());
    if (typeOfCategory === ITEM_GROUP.single) {
      handleSetIsMultiCate(false);
    } else {
      handleSetIsMultiCate(true);
    }
    onCloseConfirmDialog();
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" minWidth="50%">
        <RadioGroup row defaultValue={typeOfCategory} value={typeOfCategory} onChange={handleOnChangeRadio}>
          <FormControlLabel value={ITEM_GROUP.single} control={<Radio size="small" />} label="Một hạng mục" />
          <FormControlLabel value={ITEM_GROUP.multiple} control={<Radio size="small" />} label="Nhiều hạng mục" />
        </RadioGroup>
      </Stack>
      <Dialog
        open={openConfirmDialog}
        TransitionComponent={RHFSwitchOrderCategoryTypeTransition}
        keepMounted
        onClose={handleCancelChangeRadio}
      >
        <DialogTitle>{`Xác nhận chuyển`}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Dữ liệu hiện tại sẽ bị xóa sau khi chuyển loại báo giá
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleCancelChangeRadio}>
            Hủy
          </Button>

          <Button variant="contained" onClick={handleConfirmChangeRadio}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
