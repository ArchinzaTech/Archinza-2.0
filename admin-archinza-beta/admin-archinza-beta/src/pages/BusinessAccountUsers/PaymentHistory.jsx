import React, { useState, useEffect } from "react";
import { Table, Spin, Button, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import http from "../../helpers/http";
import config from "../../config/config";
import helper from "../../helpers/helper";

const PaymentHistory = ({ paymentLogs }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPayments(paymentLogs);
  }, [paymentLogs]);

  const handleViewInvoice = async (paymentId) => {
    try {
      const response = await http.get(
        `${config.api_url}admin/business-users/get-invoice/${paymentId}`
      );
      if (response.data && response.data.invoiceId) {
        const invoiceId = response.data.invoiceId;
        window.open(`/invoice/print/${invoiceId}`, "_blank");
      } else {
        message.error("No Invoice Found");
      }
    } catch (error) {
      message.error("No Invoice Found");
    }
  };

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "rawPayload",
      key: "customerId",
      render: (rawPayload) =>
        rawPayload?.payload?.payment?.entity?.customer_id || "N/A",
    },
    {
      title: "Payment ID",
      dataIndex: "razorpayPaymentId",
      key: "razorpayPaymentId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount / 100} INR`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return helper.capitalizeWords(status);
      },
    },
    {
      title: "Payment Method",
      dataIndex: "rawPayload",
      key: "paymentMethod",
      render: (rawPayload) => {
        const method = rawPayload?.payload?.payment?.entity?.method;
        if (method === "upi" || method === "vpa") {
          return "upi".toUpperCase();
        }
        return method?.toUpperCase() || "N/A";
      },
    },
    {
      title: "Method Details",
      dataIndex: "rawPayload",
      key: "methodValue",
      render: (rawPayload) => {
        const entity = rawPayload?.payload?.payment?.entity;
        if (!entity) return "N/A";

        switch (entity.method) {
          case "upi":
            return entity.vpa || "N/A";
          case "card":
            return entity.card_id || "N/A";
          case "wallet":
            return entity.wallet || "N/A";
          case "netbanking":
            return entity.bank || "N/A";
          default:
            return "N/A";
        }
      },
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (text, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewInvoice(record.razorpayPaymentId)}
        >
          View
        </Button>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <Table
      columns={columns}
      dataSource={payments}
      rowKey="_id"
      pagination={false}
    />
  );
};

export default PaymentHistory;
