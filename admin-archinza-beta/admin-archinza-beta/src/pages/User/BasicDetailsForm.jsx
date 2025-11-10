import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Row, Col, Spin } from "antd";
import http from "../../helpers/http";
import config from "../../config/config";

const userTypes = {
  DE: "Design Enthusiast",
  BO: "Business / Firm Owner",
  TM: "Working Professional",
  ST: "Student",
  FL: "Freelancer / Artist",
};

const BasicDetailsForm = ({
  user,
  onUpdated,
  onClose,
  admin,
  mode = "edit",
  onSubmit,
  initialValues,
  loading: externalLoading,
  disableFields,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isIndiaSelected, setIsIndiaSelected] = useState(false);
  const [roleConstraints, setRoleConstraints] = useState([]);
  const [fetching, setFetching] = useState(true);

  const base_url = config.api_url;

  useEffect(() => {
    fetchInitialData();
    //check which permission has any constraints for lockedData
    if (admin?.role !== "Super Admin") {
      if (admin?.role?.permissions) {
        const lockedDataPermission = admin.role.permissions.find(
          (per) => per?.constraints?.lockedFields?.length
        );
        if (lockedDataPermission) {
          setRoleConstraints(lockedDataPermission?.constraints?.lockedFields);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (mode === "edit" && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        country_code: user.country_code,
        phone: user.phone,
        whatsapp_country_code: user.whatsapp_country_code,
        whatsapp_no: user.whatsapp_no,
        city: user.city,
        country: user.country,
        pincode: user.pincode,
      });
      setIsIndiaSelected(user.country === "India");
      if (user.country === "India") {
        fetchCities("101");
      }
    } else if (mode === "create" && initialValues) {
      form.setFieldsValue(initialValues);
      setIsIndiaSelected(initialValues.country === "India");
      if (initialValues.country === "India") {
        fetchCities("101");
      }
    } else if (mode === "create") {
      form.resetFields();
      setIsIndiaSelected(false);
    }
  }, [user, form, mode, initialValues]);

  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const [codesResponse, countriesResponse] = await Promise.all([
        http.get(`${base_url}general/countries/codes`),
        http.get(`${base_url}general/countries`),
      ]);
      if (codesResponse?.data) {
        setCountryCodes(
          codesResponse.data.map((item, index) => ({
            key: `${item.phone_code}-${index}`,
            label: item.phone_code,
            value: item.phone_code,
          }))
        );
      }
      if (countriesResponse?.data) {
        setCountries(
          countriesResponse.data.map((item) => ({
            key: item.id,
            label: item.name,
            value: item.name,
            id: item.id,
          }))
        );
      }
    } catch (err) {
      message.error("Failed to fetch country/country codes");
    }
    setFetching(false);
  };

  const fetchCities = async (countryId) => {
    try {
      const res = await http.get(
        `${base_url}general/cities-by-country/${countryId}`
      );
      if (res?.data) {
        setCities(
          res.data.map((item) => ({
            key: item.id,
            label: item.name,
            value: item.name,
          }))
        );
      }
    } catch (err) {
      setCities([]);
    }
  };

  const handleCountryChange = (value) => {
    const countryObj = countries.find((c) => c.value === value);
    setIsIndiaSelected(value === "India");
    form.setFieldsValue({ city: undefined, pincode: undefined });
    if (value === "India") {
      fetchCities("101");
    } else {
      setCities([]);
    }
  };

  // Internal submit handler for edit mode
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await http.put(
        `${base_url}admin/users/${user?._id}`,
        values
      );
      if (response?.data) {
        http.post(`${base_url}admin/logs`, {
          user: admin.id,
          action_type: "EDIT",
          module: "Personal",
          subModule: "Registered Users",
          details: values,
          status: "SUCCESS",
        });
        message.success("Basic details updated");
        setLoading(false);
        onUpdated && onUpdated();
        onClose && onClose();
      } else {
        http.post(`${base_url}admin/logs`, {
          user: admin.id,
          action_type: "EDIT",
          module: "Personal",
          subModule: "Registered Users",
          details: values,
          status: "FAILURE",
        });
      }
    } catch (err) {
      setLoading(false);
      message.error("Failed to update basic details");
    }
  };

  const inputStyle = { width: 500 };

  return (
    <Spin spinning={fetching}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit ? onSubmit : handleSubmit}
        initialValues={mode === "create" ? initialValues : undefined}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input style={inputStyle} disabled={disableFields} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Email is required",
            },
          ]}
        >
          <Input
            style={inputStyle}
            disabled={
              roleConstraints?.includes("email") || disableFields ? true : false
            }
          />
        </Form.Item>
        <Form.Item
          label="User Type"
          name="user_type"
          rules={[{ required: true, message: "User Type is required" }]}
        >
          <Select style={inputStyle} disabled={disableFields}>
            {Object.entries(userTypes).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Phone" required>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name="country_code"
                noStyle
                rules={[
                  { required: true, message: "Country code is required" },
                ]}
              >
                <Select
                  showSearch
                  options={countryCodes}
                  placeholder="Code"
                  style={{ width: "100%" }}
                  disabled={
                    roleConstraints?.includes("phone") || disableFields
                      ? true
                      : false
                  }
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="phone"
                noStyle
                rules={[
                  { required: true, message: "Phone number is required" },
                ]}
              >
                <Input
                  placeholder="Phone number"
                  style={{ width: 250 }}
                  disabled={
                    roleConstraints?.includes("phone") || disableFields
                      ? true
                      : false
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="WhatsApp Number" required>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name="whatsapp_country_code"
                noStyle
                rules={[
                  { required: true, message: "Country code is required" },
                ]}
              >
                <Select
                  showSearch
                  options={countryCodes}
                  placeholder="Code"
                  style={{ width: "100%" }}
                  disabled={disableFields}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="whatsapp_no"
                noStyle
                rules={[
                  { required: true, message: "WhatsApp number is required" },
                ]}
              >
                <Input
                  placeholder="WhatsApp number"
                  style={{ width: 250 }}
                  disabled={disableFields}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: "Country is required" }]}
        >
          <Select
            showSearch
            options={countries}
            placeholder="Select country"
            onChange={handleCountryChange}
            style={inputStyle}
            disabled={disableFields}
          />
        </Form.Item>
        {isIndiaSelected && (
          <>
            <Form.Item
              name="city"
              label="City"
              rules={[
                { required: true, message: "City is required for India" },
              ]}
              required={isIndiaSelected}
            >
              <Select
                showSearch
                options={cities}
                placeholder="Select city"
                style={inputStyle}
                disabled={disableFields}
              />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[
                { required: true, message: "Pincode is required" },
                { pattern: /^\d{6}$/, message: "Pincode must be of 6 digits" },
              ]}
              required={isIndiaSelected}
            >
              <Input
                style={inputStyle}
                placeholder="Enter pincode"
                disabled={disableFields}
              />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={externalLoading || loading}
            block
            disabled={disableFields}
          >
            {mode === "create" ? "Create User" : "Save Basic Details"}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default BasicDetailsForm;
