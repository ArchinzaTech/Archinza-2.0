import React, { useEffect, useState } from "react";
import { Form, Button, Tabs, Spin, message } from "antd";
import http from "../../helpers/http";
import config from "../../config/config";
import BasicDetailsForm from "./BusinessEditComponents/BasicDetailsForm";
import FormDetailsForm from "./BusinessEditComponents/FormDetails";
import MediaUploadsForm from "./BusinessEditComponents/MediaUploadForm";

const { TabPane } = Tabs;

const BusinessUserEditForm = ({
  initialData: initialDataProp,
  onSubmit,
  onCancel,
  onMediaUpdate,
  admin,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [hideButtons, setHideButtons] = useState(false);
  const [initialData, setInitialData] = useState(initialDataProp || {});
  const base_url = config.api_url;
  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    setLoading(true);
    try {
      // Prepare data for API
      const updatedData = {
        business_name: values.business_name,
        bio: values.bio,
        email: values.email,
        username: values.username,
        phone: values.phone,
        country_code: values.country_code,
        whatsapp_no: values.whatsapp_no,
        whatsapp_country_code: values.whatsapp_country_code,
        city: values.city,
        country: values.country,
        pincode: values.pincode,
        owners: values?.owners,
        featured_services: values?.featured_services,
        services: values?.services,
        website_link: values?.website_link,
        linkedin_link: values?.linkedin_link,
        instagram_handle: values?.instagram_handle,
        establishment_year: {
          data: values?.establishment_years?.$y?.toString() || "",
        },
        team_range: {
          data: values?.team_range?.data || "",
        },
        project_sizes: values?.project_sizes,
        project_location: {
          data: values?.project_location?.data || "",
        },
        renovation_work: values?.renovation_work,
        project_typology: {
          data: values?.project_typology?.data || [],
        },
        design_style: {
          data: values?.design_style?.data || [],
        },
        avg_project_budget: values?.avg_project_budget,
        project_mimimal_fee: values?.project_mimimal_fee,
        product_positionings: values?.product_positionings,
        company_profile_media: values?.company_profile_media,
        product_catalogues_media: values?.product_catalogues_media,
      };
      await onSubmit(updatedData);
      form.resetFields();
      message.success("User updated successfully");
    } catch (error) {
      message.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setHideButtons(key === "3");
  };

  useEffect(() => {
    const handleMediaTabActive = (event) => {
      setHideButtons(event.detail);
    };

    const handleTabChange = (event) => {
      if (event.detail && event.detail.tabKey) {
        setActiveTab(event.detail.tabKey);
      }
    };

    window.addEventListener("mediaTabActive", handleMediaTabActive);
    window.addEventListener("changeTab", handleTabChange);

    return () => {
      window.removeEventListener("mediaTabActive", handleMediaTabActive);
      window.removeEventListener("changeTab", handleTabChange);
    };
  }, []);

  useEffect(() => {
    setInitialData(initialDataProp || {});
  }, [initialDataProp]);

  const handleFileDeleteUpdate = (fieldName, updatedFiles) => {
    console.log("Updated files:", updatedFiles);
    setInitialData((prev) => {
      const newData = {
        ...prev,
        [fieldName]: updatedFiles,
      };
      form.setFieldsValue({
        [fieldName]: updatedFiles,
      });
      onMediaUpdate?.(newData);
      return newData;
    });
  };

  // Initialize form
  useEffect(() => {
    form.setFieldsValue({
      business_name: initialData.business_name || "",
      bio: initialData.bio || "",
      email: initialData.email || "",
      username: initialData.username || "",
      country_code: initialData.country_code || "",
      phone: initialData.phone || "",
      whatsapp_country_code: initialData.whatsapp_country_code || "",
      whatsapp_no: initialData.whatsapp_no || "",
      city: initialData.city || "",
      country: initialData.country || "",
      pincode: initialData.pincode || "",
      owners: initialData.owners || [],
      featured_services: initialData.featured_services || [],
      services: initialData.services || [],
      website_link: initialData.website_link || "",
      linkedin_link: initialData.linkedin_link || "",
      instagram_handle: initialData.instagram_handle || "",
      establishment_year: initialData.establishment_year?.data || "",
      team_range: initialData.team_range?.data || "",
      project_scope: initialData.project_scope?.data || [],
      project_sizes: initialData.project_sizes || { sizes: [], unit: "" },
      project_location: initialData.project_location?.data || "",
      renovation_work: initialData.renovation_work || "No",
      project_typology: initialData.project_typology?.data || [],
      design_style: initialData.design_style?.data || [],
      avg_project_budget: initialData.avg_project_budget || {
        budgets: [],
        currency: "",
      },
      project_mimimal_fee: initialData.project_mimimal_fee || {
        fee: null,
        currency: "",
      },
      product_positionings: initialData.product_positionings || [],
      company_profile_media: initialData.company_profile_media || [],
      product_catalogues_media: initialData.product_catalogues_media || [],
      completed_products_media: initialData.completed_products_media || [],
      project_renders_media: initialData.project_renders_media || [],
      sites_inprogress_media: initialData.sites_inprogress_media || [],
      eliminate_media: initialData.eliminate_media || [],
    });
    console.log("Initial data:", initialData);
  }, [initialData, form]);

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Details" key="1">
            <BasicDetailsForm form={form} initialData={initialData} />
          </TabPane>
          <TabPane tab="Form Details" key="2">
            <FormDetailsForm
              form={form}
              initialData={initialData}
              admin={admin}
              onSubmit={handleSubmit}
            />
          </TabPane>
          <TabPane tab="Media Uploads" key="3">
            <MediaUploadsForm
              form={form}
              initialData={initialData}
              userId={initialData?._id}
              onFileDeleteUpdate={handleFileDeleteUpdate}
              admin={admin}
            />
          </TabPane>
        </Tabs>
        <Form.Item>
          {!hideButtons && (
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          )}
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default BusinessUserEditForm;
