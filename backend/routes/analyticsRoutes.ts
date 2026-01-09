import express from "express";
import {
  getSalesAnalytics,
  downloadSalesExcel,
  downloadSalesPDF,
} from "../controllers/analyticsController";
import { authenticate, requireAdmin } from "../middlewares/auth";

const router = express.Router();

// Sales analytics endpoint - protected and admin only
router.get("/sales", authenticate, requireAdmin, getSalesAnalytics);

// Download endpoints
router.get("/sales/download/excel", authenticate, requireAdmin, downloadSalesExcel);
router.get("/sales/download/pdf", authenticate, requireAdmin, downloadSalesPDF);

export default router;
