import React, { useState, useEffect } from 'react';
import Api from '../axiosConfigue';
import Static from "./Static"
import BarChart from './BarChart';
import PieChart from './PeiChart';
import "./Main.css"
import CombinedData from './Combined';

const TransactionTable = () => {

  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("March");
  const [perPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await Api.get("/getbasicdata/get-month", {
          params: { month, page, perPage, search }
        });
        setTransactions(data);  // Update transactions with the response data
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [month, page, search, perPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };



  return (
    <div className='main'>
      <h2>Transactions for {month}</h2>
      
      {/* Search Box */}
      <input 
        type="text" 
        placeholder="Search by title, description, or price"
        value={search}
        onChange={handleSearchChange}
      />
      
      {/* Month Dropdown */}
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>

      {/* Transaction Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
            <td colSpan="6">Loading...</td></tr>
          ) : transactions.length === 0 ? (
            <tr><td colSpan="6">No transactions found</td></tr>
          ) : (
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>${transaction.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage}>
          Next
        </button>
      </div>

      <Static month={month} setStatistics={setStatistics} statistics={statistics} />
      <div style={{display:"flex",justifyContent:"center"}}>
      <BarChart month={month}/>
      <PieChart month={month}/>
      </div>
      <CombinedData month={month}/>
    </div>
  );
};

export default TransactionTable;




