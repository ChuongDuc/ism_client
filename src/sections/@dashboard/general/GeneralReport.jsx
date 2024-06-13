import { Grid } from '@mui/material';
import { AnalyticsCurrentVisits } from './analytics';
import AnalyticsSingleSalesRevenueByWeek from './analytics/AnalyticsSingleSalesRevenueByWeek';
import AnalyticsSingleSaleRevenue from './analytics/AnalyticsSingleSaleRevenue';

export default function GeneralReport() {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <AnalyticsCurrentVisits />
        </Grid>

        <Grid item xs={12}>
          <AnalyticsSingleSalesRevenueByWeek />
        </Grid>

        <Grid item xs={12}>
          <AnalyticsSingleSaleRevenue />
        </Grid>
      </Grid>
    </>
  );
}
