import { Request, Response } from "express";
import BillingAddress from "../models/BillingAddress";

// Get user's saved billing addresses (latest 3)
export const getBillingAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get the latest 3 billing addresses for the user
    const addresses = await BillingAddress.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Get billing addresses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch billing addresses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Save new billing address
export const saveBillingAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, email, whatsapp, countryCode } = req.body;

    // Validate required fields
    if (!name || !email || !whatsapp) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and WhatsApp number are required",
      });
    }

    // Check if this exact address already exists
    const existingAddress = await BillingAddress.findOne({
      userId,
      name,
      email,
      whatsapp,
      countryCode: countryCode || "+91",
    });

    if (existingAddress) {
      // Update the timestamp to make it the most recent
      existingAddress.updatedAt = new Date();
      await existingAddress.save();

      return res.status(200).json({
        success: true,
        message: "Billing address updated",
        data: existingAddress,
      });
    }

    // Get current count of addresses for this user
    const addressCount = await BillingAddress.countDocuments({ userId });

    // If user has 3 or more addresses, delete the oldest one
    if (addressCount >= 3) {
      const oldestAddress = await BillingAddress.findOne({ userId })
        .sort({ createdAt: 1 })
        .select("_id");

      if (oldestAddress) {
        await BillingAddress.findByIdAndDelete(oldestAddress._id);
      }
    }

    // Create new billing address
    const newAddress = await BillingAddress.create({
      userId,
      name,
      email,
      whatsapp,
      countryCode: countryCode || "+91",
    });

    return res.status(201).json({
      success: true,
      message: "Billing address saved successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("Save billing address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save billing address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a billing address
export const deleteBillingAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find and delete the address, ensuring it belongs to the user
    const address = await BillingAddress.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Billing address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Billing address deleted successfully",
    });
  } catch (error) {
    console.error("Delete billing address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete billing address",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
