import { Request, Response } from "express";
import BackInStockAlert from "../models/BackInStockAlert";
import Product from "../models/Product";
import emailService from "../services/emailService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribeBackInStock = async (req: Request, res: Response) => {
  try {
    const { productId, name, email } = req.body as {
      productId?: string;
      name?: string;
      email?: string;
    };

    if (!productId || !name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product, name, and email are required.",
      });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (!product.isOutOfStock) {
      return res.status(400).json({
        success: false,
        message: "This product is currently in stock.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const productSlug =
      typeof product.slug === "string" && product.slug.trim()
        ? product.slug.trim()
        : undefined;

    const existing = await BackInStockAlert.findOne({
      product: productId,
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message:
          "You are already on the list. We will email you when this product is back in stock.",
      });
    }

    const alert = await BackInStockAlert.create({
      product: productId,
      productName: product.name,
      productSlug,
      name: name.trim(),
      email: normalizedEmail,
    });

    const productUrl = productSlug
      ? `${process.env.FRONTEND_URL || "https://softzcart.com"}/product/${productSlug}`
      : `${process.env.FRONTEND_URL || "https://softzcart.com"}/products`;

    try {
      await emailService.sendBackInStockAdminNotification({
        name: alert.name,
        email: alert.email,
        productName: alert.productName,
        productUrl,
      });
      await emailService.sendBackInStockConfirmation({
        to: alert.email,
        name: alert.name,
        productName: alert.productName,
        productUrl,
      });
    } catch (emailError) {
      console.error("Back-in-stock email failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      message:
        "Thank you! We will email you as soon as this product is back in stock.",
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message:
          "You are already on the list. We will email you when this product is back in stock.",
      });
    }

    console.error("Back-in-stock subscribe error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not save your request. Please try again later.",
    });
  }
};
