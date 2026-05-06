import type { Dispatch, SetStateAction } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { ProductForm } from "../../../../constants/productFormConstants";
import { BRANDS, BRAND_CATEGORIES } from "../../../../constants/productFormConstants";
import { AddProductModalAdminSubscriptionsSection } from "./AddProductModalAdminSubscriptionsSection";
import { AddProductModalAutoSaveRow } from "./AddProductModalAutoSaveRow";
import { AddProductModalBasicSection } from "./AddProductModalBasicSection";
import { AddProductModalSeoSection } from "./AddProductModalSeoSection";
import { AddProductModalBrandCategorySection } from "./AddProductModalBrandCategorySection";
import { AddProductModalDealSection } from "./AddProductModalDealSection";
import { AddProductModalFaqSection } from "./AddProductModalFaqSection";
import { AddProductModalFreeProductSection } from "./AddProductModalFreeProductSection";
import { AddProductModalKeyFeaturesSection } from "./AddProductModalKeyFeaturesSection";
import { AddProductModalMediaSection } from "./AddProductModalMediaSection";
import { AddProductModalPricingSection } from "./AddProductModalPricingSection";
import { AddProductModalStrikethroughSection } from "./AddProductModalStrikethroughSection";
import { AddProductModalSystemRequirementsSection } from "./AddProductModalSystemRequirementsSection";
import type { AddProductFormHandlersApi } from "./useAddProductFormHandlers";

const brands = BRANDS;
const brandCategories = BRAND_CATEGORIES;

export type AddProductModalFormSectionsProps = {
  colors: ThemeColors;
  newProduct: ProductForm;
  setNewProduct: Dispatch<SetStateAction<ProductForm>>;
  lastSaved: Date | null;
} & AddProductFormHandlersApi;

export function AddProductModalFormSections({
  colors,
  newProduct,
  setNewProduct,
  lastSaved,
  handleInputChange,
  handleBrandChange,
  updateSubscriptionDuration,
  addSubscriptionDuration,
  removeSubscriptionDuration,
  updateImageField,
  addImageField,
  removeImageField,
  addFAQ,
  removeFAQ,
  updateFAQ,
  addFeature,
  removeFeature,
  updateFeature,
  addRequirement,
  removeRequirement,
  updateRequirement,
  updateSubscription,
  addSubscription,
  removeSubscription,
}: AddProductModalFormSectionsProps) {
  return (
    <div className="space-y-8">
      <AddProductModalSeoSection
        colors={colors}
        seoTitle={newProduct.seoTitle}
        seoDescription={newProduct.seoDescription}
        seoKeywords={newProduct.seoKeywords}
        onInputChange={handleInputChange}
      />

      <AddProductModalBasicSection
        colors={colors}
        name={newProduct.name}
        version={newProduct.version}
        longDescription={newProduct.longDescription}
        detailsDescription={newProduct.detailsDescription}
        onInputChange={handleInputChange}
      />

      <AddProductModalKeyFeaturesSection
        colors={colors}
        keyFeatures={newProduct.keyFeatures}
        onAdd={addFeature}
        onRemove={removeFeature}
        onUpdate={updateFeature}
      />

      <AddProductModalSystemRequirementsSection
        colors={colors}
        systemRequirements={newProduct.systemRequirements}
        onAdd={addRequirement}
        onRemove={removeRequirement}
        onUpdate={updateRequirement}
      />

      <AddProductModalBrandCategorySection
        colors={colors}
        brands={brands}
        brandCategories={brandCategories}
        brand={newProduct.brand}
        category={newProduct.category}
        status={newProduct.status}
        isBestSeller={newProduct.isBestSeller}
        isOutOfStock={newProduct.isOutOfStock}
        onBrandChange={handleBrandChange}
        onCategoryChange={(v) => handleInputChange("category", v)}
        onStatusChange={(v) => handleInputChange("status", v)}
        onBestSellerChange={(checked) =>
          setNewProduct((prev) => ({ ...prev, isBestSeller: checked }))
        }
        onOutOfStockChange={(checked) =>
          setNewProduct((prev) => ({ ...prev, isOutOfStock: checked }))
        }
      />

      <AddProductModalPricingSection
        colors={colors}
        brand={newProduct.brand}
        hasLifetime={newProduct.hasLifetime}
        lifetimePriceINR={newProduct.lifetimePriceINR}
        lifetimePriceUSD={newProduct.lifetimePriceUSD}
        hasMembership={newProduct.hasMembership}
        membershipPriceINR={newProduct.membershipPriceINR}
        membershipPriceUSD={newProduct.membershipPriceUSD}
        subscriptionDurations={newProduct.subscriptionDurations}
        onHasLifetimeChange={(checked) =>
          setNewProduct((prev) => ({ ...prev, hasLifetime: checked }))
        }
        onLifetimeInrChange={(v) => handleInputChange("lifetimePriceINR", v)}
        onLifetimeUsdChange={(v) => handleInputChange("lifetimePriceUSD", v)}
        onHasMembershipChange={(checked) =>
          setNewProduct((prev) => ({ ...prev, hasMembership: checked }))
        }
        onMembershipInrChange={(v) =>
          handleInputChange("membershipPriceINR", v)
        }
        onMembershipUsdChange={(v) =>
          handleInputChange("membershipPriceUSD", v)
        }
        onUpdateDuration={updateSubscriptionDuration}
        onRemoveDuration={removeSubscriptionDuration}
        onAddDuration={addSubscriptionDuration}
      />

      <AddProductModalStrikethroughSection
        colors={colors}
        strikethroughPriceINR={newProduct.strikethroughPriceINR}
        strikethroughPriceUSD={newProduct.strikethroughPriceUSD}
        onStrikethroughInrChange={(v) =>
          handleInputChange("strikethroughPriceINR", v)
        }
        onStrikethroughUsdChange={(v) =>
          handleInputChange("strikethroughPriceUSD", v)
        }
      />

      {newProduct.brand !== "ebook" && (
        <AddProductModalAdminSubscriptionsSection
          colors={colors}
          subscriptions={newProduct.subscriptions}
          onUpdate={updateSubscription}
          onRemove={removeSubscription}
          onAdd={addSubscription}
        />
      )}

      <AddProductModalDealSection
        colors={colors}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />

      <AddProductModalFreeProductSection
        colors={colors}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />

      <AddProductModalMediaSection
        colors={colors}
        imageUrl={newProduct.imageUrl}
        additionalImages={newProduct.additionalImages}
        videoUrl={newProduct.videoUrl}
        activationVideoUrl={newProduct.activationVideoUrl}
        driveLink={newProduct.driveLink}
        onImageUrlChange={(v) => handleInputChange("imageUrl", v)}
        onAdditionalImageChange={(index, v) =>
          updateImageField("additionalImages", index, v)
        }
        onRemoveAdditionalImage={(index) =>
          removeImageField("additionalImages", index)
        }
        onAddAdditionalImage={() => addImageField("additionalImages")}
        onVideoUrlChange={(v) => handleInputChange("videoUrl", v)}
        onActivationVideoUrlChange={(v) =>
          handleInputChange("activationVideoUrl", v)
        }
        onDriveLinkChange={(v) => handleInputChange("driveLink", v)}
      />

      <AddProductModalFaqSection
        colors={colors}
        faqs={newProduct.faqs}
        onAdd={addFAQ}
        onRemove={removeFAQ}
        onUpdate={updateFAQ}
      />

      <AddProductModalAutoSaveRow colors={colors} lastSaved={lastSaved} />
    </div>
  );
}
