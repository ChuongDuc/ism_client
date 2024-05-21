import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { handleNumberInputChange } from '../../utils/utilities';

// ----------------------------------------------------------------------

RHFNumberField.propTypes = {
  name: PropTypes.string,
  setValue: PropTypes.func,
};

export default function RHFNumberField({ name, setValue, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          size="small"
          onChange={(event) => setValue(`${name}`, handleNumberInputChange(event.target.value))}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
