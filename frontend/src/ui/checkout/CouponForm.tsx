import React from "react";
import FormButton from "../../components/Button/FormButton";


interface CouponFormProps {
  colors: any;
  couponCode: string;
  setCouponCode: (val: string) => void;
  applyCoupon: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({
  colors,
  couponCode,
  setCouponCode,
  applyCoupon,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
<input
  type="text"
  value={couponCode}
  onChange={e => setCouponCode(e.target.value)}
  placeholder="Enter coupon"
  className="px-4 py-2 border rounded-md flex-1 w-full focus:outline-none"
  style={{
    backgroundColor: colors.background.primary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
    transition: "border-color 0.2s, box-shadow 0.2s",
  }}
  onFocus={(e) => {
    e.target.style.borderColor = colors.interactive.primary;
    e.target.style.boxShadow = `0 0 0 2px ${colors.interactive.primary}40`;
  }}
  onBlur={(e) => {
    e.target.style.borderColor = colors.border.primary;
    e.target.style.boxShadow = "none";
  }}
/>
<FormButton
  type="button"
  variant="primary"
  onClick={applyCoupon}
  className="px-4 py-2 rounded-md font-medium w-full sm:w-auto"
>
  Apply
</FormButton>

    </div>
  );
};

export default CouponForm;
