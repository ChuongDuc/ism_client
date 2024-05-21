import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { Role, roleTypeToVietnameseRoleName } from '../../../../constant';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
UserTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onResetPassword: PropTypes.func,
  onResetAccount: PropTypes.func,
  status: PropTypes.string,
};

export default function UserTableRow({
  status,
  row,
  selected,
  onEditRow,
  idx,
  onSelectRow,
  onDeleteRow,
  onResetPassword,
  onResetAccount,
}) {
  const theme = useTheme();
  const { fullName, avatarURL, role, isActive, userName, phoneNumber } = row;
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { user } = useAuth();
  return (
    <TableRow hover selected={selected}>
      {status !== 'Ngừng hoạt động' && (user?.role === Role.admin || user?.role === Role.director) && (
        <TableCell padding="checkbox">
          <Checkbox disabled={isActive === false} size="small" checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}
      <TableCell align="left">{idx + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={fullName} src={avatarURL} sx={{ mr: 2, width: 30, height: 30 }} />
        <Typography variant="subtitle2" noWrap>
          {fullName}
        </Typography>
      </TableCell>

      <TableCell align="left">{userName.toLowerCase()}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {phoneNumber}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {roleTypeToVietnameseRoleName(role)}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(isActive === false && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {(isActive === true && 'Đang hoạt động') || 'Ngừng hoạt động'}
        </Label>
      </TableCell>

      <TableCell align="right">
        {user?.role === Role.admin || user?.role === Role.director ? (
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {row?.isActive === true && (
                  <MenuItem
                    onClick={() => {
                      onDeleteRow();
                      handleCloseMenu();
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Iconify icon="bxs:lock" />
                    Khóa tài khoản
                  </MenuItem>
                )}
                {row?.isActive === false && (
                  <MenuItem
                    onClick={() => {
                      onResetAccount();
                      handleCloseMenu();
                    }}
                    sx={{ color: '#1877F2' }}
                  >
                    <Iconify icon={'system-uicons:reset'} />
                    Khôi phục
                  </MenuItem>
                )}
                <MenuItem
                  sx={{ minWidth: 170 }}
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Sửa thông tin
                </MenuItem>

                <MenuItem
                  sx={{ minWidth: 170 }}
                  onClick={() => {
                    onResetPassword();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'material-symbols:lock-reset-rounded'} /> Cài lại mật khẩu
                </MenuItem>
              </>
            }
          />
        ) : null}
      </TableCell>
    </TableRow>
  );
}
