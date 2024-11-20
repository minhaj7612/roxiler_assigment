import React, { useState, useEffect } from 'react';
import Api from '../axiosConfigue';


const Statistics = ({statistics,setStatistics,month}) => {

const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get('/getbasicdata/get-statics',{
        params: { month },
      });
      setStatistics(data); 
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchStatistics();
}, [month]); 

  return (
    <div className='salesTop'>
     <h1 className='salesR'> Total Sales Report for {month} </h1>  
      {loading ? (
        <p className='Sales_para'>Loading statistics...</p>
      ) : statistics ? (
        <div>
          <p className='Sales_para'>Total Sale Amount: ${statistics.totalSaleAmount}</p>
          <p className='Sales_para'>Total Sold Items: {statistics.totalSoldItems}</p>
          <p className='Sales_para'>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      ) : (
        <p className='Sales_para'> No data available for the selected month.</p>
      )}
    </div>
  );
};

export default Statistics;
