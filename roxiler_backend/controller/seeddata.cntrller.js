import axios from 'axios';
import Product from '../model/model.js';

// API to initialize the database with seed data from a third-party API

export const seedDatabase = async (req, res) => {
    try {
      // Fetch data from the third-party API
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const products = response.data;
  
      await Product.deleteMany();
  
      await Product.insertMany(products);
  
      res.status(200).json({ message: 'Database seeded successfully!',products });
    } catch (error) {
      res.status(500).json({ message: 'Error seeding the database', error });
    }
  };


export const listTransactions = async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 10 } = req.query;

    const searchQuery = {
      $and: [],
    };

    // Handling here search query
    if (search) {
      searchQuery.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });

      if (!isNaN(search)) {
        searchQuery.$and.push({
          price: { $eq: parseFloat(search) },
        });
      }
    }

    // Handling here month filter if it's provided
    if (month) {
      const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1; // Get month number from string (1 for January)
      searchQuery.$and.push({
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      });
    }

    // handling Pagination logic
    const transactions = await Product.find(searchQuery)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json(transactions);
  } catch (error) {
      return res.json({ message: 'Error fetching transactions', error });
  }
};




export const getStatistics = async (req, res) => {
    try {
      const { month } = req.query;
  

      const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
  
    
      const query = {
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      };
  
      // Calculating total sale amount
      const totalSaleAmount = await Product.aggregate([
        { $match: query },
        { $group: { _id: null, totalAmount: { $sum: "$price" } } },
      ]);
  
     
      const totalSoldItems = await Product.countDocuments({
        ...query,
        sold: true,
      });
  
      // Calculate total not sold items
      const totalNotSoldItems = await Product.countDocuments({
        ...query,
        sold: false,
      });
  
      res.status(200).json({
        totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].totalAmount : 0,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
 return res.json({ message: 'Error fetching transactions', error });
    }
  };
  

 export const getPriceRangeStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    // Define the price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }, 
    ];

    const stats = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.countDocuments({
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
          price: { $gte: range.min, $lte: range.max },
        });
        return {
          priceRange: `${range.min} - ${range.max === Infinity ? 'Above 900' : range.max}`,
          count,
        };
      })
    );

    res.status(200).json(stats);
  } catch (error) {
    return res.json({ message: 'Error fetching price range statistics', error })
  }
};


export const getCategoryStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    const categories = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },  // Match the month
        },
      },
      {
        $group: {
          _id: "$category",  
          count: { $sum: 1 },  
        },
      },
      {
        $project: {
          category: "$_id",  
          count: 1,
          _id: 0,  
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    return res.json({ message: 'Error fetching category statistics', error });
    
  }
};


export const getCombinedData = async (req, res) => {
  let { month } = req.query;

  if (!month) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    month = `${currentYear}-${currentMonth}`;
  }

  try {
    const [priceRangeResponse, categoryStatsResponse, transactionsResponse] = await Promise.all([
      axios.get('http://localhost:9001/api/v1/getbasicdata/get-price-range', { params: { month } }),
      axios.get('http://localhost:9001/api/v1/getbasicdata/get-category-stats', { params: { month } }),
      axios.get('http://localhost:9001/api/v1/getbasicdata/get-statics', { params: { month } })
    ]);

    // Extract data from each response
    const priceRangeData = priceRangeResponse.data;
    const categoryStatsData = categoryStatsResponse.data;
    const transactionsData = transactionsResponse.data;

    const combinedData = {
      priceRangeStatistics: priceRangeData,
      categoryStatistics: categoryStatsData,
      transactions: transactionsData
    };
     return  res.json(combinedData);

  } catch (error) {
    console.error('Error fetching combined data:', error);
     return res.json({ error: 'Failed to fetch combined data' });
  }
};






















