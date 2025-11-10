import React, { useState, useEffect } from "react";
import { Modal, Tabs, message, Spin, Tooltip } from "antd";
import BusinessBasicDetailsForm from "./BusinessEditComponents/BusinessBasicDetailsForm";
import FormDetailsForm from "./BusinessEditComponents/FormDetails";
import MediaUploadsForm from "./BusinessEditComponents/MediaUploadForm";
import http from "../../helpers/http";
import config from "../../config/config";
import helper from "../../helpers/helper";

const { TabPane } = Tabs;

const BusinessUserCreateModal = ({ open, onClose, admin }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [newUserId, setNewUserId] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});

  const base_url = config.api_url;

  useEffect(() => {
    if (open) {
      setActiveTab("basic");
      setNewUserId(null);
      setInitialFormData({});
    }
  }, [open]);

  const handleBasicDetailsSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await http.post(
        `${base_url}admin/business-users`,
        values
      );
      if (response?.data?._id) {
        message.success("Basic details saved. Please complete other details.");
        setNewUserId(response.data._id);
        setInitialFormData(response.data);
        setActiveTab("formDetails");
        http.post(`${config.api_url}admin/logs`, {
          user: admin.id,
          action_type: "CREATE",
          module: "Business",
          subModule: "Registered Users",
          status: "SUCCESS",
          details: helper.captureBasicUserDetailsBusiness([values]),
        });
      } else {
        http.post(`${config.api_url}admin/logs`, {
          user: admin.id,
          action_type: "CREATE",
          module: "Business",
          subModule: "Registered Users",
          status: "FAILURE",
          details: helper.captureBasicUserDetailsBusiness([values]),
        });
        message.error(response?.message || "Failed to save basic details.");
      }
    } catch (error) {
      message.error(
        error?.message || "An error occurred while saving basic details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormDetailsSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await http.post(
        `${base_url}business/business-details/${newUserId}`,
        {
          ...initialFormData,
          ...values,
        }
      );
      if (response?.data) {
        message.success("Form details saved.");
        setInitialFormData(response.data);
        setActiveTab("mediaUploads");
      }
    } catch (error) {
      message.error(
        error?.message || "An error occurred while saving form details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUploadsComplete = async (updatedData) => {
    setLoading(true);
    try {
      // The MediaUploadsForm component already handles its own uploads and updates.
      // This function is primarily to signal completion and potentially trigger parent update.
      message.success("Media uploads completed.");
      setInitialFormData(updatedData);
      onClose();
    } catch (error) {
      message.error(
        error?.message || "An error occurred during media uploads."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props}>
      {(node) => (
        <Tooltip
          title={
            (node.key === "formDetails" || node.key === "mediaUploads") &&
            !newUserId
              ? "Please complete basic details first"
              : ""
          }
          key={node.key}
        >
          {node}
        </Tooltip>
      )}
    </DefaultTabBar>
  );

  return (
    <Modal
      title="Create New Business User"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          renderTabBar={renderTabBar}
        >
          <TabPane tab="Basic Details" key="basic">
            <BusinessBasicDetailsForm
              mode="create"
              initialValues={initialFormData}
              onSubmit={handleBasicDetailsSubmit}
              loading={loading}
              admin={admin}
            />
          </TabPane>
          <TabPane tab="Form Details" key="formDetails" disabled={!newUserId}>
            {newUserId && (
              <FormDetailsForm
                initialData={initialFormData}
                userId={newUserId}
                mode="create"
                onSubmit={handleFormDetailsSubmit}
                admin={admin}
              />
            )}
          </TabPane>
          <TabPane tab="Media Uploads" key="mediaUploads" disabled={!newUserId}>
            {newUserId && (
              <MediaUploadsForm
                initialData={initialFormData}
                userId={newUserId}
                mode="create"
                onSubmit={handleMediaUploadsComplete}
                admin={admin}
              />
            )}
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default BusinessUserCreateModal;
