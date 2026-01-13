import express from "express";
import {
  getBillingAddresses,
  saveBillingAddress,
  deleteBillingAddress,
} from "../controllers/billingAddressController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's saved billing addresses
router.get("/", getBillingAddresses);

// Save new billing address
router.post("/", saveBillingAddress);

// Delete a billing address
router.delete("/:addressId", deleteBillingAddress);

export default router;
