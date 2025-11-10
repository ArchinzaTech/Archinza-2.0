import React, { useEffect, useState } from "react";
import { Drawer, Tabs } from "antd";
import BasicDetailsForm from "./BasicDetailsForm";
import ProDetailsForm from "./ProDetailsForm";

const PersonalUserEditModal = ({ open, onClose, user, onUpdated, admin }) => {
  const [activeTab, setActiveTab] = useState("basic");
  useEffect(() => {
    if (open) {
      setActiveTab("basic");
    }
  }, [open]);

  return (
    <Drawer
      title="Edit User"
      open={open}
      onClose={onClose}
      width={600}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ padding: 24 }}
      >
        <Tabs.TabPane tab="Basic Details" key="basic">
          <BasicDetailsForm
            user={user}
            onUpdated={onUpdated}
            onClose={onClose}
            admin={admin}
          />
        </Tabs.TabPane>
        {user?.user_type !== "DE" && (
          <Tabs.TabPane tab="Pro Details" key="pro">
            <ProDetailsForm
              user={user}
              onUpdated={onUpdated}
              onClose={onClose}
              admin={admin}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Drawer>
  );
};

export default PersonalUserEditModal;
