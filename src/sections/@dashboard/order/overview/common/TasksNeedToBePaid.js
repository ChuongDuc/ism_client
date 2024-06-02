// noinspection JSUnresolvedFunction,JSValidateTypes

import PropTypes from 'prop-types';
import { Card, CardHeader } from '@mui/material';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Tooltip from '@mui/material/Tooltip';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ModeIcon from '@mui/icons-material/Mode';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import useResponsive from '../../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const PAID_TASKS = ['Tạo mới', 'Báo giá - CSKH', 'Đang xác nhận thanh toán', 'Đơn hàng hoàn thành'];

// ----------------------------------------------------------------------
const handleActivePaidStep = (order) => {
  if (order?.status === 'creatNew') {
    return 0;
  }
  if (order?.status === 'priceQuotation') {
    return 1;
  }

  if (order?.status === 'createExportOrder' && order?.paymentList.length < 1) {
    return 1;
  }
  if ((order?.status === 'delivery' || order?.status === 'successDelivery') && order?.paymentList.length < 1) {
    return 1;
  }
  if ((order?.status === 'delivery' || order?.status === 'successDelivery') && order?.paymentList.length > 0) {
    return 2;
  }
  if (order?.status === 'createExportOrder' && order?.paymentList.length > 0) {
    return 2;
  }
  if (order?.status === 'paymentConfirmation') {
    return 2;
  }
  if (order?.status === 'paid') {
    return 2;
  }
  if (order?.status === 'done') {
    return 3;
  }

  return -1;
};

// ----------------------------------------------------------------------
TasksNeedToBePaid.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function TasksNeedToBePaid({ order }) {
  const isDesktop = useResponsive('up', 'sm');
  return (
    <>
      <Card>
        <CardHeader sx={{ mb: 3 }} title="Thông tin thanh toán" />
        <Stepper
          sx={{ mb: 3 }}
          alternativeLabel
          activeStep={handleActivePaidStep(order)}
          connector={<ColorlibConnector />}
        >
          {PAID_TASKS.map((label, index) => (
            <Step key={label}>
              {!isDesktop ? (
                <Tooltip title={label}>
                  <StepLabel StepIconComponent={ColorlibPaidStepIcon} icon={index + 1} />
                </Tooltip>
              ) : (
                <StepLabel StepIconComponent={ColorlibPaidStepIcon}>{label}</StepLabel>
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
function ColorlibPaidStepIcon(props) {
  const { active, completed, className } = props;
  const isDesktop = useResponsive('up', 'sm');

  const icons = {
    1: <ModeIcon />,
    2: <SupportAgentIcon />,
    3: <PostAddIcon />,
    4: <PriceCheckIcon />,
    5: <DoneAllIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, isDesktop }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibPaidStepIcon.propTypes = {
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
