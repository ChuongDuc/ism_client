import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import {
  AppAreaInstalled,
  AppNewInvoice,
  AppTopAuthors,
  AppWelcome,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';
import { Role } from '../../constant';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppWelcome displayName={user?.displayName} />
          </Grid>

          {user.role === Role.director && (
            <>
              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Doanh thu tuần này"
                  percent={2.6}
                  total={2876500000}
                  chartColor={theme.palette.primary.main}
                  chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Doanh thu tháng này"
                  percent={0.2}
                  total={20986500000}
                  chartColor={theme.palette.chart.blue[0]}
                  chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="Doanh thu quý này"
                  percent={3.5}
                  total={60986500000}
                  chartColor={theme.palette.primary.main}
                  chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice />
          </Grid>

          <Grid item xs={12} lg={4}>
            <AppTopAuthors />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
