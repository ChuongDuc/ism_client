import PropTypes from 'prop-types';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { handleNumberInputChangeToCurrency } from '../../utils/utilities';

// ----------------------------------------------------------------------

RHFCurrencyField.propTypes = {
  name: PropTypes.string,
  setValue: PropTypes.func,
  value: PropTypes.any,
};

export default function RHFCurrencyField({ name, setValue, value, ...other }) {
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
          value={value}
          onChange={(event) => {
            setValue(`${name}`, handleNumberInputChangeToCurrency(event.target.value));
          }}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
