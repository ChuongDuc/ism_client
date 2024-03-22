// noinspection JSUnresolvedFunction,JSValidateTypes

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardHeader, Checkbox, Divider, FormControlLabel, IconButton, MenuItem, Stack } from '@mui/material';
import { orderPropTypes, Role, userPropTypes } from '../../../../../constant';
import Iconify from '../../../../../components/Iconify';
import MenuPopover from '../../../../../components/MenuPopover';

// ----------------------------------------------------------------------

const SALE_TASKS = ['Tạo báo giá', 'Chăm sóc khách hàng', 'Tạo hợp đồng', 'Chốt đơn', 'Tạo lệnh xuất hàng'];

const DRIVER_TASKS = ['Nhận lệnh xuất hàng', 'Đang giao hàng', 'Giao hàng thành công'];

const ACC_TASKS = [
  'Kiểm tra thông tin đơn hàng có hợp lệ không',
  'Xác nhận hình ảnh, giấy tờ giao hàng',
  'Xác nhận thanh toán',
];

// ----------------------------------------------------------------------
const checkOrderTaskPermission = (user, order, role) => {
  switch (role) {
    case Role.sales:
      return user?.role === Role.sales && order?.sale?.id && user?.id && order.sale.id === user.id;
    case Role.driver:
      return user?.role === Role.driver && order?.driver?.id && user?.id && order.driver.id === user.id;
    case Role.accountant:
      return user?.role === Role.accountant;
    default:
      return false;
  }
};
// ----------------------------------------------------------------------
TasksNeedToBeDone.propTypes = {
  order: orderPropTypes().isRequired,
  user: userPropTypes().isRequired,
};

export default function TasksNeedToBeDone({ order, user }) {
  const { control } = useForm({
    defaultValues: {
      saleTaskCompleted: [SALE_TASKS[0]],
      driverTaskCompleted: [DRIVER_TASKS[0]],
      accountantTaskCompleted: [ACC_TASKS[0]],
    },
  });

  return (
    <>
      <Card>
        <CardHeader title="Xác nhận của nhân viên kinh doanh" />

        <Controller
          name="saleTaskCompleted"
          control={control}
          render={({ field }) => {
            const onSelected = (saleTask) =>
              field.value.includes(saleTask)
                ? field.value.filter((value) => value !== saleTask)
                : [...field.value, saleTask];
            return (
              <>
                {SALE_TASKS.map((saleTask) => (
                  <TaskItem
                    key={saleTask}
                    task={saleTask}
                    checked={field.value.includes(saleTask)}
                    isPermission={checkOrderTaskPermission(user, order, Role.sales)}
                    onChange={() => field.onChange(onSelected(saleTask))}
                  />
                ))}
              </>
            );
          }}
        />
      </Card>

      <Card>
        <CardHeader title="Xác nhận của lái xe" />
        <Controller
          name="driverTaskCompleted"
          control={control}
          render={({ field }) => {
            const onSelected = (driverTask) =>
              field.value.includes(driverTask)
                ? field.value.filter((value) => value !== driverTask)
                : [...field.value, driverTask];

            return (
              <>
                {DRIVER_TASKS.map((driverTask) => (
                  <TaskItem
                    key={driverTask}
                    task={driverTask}
                    checked={field.value.includes(driverTask)}
                    isPermission={checkOrderTaskPermission(user, order, Role.driver)}
                    onChange={() => field.onChange(onSelected(driverTask))}
                  />
                ))}
              </>
            );
          }}
        />
      </Card>

      <Card>
        <CardHeader title="Xác nhận của kế toán" />
        <Controller
          name="accountantTaskCompleted"
          control={control}
          render={({ field }) => {
            const onSelected = (accountantTask) =>
              field.value.includes(accountantTask)
                ? field.value.filter((value) => value !== accountantTask)
                : [...field.value, accountantTask];

            return (
              <>
                {ACC_TASKS.map((accountantTask) => (
                  <TaskItem
                    key={accountantTask}
                    task={accountantTask}
                    checked={field.value.includes(accountantTask)}
                    isPermission={checkOrderTaskPermission(user, order, Role.accountant)}
                    onChange={() => field.onChange(onSelected(accountantTask))}
                  />
                ))}
              </>
            );
          }}
        />
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  task: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  isPermission: PropTypes.bool,
};

function TaskItem({ task, checked, onChange, isPermission = false }) {
  return (
    <Stack
      direction="row"
      sx={{
        px: 2,
        py: 0.75,
        ...(checked && {
          color: 'text.disabled',
          textDecoration: 'line-through',
        }),
      }}
    >
      <FormControlLabel
        control={
          isPermission ? <Checkbox checked={checked} onChange={onChange} /> : <Checkbox checked={checked} disabled />
        }
        label={task}
        sx={{ flexGrow: 1, m: 0 }}
      />
      {isPermission && <MoreMenuButton />}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 'auto',
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ ...ICON }} />
          Xác nhận hoàn thành
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
          Sửa
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Xóa
        </MenuItem>
      </MenuPopover>
    </>
  );
}
