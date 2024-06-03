// noinspection DuplicatedCode,JSUnresolvedReference

import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Scrollbar from '../../../../components/Scrollbar';
import useAuth from '../../../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { Role } from '../../../../constant';
import { fDateTimeSuffix } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------
const NOTIFICATION = loader('../../../../graphql/queries/userNotification/listUserNotification.graphql');
const NOTIFICATION_UPDATE = loader(
  '../../../../graphql/mutations/userNotification/updateStatusUserNotification.graphql'
);
// ----------------------------------------------------------------------
CommonNotificationList.propTypes = {
  notificationList: PropTypes.array.isRequired,
  errorNotificationList: PropTypes.any,
  loadingNotificationList: PropTypes.bool.isRequired,
};
export default function CommonNotificationList({ notificationList, errorNotificationList, loadingNotificationList }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [update] = useMutation(NOTIFICATION_UPDATE, {
    refetchQueries: () => [
      {
        query: NOTIFICATION,
        variables: { variables: { input: { userId: Number(user.id) } } },
      },
    ],
    onError: (error) => {
      enqueueSnackbar(`error-${error.message}`, {
        variant: 'error',
      });
    },
  });

  const handleUpdate = async (id, isRead, orderId) => {
    await update({
      variables: { input: { userNotificationIds: Number(id), isRead } },
    });
    if (orderId) {
      navigate(PATH_DASHBOARD.saleAndMarketing.view(orderId), { replace: true });
    }
  };

  return (
    <Card>
      <CardHeader title="Thông báo mới nhất" />
      <CardContent>
        <Scrollbar sx={{ height: user.role === Role.accountant ? '70vh' : { xs: 340, sm: '75vh' } }}>
          {loadingNotificationList && (
            <Box
              display="flex"
              width={'100%'}
              height={user.role === Role.accountant ? '70vh' : { xs: 340, sm: '75vh' }}
            >
              <Box m="auto" sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            </Box>
          )}
          {errorNotificationList && <Typography variant="h6">Không lấy được danh sách thông báo</Typography>}

          {notificationList && notificationList.length > 0 && (
            <List disablePadding>
              {notificationList.map((notification) => (
                <NDetailItem
                  key={notification.notification.id}
                  notifications={notification}
                  onUpdate={() => handleUpdate(notification?.id, true, notification?.notification?.Order?.id)}
                />
              ))}
            </List>
          )}
        </Scrollbar>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

NDetailItem.propTypes = {
  notifications: PropTypes.shape({
    notification: PropTypes.object,
    isRead: PropTypes.bool,
    content: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onUpdate: PropTypes.func,
};

function NDetailItem({ notifications, onUpdate }) {
  const { notification, isRead, updatedAt } = notifications;
  const { avatar } = renderContent(notification);
  return (
    <>
      <ListItemButton
        sx={{
          py: 1.2,
          px: 2,
          mt: '1px',
          ...(!isRead && {
            bgcolor: 'action.selected',
          }),
        }}
        onClick={onUpdate}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'background.neutral', height: '24px', width: '24px' }}>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={notification?.content}
          secondary={`${fDateTimeSuffix(updatedAt)}`}
          secondaryTypographyProps={{ mt: 1 }}
        />
      </ListItemButton>
    </>
  );
}

// ----------------------------------------------------------------------
function renderContent(notification) {
  if (notification?.event === 'NewOrder') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_package.svg"
          style={{ height: '24px', width: '24px' }}
        />
      ),
    };
  }
  if (notification?.event === 'OrderStatusChanged') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_shipping.svg"
          style={{ height: '24px', width: '24px' }}
        />
      ),
    };
  }
  if (notification?.event === 'ProductUpdated') {
    return {
      avatar: (
        <img alt={notification.title} src="/static/icons/ic_dropbox.svg" style={{ height: '24px', width: '24px' }} />
      ),
    };
  }
  if (notification?.event === 'NewMessage') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_mail.svg"
          style={{ height: '24px', width: '24px' }}
        />
      ),
    };
  }
  return {
    avatar: (
      <img
        alt={notification.title}
        src="/static/icons/ic_notification_mail.svg"
        style={{ height: '24px', width: '24px' }}
      />
    ),
  };
}
