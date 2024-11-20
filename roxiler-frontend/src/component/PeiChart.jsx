import React, { useState, useEffect } from 'react';
import Api from '../axiosConfigue';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({month},) => {
  const [categoryStats, setCategoryStats] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryStatistics = async () => {
      setLoading(true);
      try {
        const { data } = await Api.get('/getbasicdata/get-category-stats', {
          params: { month },
        });
        setCategoryStats(data); 
      } catch (error) {
        console.error('Error fetching category statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStatistics();
  }, [month]);

  const data = {
    labels: categoryStats.map((item) => item.category),  
    datasets: [
      {
        label: 'Items per Category',
        data: categoryStats.map((item) => item.count), 
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33B8', '#FFC300', '#8E44AD'],  // Custom colors for each segment
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Items by Category for ${month}`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} items`;
          },
        },
      },
    },
  };

  return (
    <div style={{width:"500px"}}>
      <h2>Category Statistics for {month}</h2>
      {loading ? (
        <p>Loading chart...</p>
      ) : categoryStats.length === 0 ? (
        <p>No data available for the selected month.</p>
      ) : (
        <Pie data={data} options={options} />
      )}
    </div>
  );
};

export default PieChart;
