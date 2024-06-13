import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Button, Card, CardHeader, MenuItem, Stack, TextField, Typography } from '@mui/material';
//
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { BaseOptionChart } from '../../../../components/chart';
import useAuth from '../../../../hooks/useAuth';
import useSettings from '../../../../hooks/useSettings';
import { fNumber } from '../../../../utils/formatNumber';
import { Role } from '../../../../constant';

// ----------------------------------------------------------------------
const SALES_REPORT_BY_YEAR = loader('../../../../graphql/queries/user/salesReportRevenueByYear.graphql');
const GET_ALL_SALES = loader('../../../../graphql/queries/user/getAllUsers.graphql');
// ----------------------------------------------------------------------

export default function AnalyticsSingleSaleRevenue() {
  const { themeMode } = useSettings();
  const isLight = themeMode === 'light';
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const [labelYears, setLabelYears] = useState([]);

  const [chartData, setChartData] = useState([]);

  const { data: getAllSales } = useQuery(GET_ALL_SALES, {
    variables: {
      input: {
        role: Role.sales,
      },
    },
  });
  const [listSales, setListSales] = useState([]);
  const [filterSales, setFilterSales] = useState('');
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [selectedSaleFullName, setSelectedSaleFullName] = useState(null);
  const [chartDataOptions, setChartDataOptions] = useState([]);

  useEffect(() => {
    if (getAllSales) {
      setListSales(getAllSales?.users?.edges.map((user) => user.node));
    }
  }, [getAllSales]);

  const { data: salesReportByYear } = useQuery(SALES_REPORT_BY_YEAR, {
    variables: {
      input: {
        saleId: user.role !== Role.sales ? selectedSaleId : Number(user.id),
        startAt: new Date(year, 0, 1),
        endAt: new Date(year, 11, 31),
      },
    },
  });

  useEffect(() => {
    if (salesReportByYear) {
      setChartData(salesReportByYear.salesReportRevenueByYear?.map((e) => e?.totalRevenue));
      setLabelYears(salesReportByYear.salesReportRevenueByYear?.map((e) => `${e?.month + 1}/${year}`));
    }
  }, [salesReportByYear, year]);

  useEffect(() => {
    setChartDataOptions([
      {
        name: selectedSaleFullName,
        type: 'column',
        data: chartData,
      },
    ]);
  }, [selectedSaleFullName, chartData]);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '14%' } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    xaxis: {
      categories: labelYears,
    },
    chart: {
      foreColor: isLight ? '#000' : '#fff',
    },
    yaxis: {
      labels: {
        formatter: (seriesName) => `${fNumber(seriesName)}`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (seriesName) => `${fNumber(seriesName)} VND`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
  });

  const addWeek = () => {
    setYear(year + 1);
  };
  const subWeek = () => {
    setYear(year - 1);
  };

  const handleFilter = (event) => {
    setFilterSales(event.target.value);
  };

  const handleGetSaleId = (id, name) => {
    setSelectedSaleId(id);
    setSelectedSaleFullName(name);
  };

  return (
    <Card>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ py: 2.5, px: 1.5, justifyContent: 'space-between' }}
      >
        <CardHeader title="Biều đồ doanh thu hàng tháng" sx={{ mt: -3 }} />
        {(user.role === Role.admin || user.role === Role.director) && (
          <TextField
            fullWidth
            size="small"
            label="NV bán hàng"
            value={filterSales}
            onChange={handleFilter}
            select
            SelectProps={{
              MenuProps: {
                sx: { '& .MuiPaper-root': { maxHeight: 260 } },
              },
            }}
            sx={{
              maxWidth: { sm: 240 },
              textTransform: 'capitalize',
            }}
          >
            <MenuItem value="" defaultValue onClick={() => handleGetSaleId(null, null)} />
            {listSales?.map((option) => (
              <MenuItem
                key={option.id}
                value={option.fullName}
                onClick={() => handleGetSaleId(option.id, option.fullName)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                <>{option.fullName}</>
              </MenuItem>
            ))}
          </TextField>
        )}
        <Stack direction="row" spacing={3}>
          <Button variant="text" onClick={subWeek} startIcon={<Icon icon="carbon:previous-filled" />} />
          <Typography justifyContent="center" alignSelf="center" alignItems="center" variant="h6">
            {`Năm ${year}`}
          </Typography>
          <Button
            variant="text"
            disabled={year >= currentYear}
            onClick={addWeek}
            startIcon={<Icon icon="carbon:next-filled" />}
          />
        </Stack>
      </Stack>

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartDataOptions} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
