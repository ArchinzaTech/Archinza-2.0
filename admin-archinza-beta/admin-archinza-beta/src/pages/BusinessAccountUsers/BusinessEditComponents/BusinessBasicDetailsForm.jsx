import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Select, message, Row, Col, Spin } from "antd";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { debounce } from "lodash";

const BusinessBasicDetailsForm = ({
  mode = "edit",
  initialValues,
  onSubmit,
  loading: externalLoading,
  admin,
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
  const [businessTypes, setBusinessTypes] = useState([]);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameHelp, setUsernameHelp] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);

  const base_url = config.api_url;

  const checkUsername = async (username) => {
    if (!username) {
      setUsernameStatus("");
      setUsernameHelp("");
      return;
    }
    setUsernameLoading(true);
    try {
      const response = await http.post(`${base_url}business/check-username`, {
        username,
      });
      if (response.data.available) {
        setUsernameStatus("success");
        setUsernameHelp("This username is available.");
      } else {
        setUsernameStatus("error");
        setUsernameHelp("This username is taken.");
      }
    } catch (error) {
      setUsernameStatus("error");
      setUsernameHelp("Error checking username.");
    } finally {
      setUsernameLoading(false);
    }
  };

  const debouncedCheckUsername = useCallback(
    debounce((username) => checkUsername(username), 1000),
    []
  );

  useEffect(() => {
    fetchInitialData();
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
    if (initialValues) {
      form.setFieldsValue({
        business_name: initialValues.business_name,
        username: initialValues.username,
        email: initialValues.email,
        country_code: initialValues.country_code,
        phone: initialValues.phone,
        whatsapp_country_code: initialValues.whatsapp_country_code,
        whatsapp_no: initialValues.whatsapp_no,
        city: initialValues.city,
        country: initialValues.country,
        pincode: initialValues.pincode,
        business_address: initialValues.business_address,
        business_types: initialValues.business_types?.map((type) => type._id),
      });
      setIsIndiaSelected(initialValues.country === "India");
      if (initialValues.country === "India") {
        fetchCities("101");
      }
    } else {
      form.resetFields();
      setIsIndiaSelected(false);
    }
  }, [initialValues, form]);

  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const [codesResponse, countriesResponse, businessTypesResponse] =
        await Promise.all([
          http.get(`${base_url}general/countries/codes`),
          http.get(`${base_url}general/countries`),
          http.get(`${base_url}business/business-types`),
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
      if (businessTypesResponse?.data) {
        setBusinessTypes(
          businessTypesResponse.data.map((item) => ({
            label: item.name,
            value: item._id,
          }))
        );
      }
    } catch (err) {
      message.error("Failed to fetch initial data for basic details.");
    } finally {
      setFetching(false);
    }
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
    setIsIndiaSelected(value === "India");
    form.setFieldsValue({ city: undefined, pincode: undefined });
    const countryObj = countries.find((c) => c.value === value);
    if (countryObj) {
      fetchCities(countryObj.id);
    } else {
      setCities([]);
    }
  };

  const inputStyle = { width: "100%" };
  const businessTypeInputStyle = { width: 450 };

  return (
    <Spin spinning={fetching}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Business Name"
              name="business_name"
              rules={[{ required: true, message: "Business Name is required" }]}
            >
              <Input style={inputStyle} disabled={disableFields} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                style={inputStyle}
                disabled={
                  roleConstraints?.includes("email") || disableFields
                    ? true
                    : false
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
              hasFeedback
              validateStatus={usernameStatus}
              help={usernameHelp}
            >
              <Input
                style={inputStyle}
                placeholder="Username"
                onChange={(e) => debouncedCheckUsername(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col gutter={12}>
            <Form.Item
              label="Business Types"
              name="business_types"
              rules={[{ required: true, message: "Business Type is required" }]}
            >
              <Select
                mode="multiple"
                options={businessTypes}
                placeholder="Select business types"
                style={businessTypeInputStyle}
                disabled={disableFields}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  label="Country Code"
                  name="country_code"
                  rules={[
                    { required: true, message: "Country code is required" },
                  ]}
                >
                  <Select
                    showSearch
                    options={countryCodes}
                    placeholder="Code"
                    style={{ width: "100%" }}
                    // disabled={
                    //   roleConstraints?.includes("phone") || disableFields
                    //     ? true
                    //     : false
                    // }
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Phone number is required" },
                  ]}
                >
                  <Input
                    placeholder="Phone number"
                    style={{ width: "100%" }}
                    // disabled={
                    //   roleConstraints?.includes("phone") || disableFields
                    //     ? true
                    //     : false
                    // }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  label="Country Code"
                  name="whatsapp_country_code"
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
                  label="WhatsApp Number"
                  name="whatsapp_no"
                  rules={[
                    {
                      required: true,
                      message: "WhatsApp number is required",
                    },
                  ]}
                >
                  <Input
                    placeholder="WhatsApp number"
                    style={{ width: "100%" }}
                    disabled={disableFields}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
        </Row>
        {isIndiaSelected && (
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  { required: true, message: "Pincode is required" },
                  {
                    pattern: /^\d{6}$/,
                    message: "Pincode must be of 6 digits",
                  },
                ]}
                required={isIndiaSelected}
              >
                <Input
                  style={inputStyle}
                  placeholder="Enter pincode"
                  disabled={disableFields}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
        {/* <Form.Item
          label="Business Address"
          name="business_address"
          rules={[{ required: true, message: "Business address is required" }]}
        >
          <Input.TextArea style={inputStyle} disabled={disableFields} />
        </Form.Item> */}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={externalLoading || loading}
            block
            disabled={disableFields}
            style={{ width: 200 }}
          >
            Save Basic Details
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default BusinessBasicDetailsForm;
