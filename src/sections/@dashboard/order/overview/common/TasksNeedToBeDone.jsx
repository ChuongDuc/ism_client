// noinspection JSUnresolvedFunction,JSValidateTypes

import PropTypes from 'prop-types';
import { Card, CardHeader } from '@mui/material';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Tooltip from '@mui/material/Tooltip';
import IconLocalShipping from '@mui/icons-material/LocalShipping';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ModeIcon from '@mui/icons-material/Mode';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DoneIcon from '@mui/icons-material/Done';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useEffect, useState } from 'react';
import useResponsive from '../../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const DELIVERY_TASKS = ['Tạo mới', 'Báo giá - CSKH', 'Chốt đơn - Tạo lệnh xuất hàng', 'Đang giao hàng'];

// ----------------------------------------------------------------------
const handleActiveDeliveryStep = (order, currentStatus) => {
  if (order?.status === 'creatNew') {
    return 0;
  }
  if (order?.status === 'priceQuotation') {
    return 1;
  }
  if (order?.status === 'createExportOrder') {
    return 2;
  }
  if (order?.status === 'delivery') {
    return 3;
  }
  if (order?.status === 'successDelivery') {
    return 4;
  }
  if ((order?.status === 'paymentConfirmation' || order?.status === 'paid') && order?.deliverOrderList.length < 1) {
    return 1;
  }
  if (
    (order?.status === 'paymentConfirmation' || order?.status === 'paid') &&
    order?.deliverOrderList.length > 0 &&
    currentStatus === 'giao hang thanh cong'
  ) {
    return 4;
  }
  if (
    (order?.status === 'paymentConfirmation' || order?.status === 'paid') &&
    order?.deliverOrderList.length > 0 &&
    currentStatus !== 'giao hang thanh cong'
  ) {
    return 3;
  }
  if (order?.status === 'done') {
    return 4;
  }
  return -1;
};

// ----------------------------------------------------------------------
TasksNeedToBeDone.propTypes = {
  order: PropTypes.object.isRequired,
  listStatus: PropTypes.any,
};

export default function TasksNeedToBeDone({ order, listStatus }) {
  const [currentStatus, setCurrentStatus] = useState([]);
  useEffect(() => {
    if (listStatus) {
      setCurrentStatus(listStatus.filter((status) => status.fromStatus === 'Giao hàng thành công'));
    }
  }, [listStatus]);
  const isDesktop = useResponsive('up', 'sm');
  return (
    <>
      <Card>
        <CardHeader sx={{ mb: 3 }} title="Thông tin vận chuyển" />
        <Stepper
          sx={{ mb: 3 }}
          alternativeLabel
          activeStep={handleActiveDeliveryStep(order, currentStatus)}
          connector={<ColorlibConnector />}
        >
          {DELIVERY_TASKS.map((label, index) => (
            <Step key={label}>
              {!isDesktop ? (
                <Tooltip title={label}>
                  <StepLabel StepIconComponent={ColorlibDeliveryStepIcon} icon={index + 1} />
                </Tooltip>
              ) : (
                <StepLabel StepIconComponent={ColorlibDeliveryStepIcon}>{label}</StepLabel>
              )}
            </Step>
          ))}
        </Stepper>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

// -------------------------------------------------------------
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: !ownerState.isDesktop ? 34 : 48,
  height: !ownerState.isDesktop ? 34 : 48,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));
// ------------------------------------------------------------------------------------------
function ColorlibDeliveryStepIcon(props) {
  const { active, completed, className } = props;
  const isDesktop = useResponsive('up', 'sm');

  const icons = {
    1: <ModeIcon />,
    2: <SupportAgentIcon />,
    3: <PostAddIcon />,
    4: <IconLocalShipping />,
    5: <DoneIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, isDesktop }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibDeliveryStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};
