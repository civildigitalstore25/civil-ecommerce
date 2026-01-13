import { Request, Response } from "express";
import Enquiry from "../models/Enquiry";
import Product from "../models/Product";
import User from "../models/User";

// Create a new enquiry
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    let productName, productImage;
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        productName = product.name;
        productImage = product.image;
      }
    }

    const enquiry = new Enquiry({
      user: userId,
      product: productId || undefined,
      productName,
      productImage,
      subject,
      message,
      status: "pending",
    });

    await enquiry.save();

    // Populate user details
    await enquiry.populate("user", "fullName email");

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all enquiries (Admin only)
export const getAllEnquiries = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const enquiries = await Enquiry.find(query)
      .populate("user", "fullName email")
      .populate("product", "name image")
      .populate("repliedBy", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enquiry.countDocuments(query);

    // Get status counts
    const statusCounts = await Enquiry.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      pending: 0,
      replied: 0,
      closed: 0,
    };

    statusCounts.forEach((item) => {
      stats[item._id as keyof typeof stats] = item.count;
    });

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user's enquiries
export const getUserEnquiries = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const enquiries = await Enquiry.find({ user: userId })
      .populate("product", "name image")
      .populate("repliedBy", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enquiry.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get single enquiry
export const getEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const enquiry = await Enquiry.findById(id)
      .populate("user", "fullName email")
      .populate("product", "name image price")
      .populate("repliedBy", "fullName");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Check if user is authorized to view this enquiry
    const isAdmin = userRole === "admin" || userRole === "superadmin";
    if (!isAdmin && enquiry.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this enquiry",
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Reply to enquiry (Admin only)
export const replyToEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const adminId = (req as any).user.id;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    enquiry.adminReply = reply;
    enquiry.status = "replied";
    enquiry.repliedBy = adminId;
    enquiry.repliedAt = new Date();

    await enquiry.save();

    await enquiry.populate([
      { path: "user", select: "fullName email" },
      { path: "product", select: "name image" },
      { path: "repliedBy", select: "fullName" },
    ]);

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error replying to enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update enquiry status (Admin only)
export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "replied", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "fullName email")
      .populate("product", "name image")
      .populate("repliedBy", "fullName");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete enquiry (Admin only)
export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
