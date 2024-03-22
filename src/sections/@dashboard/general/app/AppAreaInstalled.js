// noinspection DuplicatedCode

import merge from 'lodash/merge';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';
import { randomNumberRange } from '../../../../_mock/funcs';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 2021,
    data: [
      {
        name: 'Doanh thu',
        data: [
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
        ],
      },
      // { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
    ],
  },
  {
    year: 2022,
    data: [
      {
        name: 'Doanh thu',
        data: [
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
          randomNumberRange(20986500000, 32986500000),
        ],
      },
      // { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
    ],
  },
];

export default function AppAreaInstalled() {
  const [seriesData, setSeriesData] = useState(2021);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: [
        'Tháng 01',
        'Tháng 02',
        'Tháng 03',
        'Tháng 04',
        'Tháng 05',
        'Tháng 06',
        'Tháng 07',
        'Tháng 08',
        'Tháng 09',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
    },
  });

  return (
    <Card>
      <CardHeader
        title="Báo cáo doanh thu theo năm"
        subheader="Tăng (+3,5%) so với năm ngoái"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
