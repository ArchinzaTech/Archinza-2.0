import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import http from "../../../../helpers/http";
import config from "../../../../config/config";
import Invoice from "./Invoice";

const InvoicePrint = () => {
  const { invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const response = await http.get(
          `${config.api_url}/business-plans/invoice-by-id/${invoiceId}`
        );
        console.log(response?.data);
        if (response?.data?.status && response?.data?.invoice) {
          setInvoiceData(response.data.invoice);
        } else {
          setError("No Invoice Found");
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("No Invoice Found");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceData();
    }
    console.log("invoiceId");
    console.log(invoiceId);
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Invoice invoice={invoiceData} />
    </div>
  );
};

export default InvoicePrint;
