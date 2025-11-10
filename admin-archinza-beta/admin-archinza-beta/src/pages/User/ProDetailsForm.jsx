import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import config from "../../config/config";
import http from "../../helpers/http";

const ProDetailsForm = ({
  mode,
  userId,
  userType,
  user,
  onUpdated,
  onClose,
  onSubmit,
  admin,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState();
  const [latestUserTypeData, setLatestUserTypeData] = useState();

  const fetchData = async () => {
    const { data: responseData } = await http.get(
      config.api_url + "admin/content/options"
    );
    if (responseData) {
      setOptions(responseData);
    }
  };

  useEffect(() => {
    if (user) {
      if (user?.proAccessEntry) {
        console.log(user.proAccessEntry);
        const latestUserType = user?.proAccessEntry?.find(
          (it) => it.user_type === user?.user_type
        );
        console.log(latestUserType);
        setLatestUserTypeData(latestUserType);
        form.setFieldsValue({
          st_study_field: latestUserType?.st_study_field,
          st_graduate_year: latestUserType?.st_graduate_year || undefined,
          st_unmet_needs: latestUserType?.all_st_unmet_needs?.length
            ? latestUserType?.all_st_unmet_needs
            : latestUserType?.st_unmet_needs || undefined,
          // all_st_unmet_needs: latestUserType.all_st_unmet_needs,
          tm_job_profile: latestUserType?.tm_job_profile,
          tm_experience: latestUserType?.tm_experience || undefined,
          tm_unmet_needs: latestUserType?.all_tm_unmet_needs?.length
            ? latestUserType?.all_tm_unmet_needs
            : latestUserType?.tm_unmet_needs || undefined,
          // all_tm_unmet_needs: latestUserType.all_tm_unmet_needs,
          bo_buss_establishment:
            latestUserType?.bo_buss_establishment || undefined,
          bo_unmet_needs: latestUserType?.all_bo_unmet_needs?.length
            ? latestUserType?.all_bo_unmet_needs
            : latestUserType?.bo_unmet_needs || undefined,
          // all_bo_unmet_needs: latestUserType.all_bo_unmet_needs,
          fl_establishment: latestUserType?.fl_establishment || undefined,
          fl_unmet_needs: latestUserType?.all_fl_unmet_needs?.length
            ? latestUserType?.all_fl_unmet_needs
            : latestUserType?.fl_unmet_needs || undefined,
          // all_fl_unmet_needs: latestUserType.all_fl_unmet_needs,
        });
      }
    }
  }, [user, form, mode]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    const {
      name,
      email,
      user_type,
      country_code,
      phone,
      whatsapp_country_code,
      whatsapp_no,
      country,
      city,
      state,
    } = user;
    try {
      const response = await http.put(
        `${config.api_url}admin/users/proAccess/${latestUserTypeData?._id}`,
        values
      );
      if (response?.data) {
        http.post(`${config.api_url}admin/logs`, {
          user: admin.id,
          action_type: "EDIT",
          module: "Personal",
          subModule: "Registered Users",
          details: {
            name,
            email,
            user_type,
            country_code,
            phone,
            whatsapp_country_code,
            whatsapp_no,
            country,
            city: city || "NA",
            state: state || "NA",
            ...values,
          },
          status: "SUCCESS",
        });
        message.success("Pro details updated");
        setLoading(false);
        onUpdated && onUpdated();
        onClose && onClose();
      } else {
        http.post(`${config.api_url}admin/logs`, {
          user: admin.id,
          action_type: "EDIT",
          module: "Personal",
          subModule: "Registered Users",
          details: {
            name,
            email,
            user_type,
            country_code,
            phone,
            whatsapp_country_code,
            whatsapp_no,
            country,
            city: city || "NA",
            state: state || "NA",
            ...values,
          },
          status: "FAILURE",
        });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error("Failed to update pro details");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit ? onSubmit : handleSubmit}
    >
      {(userType === "ST" || user?.user_type === "ST") && (
        <>
          {/* Student */}
          <Form.Item
            label="What is your Field of Study?"
            name="st_study_field"
            rules={[{ required: true, message: "Field of Study is required" }]}
          >
            <Select
              mode="multiple"
              options={options?.st_study_field?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select Field of Study"
            />
          </Form.Item>
          <Form.Item
            label="Please tell us the year you will graduate"
            name="st_graduate_year"
            rules={[{ required: true, message: "Graduation year is required" }]}
          >
            <Select
              mode="single"
              options={options?.st_graduate_year?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select year of graduation"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Tell us about your largest concern/unmet need?"
            name="st_unmet_needs"
            rules={[
              {
                required: true,
                message: "Largest concern/unmet need is required",
              },
            ]}
          >
            <Select
              mode="single"
              options={options?.st_unmet_needs?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select largest concern/unmet needs"
              allowClear
            />
          </Form.Item>
        </>
      )}

      {(userType === "TM" || user?.user_type === "TM") && (
        <>
          {/* Working Prof */}
          <Form.Item
            label="What is your current/past job profile/s?"
            name="tm_job_profile"
            rules={[{ required: true, message: "Job profile is required" }]}
          >
            <Select
              mode="multiple"
              options={options?.tm_job_profile?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select current/past job profiles"
            />
          </Form.Item>
          <Form.Item
            label="Please tell us how many years of experience do you have"
            name="tm_experience"
            rules={[
              { required: true, message: "Experience years are required" },
            ]}
          >
            <Select
              mode="single"
              options={options?.tm_experience?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select years of experience"
            />
          </Form.Item>
          <Form.Item
            label="Tell us about your largest concern/unmet need"
            name="tm_unmet_needs"
            rules={[
              {
                required: true,
                message: "Largest concern/unmet need is required",
              },
            ]}
          >
            <Select
              mode="single"
              options={options?.tm_unmet_needs?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select unmet need"
              allowClear
            />
          </Form.Item>
        </>
      )}

      {(userType === "BO" || user?.user_type === "BO") && (
        <>
          {/* Business Owner */}
          <Form.Item
            label="How long back did you establish your work / business / firm?"
            name="bo_buss_establishment"
            rules={[
              { required: true, message: "Establishment year is required" },
            ]}
          >
            <Select
              mode="single"
              options={options?.bo_buss_establishment?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select establishment years"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="What is your largest concern or unmet need at your work / business / firm?"
            name="bo_unmet_needs"
            rules={[
              {
                required: true,
                message: "Largest concern/unmet need is required",
              },
            ]}
          >
            <Select
              mode="single"
              options={options?.bo_unmet_needs?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select unmet need"
              allowClear
            />
          </Form.Item>
        </>
      )}

      {(userType === "FL" || user?.user_type === "FL") && (
        <>
          {/* Freelancer */}
          <Form.Item
            label="How long back did you establish your work / business / firm?"
            name="fl_establishment"
            rules={[
              { required: true, message: "Establishment year is required" },
            ]}
          >
            <Select
              mode="single"
              options={options?.fl_establishment?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select establishment years"
            />
          </Form.Item>
          <Form.Item
            label="What is your largest concern or unmet need at your work / business / firm?"
            name="fl_unmet_needs"
            rules={[
              {
                required: true,
                message: "Largest concern/unmet need is required",
              },
            ]}
          >
            <Select
              mode="single"
              options={options?.fl_unmet_needs?.map((it) => ({
                label: it,
                value: it,
              }))}
              placeholder="Select unmet need"
              allowClear
            />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Save Pro Details
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProDetailsForm;
