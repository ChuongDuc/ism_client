import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { styled, useTheme } from '@mui/material/styles';
import { Button, Card, CardHeader, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { fNumber } from '../../../../utils/formatNumber';
import { BaseOptionChart } from '../../../../components/chart';
import { fMonthYear, getDateNextNMonth } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------
const ADMIN_REPORT_BY_MONTH = loader('../../../../graphql/queries/user/adminReportRevenueByMonth.graphql');
// ----------------------------------------------------------------------

export default function AnalyticsCurrentVisits() {
  const theme = useTheme();
  const today = new Date();
  const [month, setMonth] = useState(today);
  const [chartData, setChartData] = useState([]);
  const [labelSales, setLabelSales] = useState([]);
  const [totalOrder, setTotalOrder] = useState([]);

  const { data: adminReportByMonth } = useQuery(ADMIN_REPORT_BY_MONTH, {
    variables: {
      input: {
        startAt: new Date(month.getFullYear(), month.getMonth(), 1),
        endAt: new Date(month.getFullYear(), month.getMonth() + 1, 1),
      },
    },
  });

  useEffect(() => {
    if (adminReportByMonth) {
      setChartData(adminReportByMonth.adminReportRevenueByMonth?.map((e) => e.totalRevenue));
      setLabelSales(adminReportByMonth.adminReportRevenueByMonth?.map((e) => e.sale));
      setTotalOrder(adminReportByMonth.adminReportRevenueByMonth?.map((e) => e.totalOrder));
    }
  }, [adminReportByMonth]);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.chart.blue[0],
      theme.palette.chart.violet[0],
      theme.palette.chart.yellow[0],
    ],
    labels: labelSales,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName, { seriesIndex }) =>
          `${fNumber(seriesName)} VND ( của ${totalOrder[seriesIndex]} đơn hàng)`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  const addWeek = () => {
    setMonth(getDateNextNMonth(month, 1));
  };
  const subWeek = () => {
    setMonth(getDateNextNMonth(month, -1));
  };

  return (
    <Card>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ pt: 2.5, px: 1.5, justifyContent: 'space-between' }}
      >
        <CardHeader title="Tổng hợp doanh thu" sx={{ mt: -3 }} />
        <Stack direction="row" spacing={3}>
          <Button variant="text" onClick={subWeek} startIcon={<Icon icon="carbon:previous-filled" />} />
          <Typography justifyContent="center" alignSelf="center" alignItems="center" variant="h6">
            {fMonthYear(month)}
          </Typography>
          <Button
            variant="text"
            onClick={addWeek}
            disabled={fMonthYear(month) === fMonthYear(today)}
            endIcon={<Icon icon="carbon:next-filled" />}
          />
        </Stack>
      </Stack>

      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={chartData} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
