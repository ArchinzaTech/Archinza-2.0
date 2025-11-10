import React, { useEffect, useState } from "react";
import http from "../../helpers/http";
import config from "../../config/config";
import "./Checkout.scss"; // Add styles for the modal

const Checkout = ({
  plan,
  user,
  subscription,
  onPaymentSuccess,
  onPaymentFailure,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("Checkout props:", { user, plan, subscription });

  const initiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          // Use the subscription ID that was already created from your backend
          if (!subscription) {
            throw new Error("Subscription ID not found. Please try again.");
          }

          const options = {
            key: config.razorpay_key_id, // Only public key is safe to use on frontend
            subscription_id: subscription.subscriptionId, // This comes from your backend
            payment_methods: {
              card: 1,
              upi: 1,
              netbanking: 1,
            },
            name: "Archinza",
            description: `Subscription for ${plan.name}`,
            image: "/logo.png", // Add your logo
            handler: async (response) => {
              try {
                // Verify payment on your backend
                const verifyResponse = await http.post(
                  `${config.api_url}/business-plans/verify-payment`, // Update this endpoint
                  {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_subscription_id: response.razorpay_subscription_id,
                    razorpay_signature: response.razorpay_signature,
                    user_id: user._id,
                    plan_id: plan._id,
                  }
                );

                if (verifyResponse.data.success) {
                  onPaymentSuccess(response);
                  onClose();
                } else {
                  throw new Error("Payment verification failed");
                }
              } catch (verifyError) {
                console.error("Payment verification error:", verifyError);
                onPaymentFailure(verifyError.message);
              }
            },
            prefill: {
              name: user.business_name || user.name,
              email: user.email,
              contact: `${user?.country_code}${user.phone}`,
            },
            notes: {
              businessAccountId: user?._id,
              plan: plan?._id,
            },
            theme: {
              color: "#F37254",
            },
            modal: {
              ondismiss: () => {
                setLoading(false);
                onClose();
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", (response) => {
            console.error("Payment failed:", response);
            onPaymentFailure("Payment failed. Please try again.");
            onClose();
          });

          rzp.open();
          setLoading(false);
        } catch (error) {
          console.error("Error in payment initialization:", error);
          setError(error.message);
          setLoading(false);
        }
      };

      script.onerror = () => {
        setError(
          "Failed to load payment gateway. Please check your internet connection."
        );
        setLoading(false);
      };
    } catch (error) {
      console.error("Error loading payment gateway:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h3>Upgrade Your Plan</h3>
          <button
            className="close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="checkout-content">
          {error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <button
                  className="retry-btn"
                  onClick={() => {
                    setError(null);
                    initiatePayment();
                  }}
                >
                  Retry
                </button>
                <button className="cancel-btn" onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="plan-details">
              <h4>{plan?.name}</h4>
              <p className="plan-price">₹{plan?.price}/year</p>
              <ul className="plan-features">
                {/* {plan?.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))} */}
                {plan?.razorpayPlanId}
              </ul>

              <div className="checkout-actions">
                <button
                  className="pay-btn"
                  onClick={initiatePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${plan?.price}`}
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
