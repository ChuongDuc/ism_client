import PropTypes from 'prop-types';
import { ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import { fVietNamCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

PaymentItem.propTypes = {
  payment: PropTypes.object,
};

export default function PaymentItem({ payment }) {
  const { description, money, updatedAt } = payment;
  return (
    <>
      <ListItem disableGutters>
        <ListItemAvatar>
          <Iconify icon="circum:money-check-1" color="#1877F2" width={32} height={32} />
        </ListItemAvatar>

        <ListItemText
          primary={money ? fVietNamCurrency(Number(money)) : '0'}
          secondary={
            <Tooltip title={description}>
              <span>{`Thời gian: ${updatedAt ? fddMMYYYYWithSlash(updatedAt) : ''}`}</span>
            </Tooltip>
          }
          primaryTypographyProps={{ noWrap: true, typography: 'subtitle1' }}
          secondaryTypographyProps={{ noWrap: true, typography: 'caption' }}
          sx={{ flexGrow: 1, pr: 1 }}
        />
      </ListItem>
    </>
  );
}
