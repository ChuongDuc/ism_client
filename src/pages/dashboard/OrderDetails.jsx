import { useParams } from 'react-router-dom';
import { Box, Card, Container, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { _orders } from '../../_mock';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import useTabs from '../../hooks/useTabs';
import PersonInChargeProfile from '../../sections/@dashboard/order/overview/PersonInChargeProfile';
import { Overview } from '../../sections/@dashboard/order/overview';
import { QuotationInfo } from '../../sections/@dashboard/order/overview/quotation';
import { SummaryDeliveryOrder } from '../../sections/@dashboard/order/overview/delivery-order';
import { Role } from '../../constant';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------
const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));
// ----------------------------------------------------------------------

const commonTabLabel = 'Thông tin chung';
const quotationTabLabel = 'Báo giá';
const deliveryOrderTabLabel = 'Lệnh xuất hàng';

const commonTab = (order) => ({
  value: 'common',
  label: commonTabLabel,
  icon: <Iconify icon={'clarity:details-solid'} width={20} height={20} />,
  component: <Overview order={order} />,
});

const quotationTab = (order) => ({
  value: 'quotation',
  label: quotationTabLabel,
  icon: <Iconify icon={'icon-park-outline:transaction-order'} width={20} height={20} />,
  component: <QuotationInfo order={order} />,
});
const deliveryOrderTab = (order) => ({
  value: 'deliveryOrder',
  label: deliveryOrderTabLabel,
  icon: <Iconify icon={'mdi:truck-delivery-outline'} width={20} height={20} />,
  component: <SummaryDeliveryOrder order={order} />,
});

const ORDER_INFO_TABS = (order, userRole) => {
  switch (userRole) {
    case Role.admin:
      return [commonTab(order), quotationTab(order), deliveryOrderTab(order)];
    case Role.manager:
      return [commonTab(order), quotationTab(order), deliveryOrderTab(order)];
    case Role.director:
      return [commonTab(order), quotationTab(order), deliveryOrderTab(order)];
    case Role.accountant:
      return [commonTab(order), quotationTab(order), deliveryOrderTab(order)];
    case Role.sales:
      return [commonTab(order), quotationTab(order), deliveryOrderTab(order)];
    case Role.driver:
      return [commonTab(order), deliveryOrderTab(order)];
    case Role.transporterManager:
      return [commonTab(order), deliveryOrderTab(order)];
    case Role.assistantDriver:
      return [commonTab(order), deliveryOrderTab(order)];
    default:
      return [];
  }
};
// ----------------------------------------------------------------------

export default function OrderDetails() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { currentTab, onChangeTab } = useTabs('common');

  const { id } = useParams();

  const order = _orders.find((order) => order.id === id);

  return (
    <Page title="Thông tin đơn hàng">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card
          sx={{
            mb: 3,
            height: 230,
            position: 'relative',
          }}
        >
          <PersonInChargeProfile sale={order.sale} />

          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {ORDER_INFO_TABS(order, user.role).map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {ORDER_INFO_TABS(order, user.role).map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
