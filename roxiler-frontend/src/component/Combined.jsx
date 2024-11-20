// src/CombinedData.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Api from "../axiosConfigue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CombinedData = ({ month }) => {
  const [combinedData, setCombinedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (month) {
      fetchCombinedData();
    }
  }, [month]);

  const fetchCombinedData = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get("getbasicdata/combined-data", {
        params: { month },
      });
      setCombinedData(data);
    } catch (error) {
      console.error("Error fetching combined data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="combined-data">
      <h1>Combined Data for {month}</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : !combinedData ? (
        <p>Select a month to view the data.</p>
      ) : (
        <div style={{ display: "flex" }}>
          <div style={{ marginBottom: "40px", width: "400px" }}>
            <h2>Price Range Statistics</h2>
            {combinedData.priceRangeStatistics &&
            combinedData.priceRangeStatistics.length > 0 ? (
              <Bar
                data={{
                  labels: combinedData.priceRangeStatistics.map(
                    (item) => item.priceRange
                  ),
                  datasets: [
                    {
                      label: "Number of Items",
                      data: combinedData.priceRangeStatistics.map(
                        (item) => item.count
                      ),
                      backgroundColor: "#42A5F5",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `Items in Price Ranges for ${month}`,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.raw} items`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <p>No price range data available.</p>
            )}
          </div>

          {/* Pie Chart for Category Statistics */}
          <div style={{ marginBottom: "40px", width: "400px" }}>
            <h2>Category Statistics</h2>
            {combinedData.categoryStatistics &&
            combinedData.categoryStatistics.length > 0 ? (
              <Pie
                data={{
                  labels: combinedData.categoryStatistics.map(
                    (item) => item.category
                  ),
                  datasets: [
                    {
                      label: "Items per Category",
                      data: combinedData.categoryStatistics.map(
                        (item) => item.count
                      ),
                      backgroundColor: [
                        "#FF5733",
                        "#33FF57",
                        "#3357FF",
                        "#FF33B8",
                        "#FFC300",
                        "#8E44AD",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `Items by Category for ${month}`,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.raw} items`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <p>No category statistics available.</p>
            )}
          </div>

          {/* Total Sold Items, Not Sold Items, and Total Sale Amount */}
          <div style={{ marginBottom: "40px" }}>
            <h2>Sales Summary</h2>
            <p>
              Total Sold Items: {combinedData.transactions.totalSoldItems || 0}
            </p>
            <p>
              Total Not Sold Items:{" "}
              {combinedData.transactions.totalNotSoldItems || 0}
            </p>
            <p>
              Total Sale Amount: $
              {combinedData.transactions.totalSaleAmount
                ? combinedData.transactions.totalSaleAmount.toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedData;
