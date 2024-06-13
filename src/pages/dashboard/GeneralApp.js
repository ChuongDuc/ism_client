import { Box, Container, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Page from '../../components/Page';
import { Role } from '../../constant';
import Iconify from '../../components/Iconify';
import GeneralCommon from '../../sections/@dashboard/general/GeneralCommon';
import GeneralReport from '../../sections/@dashboard/general/GeneralReport';
// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'notification',
    label: 'Thông báo',
    icon: <Iconify icon="clarity:notification-solid-badged" />,
    component: <GeneralCommon />,
  },
  {
    value: 'report',
    label: 'Báo cáo',
    icon: <Iconify icon="mdi:report-line-shimmer" />,
    component: <GeneralReport />,
  },
];

export default function GeneralApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('notification');

  return (
    <Page title="Thông tin tổng hợp">
      <Container maxWidth={false}>
        {user.role === Role.admin ||
        user.role === Role.director ||
        user.role === Role.sales ||
        user.role === Role.accountant ? (
          <>
            <>
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{
                  px: 2.5,
                  mb: 1,
                }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                ))}
              </Tabs>
            </>

            {TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>)}
          </>
        ) : (
          <>
            <>
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{
                  px: 2.5,
                  mb: 1,
                }}
              >
                <Tab key={TABS[0].value} value={TABS[0].value} icon={TABS[0].icon} label={TABS[0].label} />
              </Tabs>
            </>

            {TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>)}
          </>
        )}
      </Container>
    </Page>
  );
}
