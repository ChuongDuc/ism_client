import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Button, Card, CardHeader, MenuItem, Stack, TextField, Typography } from '@mui/material';
//
import { Icon } from '@iconify/react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { BaseOptionChart } from '../../../../components/chart';
import useAuth from '../../../../hooks/useAuth';
import { getDatesOfWeek } from '../../../../utils/utilities';
import { fDate, fDateToDay, fddMMYYYYWithSlash } from '../../../../utils/formatTime';
import { fNumber } from '../../../../utils/formatNumber';
import useSettings from '../../../../hooks/useSettings';
import { Role } from '../../../../constant';

// ----------------------------------------------------------------------
const SALES_REPORT_BY_WEEK = loader('../../../../graphql/queries/user/salesReportRevenueByWeek.graphql');
const GET_ALL_SALES = loader('../../../../graphql/queries/user/getAllUsers.graphql');
// ----------------------------------------------------------------------

export default function AnalyticsSingleSalesRevenueByWeek() {
  const { user } = useAuth();
  const { themeMode } = useSettings();
  const isLight = themeMode === 'light';
  const currentDate = new Date();
  const date = currentDate.getDate();
  const day = currentDate.getDay();
  const currentWeekOfMonth = Math.ceil((date - 1 - day) / 7 + 1);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [start, setStart] = useState(getDatesOfWeek(currentWeekOfMonth, currentMonth, currentYear)[0]);
  const [end, setEnd] = useState(getDatesOfWeek(currentWeekOfMonth, currentMonth, currentYear)[6]);
  const [count, setCount] = useState(currentWeekOfMonth);
  const [labelDays, setLabelDays] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);

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

  const { data: salesReportByWeek } = useQuery(SALES_REPORT_BY_WEEK, {
    variables: {
      input: {
        saleId: user.role !== Role.sales ? selectedSaleId : Number(user.id),
        startAt: fDate(start),
        endAt: fDate(end),
      },
    },
  });

  useEffect(() => {
    if (salesReportByWeek) {
      setTotalRevenue(salesReportByWeek.salesReportRevenueByWeek?.map((e) => e?.totalRevenue));
      setLabelDays(salesReportByWeek.salesReportRevenueByWeek?.map((e) => fddMMYYYYWithSlash(e?.date)));
    }
  }, [salesReportByWeek]);

  useEffect(() => {
    setChartDataOptions([
      {
        name: selectedSaleFullName,
        type: 'column',
        data: totalRevenue,
      },
    ]);
  }, [totalRevenue, selectedSaleFullName]);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '14%' } },
    chart: {
      foreColor: isLight ? '#000' : '#fff',
    },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: labelDays,
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
    setCount(count + 1);
  };
  const subWeek = () => {
    setCount(count - 1);
  };

  const handleFilter = (event) => {
    setFilterSales(event.target.value);
  };

  const handleGetSaleId = (id, name) => {
    setSelectedSaleId(id);
    setSelectedSaleFullName(name);
  };

  useEffect(() => {
    setStart(getDatesOfWeek(count, currentMonth, currentYear)[0]);
    setEnd(getDatesOfWeek(count, currentMonth, currentYear)[6]);
  }, [count, currentMonth, currentYear]);

  return (
    <Card>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ py: 2.5, px: 1.5, justifyContent: 'space-between' }}
      >
        <CardHeader title="Biều đồ doanh thu hàng tuần" sx={{ mt: -3 }} />

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
            {`Từ Ngày ${fDateToDay(start)} - ${fddMMYYYYWithSlash(end)}`}
          </Typography>
          <Button
            variant="text"
            disabled={
              getDatesOfWeek(count, currentMonth, currentYear)[0] >=
                getDatesOfWeek(currentWeekOfMonth, currentMonth, currentYear)[0] ||
              getDatesOfWeek(count, currentMonth, currentYear)[6] >=
                getDatesOfWeek(currentWeekOfMonth, currentMonth, currentYear)[6]
            }
            onClick={addWeek}
            endIcon={<Icon icon="carbon:next-filled" />}
          />
        </Stack>
      </Stack>

      <Box sx={{ pb: 1.25 }} dir="ltr">
        <ReactApexChart type="line" series={chartDataOptions} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
