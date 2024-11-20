import {Router} from "express";
import {seedDatabase,listTransactions,
    getCategoryStatistics,getStatistics,
    getPriceRangeStatistics,getCombinedData} from "../controller/seeddata.cntrller.js"

const router = Router();

router.get("/basic-data",seedDatabase);
router.get("/get-month",listTransactions)
router.get("/get-statics",getStatistics)
router.get("/get-price-range",getPriceRangeStatistics)
router.get("/get-category-stats",getCategoryStatistics)
router.get("/combined-data",getCombinedData)


export default router;