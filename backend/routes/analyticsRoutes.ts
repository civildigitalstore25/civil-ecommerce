import express from "express";
import {
  getSalesAnalytics,
  downloadSalesExcel,
  downloadSalesPDF,
} from "../controllers/analyticsController";
import { authenticate, requireAdmin } from "../middlewares/auth";

const router = express.Router();

// Download endpoints - specific paths MUST come before general paths
router.get("/sales/download/excel", authenticate, requireAdmin, downloadSalesExcel);
router.get("/sales/download/pdf", authenticate, requireAdmin, downloadSalesPDF);

// Sales analytics endpoint - protected and admin only
router.get("/sales", authenticate, requireAdmin, getSalesAnalytics);

export default router;
