import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const PaymentStatusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const maxAttempts = 5;

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    
    if (!orderId) {
      toast.error("Invalid payment redirect");
      navigate("/cart");
      return;
    }

    verifyPayment(orderId);
  }, []);

  const verifyPayment = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }

      console.log(`🔍 Verifying payment for order: ${orderId} (Attempt ${verificationAttempts + 1}/${maxAttempts})`);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/payments/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsVerifying(false);
        
        // Clear cart
        try {
          await fetch(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/cart/clear`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          localStorage.removeItem("cart");
        } catch (error) {
          console.error("Failed to clear cart:", error);
        }

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          html: `
            <div style="text-align: left; margin-top: 20px;">
              <p style="margin-bottom: 15px;">Thank you for your order. Your payment has been processed successfully.</p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <strong>Order ID:</strong>
                  <span style="font-family: monospace;">${orderId}</span>
                </div>
              </div>
              <div style="background: #fef3c7; padding: 10px; border-radius: 6px; margin-top: 15px; font-size: 14px;">
                📧 Order confirmation has been sent to your email.
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "View My Orders",
          cancelButtonText: "Continue Shopping",
          confirmButtonColor: "#10b981",
          cancelButtonColor: "#6b7280",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/my-orders");
          } else {
            navigate("/");
          }
        });
      } else {
        // Payment not yet confirmed, retry
        if (verificationAttempts < maxAttempts) {
          setVerificationAttempts(prev => prev + 1);
          setTimeout(() => verifyPayment(orderId), 3000);
        } else {
          setIsVerifying(false);
          toast.error("Unable to verify payment. Please check your orders.");
          navigate("/my-orders");
        }
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      
      if (verificationAttempts < maxAttempts) {
        setVerificationAttempts(prev => prev + 1);
        setTimeout(() => verifyPayment(orderId), 3000);
      } else {
        setIsVerifying(false);
        toast.error("Payment verification failed. Please contact support if amount was deducted.");
        navigate("/my-orders");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Attempt {verificationAttempts + 1} of {maxAttempts}
            </p>
          </>
        ) : (
          <>
            <div className="text-green-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Verified!
            </h2>
            <p className="text-gray-600">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusPage;
