/*import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const StockChart = ({ historicalData }) => {
  const data = {
    labels: historicalData.map(data => data.timestamp.toLocaleDateString()), // Convert dates to string labels
    datasets: [
      {
        label: 'Stock Price',
        data: historicalData.map(data => data.price),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={data} />;
};

export default StockChart;
*/