import React, { useState, useEffect } from 'react';
import Api from '../axiosConfigue';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({month}) => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPriceRangeStatistics = async () => {
      setLoading(true);
      try {
        const { data } = await Api.get('/getbasicdata/get-price-range', {
          params: { month },
        });
        setStatistics(data); 
      } catch (error) {
        console.error('Error fetching price range statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRangeStatistics();
  }, [month]);  

  const data = {
    labels: statistics.map((item) => item.priceRange),
    datasets: [
      {
        label: 'Number of Items',
        data: statistics.map((item) => item.count),  
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Items in Price Ranges for ${month}`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} items`;
          },
        },
      },
    },
  };

  return (
    <div style={{width:"500px"}}>
      <h2>Price Range Statistics for {month}</h2>

      {loading ? (
        <p>Loading chart...</p>
      ) : statistics.length === 0 ? (
        <p>No data available for the selected month.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default BarChart;
