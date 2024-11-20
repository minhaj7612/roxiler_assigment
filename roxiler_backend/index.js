import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AllRoutes from "./routes/index.js"
import cors from "cors"
import morgan from "morgan";
const app = express();
app.use(morgan("combined"))
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);


dotenv.config();

app.get("/", function (req, res) {
  res.send("working");
});

app.use("/api/v1",AllRoutes);

mongoose.connect(process.env.MONGODB_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB connect");
});

app.listen(process.env.portNum, () => {
  console.log(`server is running on port ${process.env.portNum}`);
});
