import React, { useState } from "react";
import { Modal, Tabs, Tooltip, message } from "antd";
import BasicDetailsForm from "./BasicDetailsForm";
import ProDetailsForm from "./ProDetailsForm";
import http from "../../helpers/http";
import config from "../../config/config";

const PersonalUserCreateModal = ({ open, onClose, onCreated, admin }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [createdUserId, setCreatedUserId] = useState(null);
  const [basicFormValues, setBasicFormValues] = useState(null);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const base_url = config.api_url;

  const handleBasicSubmit = async (values) => {
    setLoading(true);
    try {
      console.log(admin);
      // Call create user API
      const response = await http.post(`${base_url}admin/users`, values);
      if (response?.data) {
        setUserType(values?.user_type);
        setBasicFormValues(values);
        setActiveTab("pro");
        http.post(`${base_url}admin/logs`, {
          user: admin.id,
          action_type: "CREATE",
          module: "Personal",
          subModule: "Registered Users",
          details: values,
          status: "SUCCESS",
        });
        if (values?.user_type !== "DE") {
          setCreatedUserId(response.data.proId);
          message.success("User created. Now fill Pro Info.");
        } else {
          message.success("User created");
          onCreated && onCreated();
          handleClose();
        }
      } else {
        http.post(`${base_url}admin/logs`, {
          user: admin.id,
          action_type: "CREATE",
          module: "Personal",
          subModule: "Registered Users",
          details: values,
          status: "FAILED",
        });
      }
    } catch (err) {
      message.error("Failed to create user");
    }
    setLoading(false);
  };

  const handleProSubmit = async (values) => {
    setLoading(true);
    try {
      // Call create pro info API
      await http.put(
        `${base_url}admin/users/proAccess/${createdUserId}`,
        values
      );
      message.success("Pro details created");
      setLoading(false);
      onCreated && onCreated();
      handleClose();
    } catch (err) {
      setLoading(false);
      message.error("Failed to create pro details");
    }
  };

  const handleClose = () => {
    setActiveTab("basic");
    setCreatedUserId(null);
    setBasicFormValues(null);
    setLoading(false);
    onClose && onClose();
  };

  return (
    <Modal
      title="Create New User"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Basic Info" key="basic">
          <BasicDetailsForm
            mode="create"
            onSubmit={handleBasicSubmit}
            loading={loading}
            initialValues={basicFormValues}
            disableFields={false}
          />
        </Tabs.TabPane>
        {userType !== "DE" && (
          <Tabs.TabPane
            tab={
              !createdUserId ? (
                <Tooltip title="Please fill and submit Basic Info first">
                  <span style={{ color: "rgba(0,0,0,0.25)" }}>Pro Info</span>
                </Tooltip>
              ) : (
                "Pro Info"
              )
            }
            key="pro"
            disabled={!createdUserId}
          >
            <ProDetailsForm
              mode="create"
              userId={createdUserId}
              userType={userType}
              onSubmit={handleProSubmit}
              loading={loading}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default PersonalUserCreateModal;
