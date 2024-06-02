import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/lab';

// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
  name: PropTypes.string,
};

export default function RHFDatePicker({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DesktopDatePicker
          {...field}
          mask="__-__-____"
          inputFormat="dd-MM-yyyy"
          renderInput={(params) => (
            <TextField fullWidth {...params} margin="normal" error={!!error} helperText={error?.message} {...other} />
          )}
        />
      )}
    />
  );
}
