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

// User routes
router.post("/", authenticate, createEnquiry);
router.get("/my-enquiries", authenticate, getUserEnquiries);
router.get("/:id", authenticate, getEnquiry);

// Admin routes
router.get("/", authenticate, requireAdmin, getAllEnquiries);
router.post("/:id/reply", authenticate, requireAdmin, replyToEnquiry);
router.patch("/:id/status", authenticate, requireAdmin, updateEnquiryStatus);
router.delete("/:id", authenticate, requireAdmin, deleteEnquiry);

export default router;
