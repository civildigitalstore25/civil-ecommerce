import type { NavigateFunction } from "react-router-dom";
import Swal from "sweetalert2";
import type { SweetAlertResult } from "sweetalert2";

const successDialogBase = {
  icon: "success" as const,
  showCancelButton: true,
  confirmButtonText: "My Orders",
  cancelButtonText: "Continue Shopping",
  confirmButtonColor: "#10b981",
  cancelButtonColor: "#6b7280",
  timer: 3000,
  timerProgressBar: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
};

function checkoutSuccessOrderHtml(opts: {
  intro: string;
  orderId: string;
  amountPaid: number | null;
  guestAccountNote?: string;
}): string {
  const amountRow =
    opts.amountPaid === null
      ? ""
      : `
      <div style="display: flex; justify-content: space-between;">
        <strong>Amount Paid:</strong>
        <span style="color: #10b981; font-weight: bold;">₹${opts.amountPaid.toFixed(2)}</span>
      </div>`;

  const guestNote = opts.guestAccountNote
    ? `
      <div style="background: #eff6ff; padding: 10px; border-radius: 6px; margin-top: 15px; font-size: 14px;">
        ${opts.guestAccountNote}
      </div>`
    : "";

  return `
    <div style="text-align: left; margin-top: 20px;">
      <p style="margin-bottom: 15px;">${opts.intro}</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong>Order ID:</strong>
          <span style="font-family: monospace;">${opts.orderId}</span>
        </div>
        ${amountRow}
      </div>
      <div style="background: #fef3c7; padding: 10px; border-radius: 6px; margin-top: 15px; font-size: 14px;">
        📧 Order confirmation has been sent to your email and WhatsApp.
      </div>
      ${guestNote}
    </div>
  `;
}

const guestAccountCreatedNote =
  "An account was created with your email. Use Forgot password on the sign-in page to set a password and access My orders anytime.";

export function showFreeOrderPlacedSwal(orderId: string, isNewGuest = false) {
  return Swal.fire({
    ...successDialogBase,
    title: "Order Placed!",
    html: checkoutSuccessOrderHtml({
      intro:
        "Thank you for your order. Your order has been placed successfully.",
      orderId,
      amountPaid: null,
      guestAccountNote: isNewGuest ? guestAccountCreatedNote : undefined,
    }),
  });
}

export function showPaidOrderSuccessSwal(
  orderId: string,
  amountPaid: number,
  isNewGuest = false,
) {
  return Swal.fire({
    ...successDialogBase,
    title: "Payment Successful!",
    html: checkoutSuccessOrderHtml({
      intro:
        "Thank you for your order. Your payment has been processed successfully.",
      orderId,
      amountPaid,
      guestAccountNote: isNewGuest ? guestAccountCreatedNote : undefined,
    }),
  });
}

export function navigateAfterCheckoutSuccessSwal(
  result: SweetAlertResult,
  navigate: NavigateFunction,
): void {
  if (result.isConfirmed) {
    navigate("/my-orders");
  } else if (result.dismiss === Swal.DismissReason.timer) {
    navigate("/my-orders");
  } else {
    navigate("/");
  }
}
