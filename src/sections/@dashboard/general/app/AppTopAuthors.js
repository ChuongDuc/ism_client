// noinspection JSValidateTypes

import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Avatar, Box, Card, CardHeader, Stack, Typography } from '@mui/material';
import { sampleSize } from 'lodash';
import Iconify from '../../../../components/Iconify';
import { salePropTypes, saleUserList } from '../../../../constant';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
}));

// ----------------------------------------------------------------------

export default function AppTopAuthors() {
  return (
    <Card>
      <CardHeader title="Top 3 nhân viên kinh doanh tháng" />
      <Stack spacing={3} sx={{ p: 3 }}>
        {sampleSize(saleUserList, 3).map((sale, index) => (
          <AuthorItem key={index} sale={sale} index={index} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

AuthorItem.propTypes = {
  sale: salePropTypes(),
  index: PropTypes.number,
};

function AuthorItem({ sale, index }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={sale?.displayName} src={sale?.photoURL} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{sale?.displayName}</Typography>
      </Box>

      <IconWrapperStyle
        sx={{
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
        }}
      >
        <Iconify icon={'ant-design:trophy-filled'} width={20} height={20} />
      </IconWrapperStyle>
    </Stack>
  );
}
