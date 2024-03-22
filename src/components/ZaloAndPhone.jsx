// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

ZaloAndPhone.propTypes = {
  initialColor: PropTypes.bool,
  links: PropTypes.shape({
    zalo: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  simple: PropTypes.bool,
  sx: PropTypes.object,
};

export default function ZaloAndPhone({ initialColor = false, simple = true, links = {}, sx, ...other }) {
  const CONTACTS = [
    {
      name: 'Zalo',
      icon: 'simple-icons:zalo',
      socialColor: '#1877F2',
      path: links.zalo,
    },
    {
      name: 'Điện thoại',
      icon: 'ic:sharp-contact-phone',
      socialColor: '#E02D69',
      path: links.phoneNumber !== '' ? `tel:${links.phoneNumber}` : `tel:0983436161`,
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {CONTACTS.map((item) => {
        const { name, icon, path, socialColor } = item;
        return simple ? (
          <Link key={name} href={path}>
            <Tooltip title={name} placement="top">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: socialColor,
                    '&:hover': {
                      bgcolor: alpha(socialColor, 0.08),
                    },
                  }),
                  ...sx,
                }}
                {...other}
              >
                <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: socialColor,
                borderColor: socialColor,
                '&:hover': {
                  borderColor: socialColor,
                  bgcolor: alpha(socialColor, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        );
      })}
    </Stack>
  );
}
