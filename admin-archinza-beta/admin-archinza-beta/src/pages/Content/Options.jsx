import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Row,
  Col,
  Card,
  Form,
  Input,
  notification,
  Button,
  Spin,
  Divider,
  Tag,
  Space,
  Tooltip,
} from "antd";

import { PlusOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import http from "../../helpers/http";
import config from "../../config/config";
import DynamicOptionInput from "../../components/DynamicOptionsInput";
import { jwtDecode } from "jwt-decode";
import { hasPermission, isSuperAdmin } from "../../helpers/permissions";

function Options() {
  const [form] = Form.useForm();
  const [formError, setFormError] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const fieldNameMapping = {
    tm_job_profile: "working_professional_job_profile_options",
    tm_experience: "working_professional_experience_options",
    tm_unmet_needs: "working_professional_unmet_needs_options",
    st_study_field: "student_field_of_study_options",
    st_unmet_needs: "student_unmet_needs_options",
    bo_buss_establishment: "business_establishment_options",
    bo_unmet_needs: "business_unmet_needs_options",
    fl_establishment: "freelance_establishment_options",
    fl_unmet_needs: "freelancer_unmet_needs_options",
  };
  // Dynamic option management

  const fetchData = async () => {
    setLoading(true);
    const { data: responseData } = await http.get(
      config.api_url + "admin/content/options"
    );

    if (responseData) {
      setData(responseData);
      form.setFieldsValue(responseData);
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setBtnLoading(true);
    try {
      const changes = {};
      Object.keys(values).forEach((key) => {
        const initialValues = sortData(data[key]) || [];
        const newValues = sortData(values[key]) || [];

        const added = newValues.filter((item) => !initialValues.includes(item));
        const removed = initialValues.filter(
          (item) => !newValues.includes(item)
        );

        if (added.length > 0 || removed.length > 0) {
          const formattedKey = fieldNameMapping[key] || key;
          changes[formattedKey] = { added, removed };
        }
      });
      console.log(changes);
      const response = await http.put(
        config.api_url + "admin/content/options",
        values
      );

      if (response?.data) {
        notification.success({
          message: "Options Updated Successfully",
        });
        await http.post(`${config.api_url}admin/logs`, {
          user: userRole.id,
          action_type: "EDIT",
          module: "Personal",
          subModule: "Onboarding Datatypes",
          details: changes,
          status: "SUCCESS",
        });
        fetchData();
      } else {
        await http.post(`${config.api_url}admin/logs`, {
          user: userRole.id,
          action_type: "EDIT",
          module: "Personal",
          subModule: "Onboarding Datatypes",
          details: changes,
          status: "FAILURE",
        });
      }
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description: error.message,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  const sortData = (data) => {
    return data?.sort((a, b) => {
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
      }
      return a - b;
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Personal Flow</Breadcrumb.Item>
        <Breadcrumb.Item>Onboarding Datatypes</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Onboarding Datatypes">
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {/* Working Professional Section */}
          <Divider style={{ fontSize: "25px" }}>Working Professional</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="tm_job_profile" label="Job Profile Options">
                <DynamicOptionInput
                  name="tm_job_profile"
                  label="Job Profiles"
                  placeholder="Enter new job profile"
                  initialValues={sortData(data.tm_job_profile) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="tm_experience" label="Experience Options">
                <DynamicOptionInput
                  name="tm_experience"
                  label="Experience"
                  placeholder="Enter new experience level"
                  initialValues={sortData(data.tm_experience) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="tm_unmet_needs"
                label="Professional Unmet Needs Options"
              >
                <DynamicOptionInput
                  name="tm_unmet_needs"
                  label="Unmet Needs"
                  placeholder="Enter new unmet need"
                  initialValues={sortData(data.tm_unmet_needs) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Student Section */}
          <Divider style={{ fontSize: "25px" }}>Student</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="st_study_field" label="Field of Study Options">
                <DynamicOptionInput
                  name="st_study_field"
                  label="Field of Study"
                  placeholder="Enter new study field"
                  initialValues={sortData(data.st_study_field) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={8}>
              <Form.Item
                name="st_graduate_year"
                label="Graduation Year Options"
              >
                <DynamicOptionInput
                  name="st_graduate_year"
                  label="Graduation Year"
                  placeholder="Enter new graduation year"
                  initialValues={sortData(data.st_graduate_year) || []}
                  form={form}
                />
              </Form.Item>
            </Col> */}
            <Col xs={24} md={8}>
              <Form.Item
                name="st_unmet_needs"
                label="Student Unmet Needs Options"
              >
                <DynamicOptionInput
                  name="st_unmet_needs"
                  label="Unmet Needs"
                  placeholder="Enter new unmet need"
                  initialValues={sortData(data.st_unmet_needs) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Business/Firm Owner Section */}
          <Divider style={{ fontSize: "25px" }}>Business / Firm Owner</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="bo_buss_establishment"
                label="Business Establishment Options"
              >
                <DynamicOptionInput
                  name="bo_buss_establishment"
                  label="Business Establishment"
                  placeholder="Enter new business establishment period"
                  initialValues={sortData(data.bo_buss_establishment) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="bo_unmet_needs"
                label="Business Unmet Needs Options"
              >
                <DynamicOptionInput
                  name="bo_unmet_needs"
                  label="Unmet Needs"
                  placeholder="Enter new unmet need"
                  initialValues={sortData(data.bo_unmet_needs) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Freelancer/Artist Section */}
          <Divider style={{ fontSize: "25px" }}>Freelancer/Artist</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="fl_establishment"
                label="Freelance Establishment Options"
              >
                <DynamicOptionInput
                  name="fl_establishment"
                  label="Freelance Establishment"
                  placeholder="Enter new establishment period"
                  initialValues={sortData(data.fl_establishment) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="fl_unmet_needs"
                label="Freelancer Unmet Needs Options"
              >
                <DynamicOptionInput
                  name="fl_unmet_needs"
                  label="Unmet Needs"
                  placeholder="Enter new unmet need"
                  initialValues={sortData(data.fl_unmet_needs) || []}
                  form={form}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Form.Item>
                {(isSuperAdmin(userRole.role) ||
                  !hasPermission(userRole.role, "view_all")) && (
                  <Button type="primary" htmlType="submit" loading={btnLoading}>
                    Update Options
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default Options;
