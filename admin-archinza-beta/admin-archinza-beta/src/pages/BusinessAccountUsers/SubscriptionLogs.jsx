import React, { useState, useEffect } from "react";
import { List, Button, Modal, Spin } from "antd";
import http from "../../helpers/http";
import config from "../../config/config";
import PaymentHistory from "./PaymentHistory";
import helper from "../../helpers/helper";

const SubscriptionLogs = ({ userId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscriptionLogs = async () => {
      setLoading(true);
      try {
        const response = await http.get(
          `${config.api_url}admin/business-users/subscription-data/${userId}`
        );
        const logs = response?.data?.subscriptionLogs || [];
        const plans = response?.data?.plans || [];

        // map each log to include its matched plan
        const modifiedLogs = logs.map((log) => ({
          ...log,
          plan:
            plans.find((plan) => plan.razorpayPlanId === log.razorpayPlanId) ||
            null,
        }));
        setLogs(modifiedLogs);
      } catch (error) {
        console.error("Failed to fetch subscription logs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubscriptionLogs();
    }
  }, [userId]);

  const handleViewPaymentHistory = (subscription) => {
    setSelectedSubscription(subscription);
    setPaymentModalVisible(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalVisible(false);
    setSelectedSubscription(null);
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={logs}
        renderItem={(item) => {
          const capturedPayment = item.paymentLogs?.find(
            (log) => log.status === "captured"
          );
          const startDate = capturedPayment
            ? new Date(capturedPayment.cycleStart).toLocaleDateString()
            : "N/A";
          const endDate = capturedPayment
            ? new Date(capturedPayment.cycleEnd).toLocaleDateString()
            : "N/A";

          return (
            <List.Item
              actions={[
                <Button onClick={() => handleViewPaymentHistory(item)}>
                  View Payment History
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`Subscription: ${item?.plan?.name}`}
                description={`Status: ${helper.capitalizeWords(
                  item.status
                )} | Start Date: ${startDate} | End Date: ${endDate}`}
              />
            </List.Item>
          );
        }}
      />
      <Modal
        title="Payment History"
        open={paymentModalVisible}
        onCancel={handleClosePaymentModal}
        footer={null}
        width={1000}
      >
        {selectedSubscription && (
          <PaymentHistory
            // subscriptionId={selectedSubscription?.razorpaySubscriptionId}
            paymentLogs={selectedSubscription?.paymentLogs}
          />
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionLogs;
