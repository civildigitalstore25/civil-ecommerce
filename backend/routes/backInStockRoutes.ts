import express from "express";
import { subscribeBackInStock } from "../controllers/backInStockController";

const router = express.Router();

router.post("/subscribe", subscribeBackInStock);

export default router;
