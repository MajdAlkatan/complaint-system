import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './ApexChart.css';

const ApexChart = () => {
  const [state] = useState({
    series: [{
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100]
    }],
    options: {
      colors: ['#76AE54'],
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM yyyy' // Format for month/year
        },
        categories: [
          "2018-01-01T00:00:00.000Z",
          "2018-02-01T00:00:00.000Z",
          "2018-03-01T00:00:00.000Z",
          "2018-04-01T00:00:00.000Z",
          "2018-05-01T00:00:00.000Z",
          "2018-06-01T00:00:00.000Z",
          "2018-07-01T00:00:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: 'MMM yyyy', // Format tooltip accordingly
        },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default ApexChart;



//API response example 

// {
//   "series": [
//     {
//       "name": "series1", (optional)
//       "data": [31, 40, 28, 51, 42, 109, 100]
//     }
//   ],
//   "categories": [
//     "2018-01-01T00:00:00.000Z",
//     "2018-02-01T00:00:00.000Z",
//     "2018-03-01T00:00:00.000Z",
//     "2018-04-01T00:00:00.000Z",
//     "2018-05-01T00:00:00.000Z",
//     "2018-06-01T00:00:00.000Z",
//     "2018-07-01T00:00:00.000Z"
//   ]
// }