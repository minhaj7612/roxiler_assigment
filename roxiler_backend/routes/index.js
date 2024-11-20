import { Router } from "express";
import SeedData from "./seeddata.js";

const router = Router();
        
router.use("/getbasicdata",SeedData);

export default router;