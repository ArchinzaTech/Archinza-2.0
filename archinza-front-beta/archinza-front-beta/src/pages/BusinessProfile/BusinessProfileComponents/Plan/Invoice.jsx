import React from "react";

const Invoice = ({ invoice }) => {
  if (!invoice) return <p>No invoice data found.</p>;

  const {
    invoiceId,
    createdAt,
    paymentId,
    amount,
    currency,
    plan,
    businessId,
    paymentMethod,
    rawPayload,
  } = invoice;

  // Convert amount from paise to rupees
  const displayAmount = (amount / 100).toFixed(2);

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        marginLeft: "40px",
        marginTop: "40px",
        fontSize: "14px",
      }}
    >
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col">
            <img
              src="/favicon-96x96.png"
              alt="Company Logo"
              className="h-16 object-contain mb-4"
            />
            <div className="text-sm text-gray-700 leading-relaxed max-w-xs">
              <p className="font-medium">Archinza</p>
              <p>Level 11, Godrej BKC Plot C-68, G Block,</p>
              <p>BKC - Bandra (East) Mumbai 400051</p>
              <p>Maharashtra, India</p>
              <p className="mt-2 font-medium">Tax number: 27AANFN9351J1ZN</p>
            </div>
          </div>
          <div className="text-right">
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1> */}
            <p className="text-lg text-gray-700 mb-1">Invoice: {invoiceId}</p>
            <p className="text-sm text-gray-600">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Business & Customer Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Billed By</h2>
            <p className="text-gray-600">Archinza</p>
            <p className="text-gray-600">archinza@mail.com</p>
            <p className="text-gray-600">
              +{businessId?.country_code} {businessId?.phone}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Billed To</h2>
            <p className="text-gray-600">
              {rawPayload?.notes?.customer_name || businessId?.business_name}
            </p>
            <p className="text-gray-600">
              {rawPayload?.email || businessId?.email}
            </p>
            <p className="text-gray-600">
              {rawPayload?.contact ||
                `+${businessId?.country_code} ${businessId?.phone}`}
            </p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">Payment Details</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Payment Method</th>
                <th className="p-2 border">Reference</th>
                <th className="p-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">
                  {plan?.name || "Subscription Plan"}
                </td>
                <td className="p-2 border">
                  {paymentMethod?.type?.toUpperCase()}
                  {paymentMethod?.info && ` - ${paymentMethod.info}`}
                </td>
                <td className="p-2 border">{paymentId}</td>
                <td className="p-2 border">₹{displayAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-right">
          <p className="text-lg font-semibold">Total: ₹{displayAmount}</p>
          <p className="text-xs text-gray-500 mt-4">
            This is a system-generated invoice and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
