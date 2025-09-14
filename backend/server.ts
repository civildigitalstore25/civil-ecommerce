import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running on Vercel 🚀");
});


mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });

export default app;
