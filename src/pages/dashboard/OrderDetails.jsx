import { useParams } from 'react-router-dom';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import useTabs from '../../hooks/useTabs';
import { Overview } from '../../sections/@dashboard/order/overview';
import { QuotationInfo } from '../../sections/@dashboard/order/overview/quotation';
import { SummaryDeliveryOrder } from '../../sections/@dashboard/order/overview/delivery-order';
import { Role } from '../../constant';
import useAuth from '../../hooks/useAuth';
import RoleBasedGuard from '../../guards/RoleBasedGuard';
import { SkeletonMap } from '../../components/skeleton';
import CommonBackdrop from '../../components/CommonBackdrop';

// ----------------------------------------------------------------------

const ORDER_BY_ID = loader('../../graphql/queries/order/getOrderById.graphql');

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

const quotationTab = (order, refetchData) => ({
  value: 'quotation',
  label: quotationTabLabel,
  icon: <Iconify icon={'icon-park-outline:transaction-order'} width={20} height={20} />,
  component: <QuotationInfo order={order} refetchData={refetchData} />,
});

const deliveryOrderTab = (order, setCurrentTab) => ({
  value: 'deliveryOrder',
  label: deliveryOrderTabLabel,
  icon: <Iconify icon={'mdi:truck-delivery-outline'} width={20} height={20} />,
  component: <SummaryDeliveryOrder order={order} setCurrentTab={setCurrentTab} />,
});

const ORDER_INFO_TABS = (order, userRole, refetchData, setCurrentTab) => {
  switch (userRole) {
    case Role.admin:
      return [quotationTab(order, refetchData), deliveryOrderTab(order, setCurrentTab), commonTab(order)];
    case Role.manager:
      return [quotationTab(order, refetchData), deliveryOrderTab(order, setCurrentTab), commonTab(order)];
    case Role.director:
      return [quotationTab(order, refetchData), deliveryOrderTab(order, setCurrentTab), commonTab(order)];
    case Role.accountant:
      return [quotationTab(order, refetchData), deliveryOrderTab(order, setCurrentTab), commonTab(order)];
    case Role.sales:
      return [quotationTab(order, refetchData), deliveryOrderTab(order, setCurrentTab), commonTab(order)];
    case Role.driver:
      return [deliveryOrderTab(order, setCurrentTab)];
    case Role.transporterManager:
      return [deliveryOrderTab(order, setCurrentTab)];
    case Role.assistantDriver:
      return [deliveryOrderTab(order, setCurrentTab)];
    default:
      return [];
  }
};
// ----------------------------------------------------------------------

export default function OrderDetails() {
  const { user } = useAuth();

  const valueTab = user.role === Role.driver || user.role === Role.transporterManager ? 'deliveryOrder' : 'quotation';

  const { currentTab, onChangeTab, setCurrentTab } = useTabs(valueTab);

  const { id } = useParams();

  const [myOrder, setMyOrder] = useState(null);

  const [isOrderSale, setIsOrderSale] = useState(false);

  const { data, loading, error, refetch } = useQuery(ORDER_BY_ID, {
    variables: {
      orderId: Number(id),
    },
  });

  useEffect(() => {
    if (data) {
      setMyOrder(data?.getOrderById);
    }
  }, [data]);

  console.log(isOrderSale);

  useEffect(() => {
    if (myOrder?.sale?.id !== Number(user.id) && user.role === Role.sales) {
      setIsOrderSale(true);
    } else {
      setIsOrderSale(false);
    }
  }, [user, myOrder?.sale?.id]);

  const handleSetDefaultTab = () => {
    setCurrentTab('quotation');
  };

  return (
    <Page title="Thông tin đơn hàng">
      <RoleBasedGuard isOrderSale={isOrderSale}>
        <Container maxWidth={false}>
          {myOrder !== null && (
            <>
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={onChangeTab}
                sx={{ px: 1, mb: 2 }}
              >
                {ORDER_INFO_TABS(myOrder, user.role).map((tab) => (
                  <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                ))}
              </Tabs>

              {ORDER_INFO_TABS(myOrder, user.role, refetch, handleSetDefaultTab).map((tab) => {
                const isMatched = tab.value === currentTab;
                return isMatched && <Box key={tab.value}>{tab.component}</Box>;
              })}
            </>
          )}

          {loading && <SkeletonMap />}

          {error && (
            <Typography textAlign="center" variant="h4">
              Không tải được dữ liệu
            </Typography>
          )}

          <CommonBackdrop loading={loading} />
        </Container>
      </RoleBasedGuard>
    </Page>
  );
}
