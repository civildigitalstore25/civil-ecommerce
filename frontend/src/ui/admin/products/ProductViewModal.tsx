import React, { useState } from "react";
import {
  X,
  Package,
  Building2,
  DollarSign,
  Calendar,
  Star,
  Award,
  Play,
  CheckCircle,
  Circle,
  Tag,
  CreditCard,
  HelpCircle,
  Monitor,
  Zap,
} from "lucide-react";
import type { ProductViewModalProps } from "./types/ProductViewModal";
import FormButton from "../../../components/Button/FormButton";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import "./AddProductModal.css";

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { colors } = useAdminTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const allImages = [
    product.imageUrl || product.image,
    ...(product.additionalImages || []),
  ].filter(Boolean);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderHTMLContent = (htmlContent?: string) => {
    if (!htmlContent)
      return (
        <p style={{ color: colors.text.secondary }}>No content available</p>
      );
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose max-w-none"
        style={{ color: colors.text.secondary }}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div
          className="sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-xl z-10 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderBottomColor: colors.border.primary,
          }}
        >
          <div className="flex items-center space-x-3">
            <h2
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Product Details
            </h2>
            {product.isBestSeller && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: colors.text.inverse,
                }}
              >
                <Award className="w-4 h-4 mr-1" />
                Best Seller
              </span>
            )}
            {product.status && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor:
                    product.status === "active"
                      ? colors.status.success
                      : product.status === "inactive"
                        ? colors.status.error
                        : colors.status.warning,
                  color: colors.text.inverse,
                }}
              >
                {product.status === "active" && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {product.status === "inactive" && (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {product.status === "draft" && (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = colors.text.primary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = colors.text.secondary)
            }
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Header Section with Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="aspect-square rounded-lg overflow-hidden"
                style={{ backgroundColor: colors.background.tertiary }}
              >
                <img
                  src={
                    allImages[selectedImageIndex] ||
                    product.imageUrl ||
                    product.image
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? "border-yellow-500"
                          : "border-gray-600"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Product Info */}
            <div className="space-y-6">
              <div>
                <h3
                  className="text-3xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-lg mt-1"
                  style={{ color: colors.text.secondary }}
                >
                  Version {product.version}
                </p>
                {product.shortDescription && (
                  <p className="mt-2" style={{ color: colors.text.secondary }}>
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Rating and Tags */}
              {(product.rating ||
                (product.tags && product.tags.length > 0)) && (
                <div className="space-y-3">
                  {product.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5"
                            style={{
                              color:
                                star <= product.rating!
                                  ? colors.interactive.primary
                                  : colors.text.secondary,
                              fill:
                                star <= product.rating!
                                  ? colors.interactive.primary
                                  : "none",
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ color: colors.text.secondary }}>
                        {product.rating}
                      </span>
                      {product.ratingCount && (
                        <span style={{ color: colors.text.secondary }}>
                          ({product.ratingCount} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: colors.background.tertiary,
                            color: colors.text.primary,
                          }}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Brand/Company Info */}
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: colors.background.tertiary }}
              >
                <h4
                  className="text-lg font-semibold mb-3 flex items-center"
                  style={{ color: colors.text.primary }}
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Brand & Category
                </h4>
                <div className="space-y-2">
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Brand:
                    </span>
                    <span
                      className="ml-2"
                      style={{ color: colors.text.primary }}
                    >
                      {product.brand || product.company}
                    </span>
                  </div>
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Category:
                    </span>
                    <span
                      className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: colors.interactive.primary,
                        color: colors.text.inverse,
                      }}
                    >
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          {(product.videoUrl || product.activationVideoUrl) && (
            <div
              className="rounded-lg p-6 mb-8"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <h3
                className="text-xl font-semibold mb-4 flex items-center"
                style={{ color: colors.text.primary }}
              >
                <Play className="w-6 h-6 mr-2" />
                Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.videoUrl && (
                  <div>
                    <h4
                      className="font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Product Demo
                    </h4>
                    <div
                      className="aspect-video rounded-lg overflow-hidden"
                      style={{ backgroundColor: colors.background.primary }}
                    >
                      <iframe
                        src={product.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title="Product Demo"
                      />
                    </div>
                  </div>
                )}
                {product.activationVideoUrl && (
                  <div>
                    <h4
                      className="font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Activation Guide
                    </h4>
                    <div
                      className="aspect-video rounded-lg overflow-hidden"
                      style={{ backgroundColor: colors.background.primary }}
                    >
                      <iframe
                        src={product.activationVideoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title="Activation Guide"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rich Text Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Description */}
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <h3
                className="text-xl font-semibold mb-4 flex items-center"
                style={{ color: colors.text.primary }}
              >
                <Package className="w-6 h-6 mr-2" />
                Description
              </h3>
              {renderHTMLContent(product.description)}
            </div>

            {/* Overall Features */}
            {product.overallFeatures && (
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: colors.background.tertiary }}
              >
                <h3
                  className="text-xl font-semibold mb-4 flex items-center"
                  style={{ color: colors.text.primary }}
                >
                  <Zap className="w-6 h-6 mr-2" />
                  Features
                </h3>
                {renderHTMLContent(product.overallFeatures)}
              </div>
            )}

            {/* Requirements */}
            {product.requirements && (
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: colors.background.tertiary }}
              >
                <h3
                  className="text-xl font-semibold mb-4 flex items-center"
                  style={{ color: colors.text.primary }}
                >
                  <Monitor className="w-6 h-6 mr-2" />
                  System Requirements
                </h3>
                {renderHTMLContent(product.requirements)}
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div
            className="rounded-lg p-6 mb-8"
            style={{ backgroundColor: colors.background.tertiary }}
          >
            <h3
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: colors.text.primary }}
            >
              <DollarSign className="w-6 h-6 mr-2" />
              Pricing Plans
            </h3>

            {/* Subscription Plans */}
            {product.subscriptionDurations &&
              product.subscriptionDurations.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-lg font-medium mb-3 flex items-center"
                    style={{ color: colors.text.primary }}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Subscription Plans
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.subscriptionDurations.map((sub, index) => (
                      <div
                        key={index}
                        className="rounded-lg p-4 border"
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary,
                        }}
                      >
                        <div className="text-center">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            ₹{sub.price?.toLocaleString()}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {sub.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Legacy Pricing (backward compatibility) */}
            {(!product.subscriptionDurations ||
              product.subscriptionDurations.length === 0) && (
              <div className="mb-6">
                <h4
                  className="text-lg font-medium mb-3"
                  style={{ color: colors.text.primary }}
                >
                  License Plans
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.price1 && (
                    <div
                      className="rounded-lg p-4 border"
                      style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          ₹{product.price1.toLocaleString()}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          1-Year License
                        </div>
                        {product.oldPrice1 && (
                          <div
                            className="text-sm line-through"
                            style={{ color: colors.text.secondary }}
                          >
                            ₹{product.oldPrice1.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {product.price3 && (
                    <div
                      className="rounded-lg p-4 border"
                      style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          ₹{product.price3.toLocaleString()}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          3-Year License
                        </div>
                        {product.oldPrice3 && (
                          <div
                            className="text-sm line-through"
                            style={{ color: colors.text.secondary }}
                          >
                            ₹{product.oldPrice3.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {product.priceLifetime && (
                    <div
                      className="rounded-lg p-4 border"
                      style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          ₹{product.priceLifetime.toLocaleString()}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          Lifetime License
                        </div>
                        {product.oldPriceLifetime && (
                          <div
                            className="text-sm line-through"
                            style={{ color: colors.text.secondary }}
                          >
                            ₹{product.oldPriceLifetime.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Pricing */}
            {(product.hasLifetime || product.hasMembership) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.hasLifetime && product.lifetimePrice && (
                  <div className="bg-green-600 rounded-lg p-4 border border-green-500">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        ₹{product.lifetimePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-100">
                        Lifetime Access
                      </div>
                    </div>
                  </div>
                )}
                {product.hasMembership && product.membershipPrice && (
                  <div className="bg-purple-600 rounded-lg p-4 border border-purple-500">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        ₹{product.membershipPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-100">Membership</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FAQs Section */}
          {product.faqs && product.faqs.length > 0 && (
            <div
              className="rounded-lg p-6 mb-8 transition-colors duration-200"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <h3
                className="text-xl font-semibold mb-4 flex items-center"
                style={{ color: colors.text.primary }}
              >
                <HelpCircle
                  className="w-6 h-6 mr-2"
                  style={{ color: colors.interactive.primary }}
                />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {product.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-4 border transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <h4
                      className="font-medium mb-2"
                      style={{ color: colors.text.primary }}
                    >
                      {faq.question}
                    </h4>
                    <p style={{ color: colors.text.secondary }}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div
            className="rounded-lg p-6 transition-colors duration-200"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <h3
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: colors.text.primary }}
            >
              <Calendar
                className="w-6 h-6 mr-2"
                style={{ color: colors.interactive.primary }}
              />
              Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Created At
                </span>
                <p style={{ color: colors.text.primary }}>
                  {formatDate(product.createdAt)}
                </p>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Updated At
                </span>
                <p style={{ color: colors.text.primary }}>
                  {formatDate(product.updatedAt)}
                </p>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Product ID
                </span>
                <p
                  className="font-mono text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  style={{ color: colors.text.primary }}
                >
                  {product._id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="sticky bottom-0 border-t px-6 py-4 flex justify-end transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          <FormButton type="button" variant="primary" onClick={onClose}>
            Close
          </FormButton>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
