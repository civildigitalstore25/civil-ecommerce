import express from "express";
import { authenticate, requireAdmin } from "../middlewares/auth";
import {
  createEnquiry,
  getAllEnquiries,
  getUserEnquiries,
  getEnquiry,
  replyToEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController";

const router = express.Router();

// Admin routes - specific paths first
router.get("/", authenticate, requireAdmin, getAllEnquiries);
router.post("/:id/reply", authenticate, requireAdmin, replyToEnquiry);
router.patch("/:id/status", authenticate, requireAdmin, updateEnquiryStatus);
router.delete("/:id", authenticate, requireAdmin, deleteEnquiry);

// User routes - specific paths before parametric routes
router.post("/", authenticate, createEnquiry);
router.get("/my-enquiries", authenticate, getUserEnquiries);
router.get("/:id", authenticate, getEnquiry); // This must be last

export default router;
