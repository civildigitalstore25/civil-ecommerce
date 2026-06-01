import { ShoppingCart, X } from "lucide-react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import FormButton from "../../../components/Button/FormButton";
import FormInput from "../../../components/Input/FormInput";
import {
  useBackInStockNotifyForm,
  type BackInStockProductRef,
} from "./useBackInStockNotifyForm";

type BackInStockNotifyFormProps = BackInStockProductRef & {
  className?: string;
};

export function BackInStockNotifyForm({
  productId,
  productName,
  className = "",
}: BackInStockNotifyFormProps) {
  const { colors } = useAdminTheme();
  const { name, setName, email, setEmail, handleSubmit, isSubmitting } =
    useBackInStockNotifyForm({ productId, productName });

  const fieldId = (field: string) => `back-in-stock-${productId}-${field}`;

  return (
    <div
      className={`rounded-lg border p-4 md:p-5 ${className}`.trim()}
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
      data-product-name={productName}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="relative inline-flex shrink-0" aria-hidden>
          <ShoppingCart
            className="h-8 w-8 md:h-9 md:w-9"
            style={{ color: colors.interactive.primary }}
            strokeWidth={1.75}
          />
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.status.error }}
          >
            <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </span>
        </span>
        <p
          className="pt-1 text-base font-semibold leading-snug md:text-lg"
          style={{ color: colors.status.error }}
        >
          Email me when its back in stock
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormInput
            id={fieldId("name")}
            name="name"
            type="text"
            placeholder="Name"
            aria-label="Name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="py-2.5"
          />
          <FormInput
            id={fieldId("email")}
            name="email"
            type="email"
            placeholder="Email Address"
            aria-label="Email Address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="py-2.5"
          />
        </div>

        <FormButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full py-3 text-base"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </FormButton>
      </form>
    </div>
  );
}
