import React, { useEffect, useState } from "react";
import { Form, Input, Select, Row, Col, Spin, message } from "antd";
import http from "../../../helpers/http";
import config from "../../../config/config";
import _ from "lodash";

const BasicDetailsForm = ({ form, initialData }) => {
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isIndiaSelected, setIsIndiaSelected] = useState(false);
  const base_url = config.api_url;

  // Fetch all data concurrently
  const fetchInitialData = async () => {
    const [codesResponse, countriesResponse, citiesResponse] =
      await Promise.all([
        http.get(`${base_url}general/countries/codes`),
        http.get(`${base_url}general/countries`),
        http.get(`${base_url}general/cities-by-country/101`),
      ]);

    if (codesResponse?.data) {
      setCountryCodes(
        codesResponse.data.map((item, index) => ({
          key: `${item.phone_code}-${index}`, // Unique key for each option
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
          value: item.id,
        }))
      );
    }

    if (citiesResponse?.data) {
      setCities(
        citiesResponse.data.map((item) => ({
          key: item.id,
          label: item.name,
          value: item.id,
        }))
      );
    }
  };

  // Debounced username check
  const checkUsername = _.debounce(
    async (username) => {
      if (!username) {
        setUsernameStatus("");
        setUsernameMessage("");
        return;
      }

      setCheckingUsername(true);
      try {
        const { data } = await http.post(
          `${base_url}admin/business-users/check-username`,
          {
            username: username,
            id: initialData._id,
          }
        );
        if (data.available || username === initialData.username) {
          setUsernameStatus("success");
          setUsernameMessage("Username is available");
        } else {
          setUsernameStatus("error");
          setUsernameMessage("This username is already taken");
        }
      } catch (error) {
        setUsernameStatus("error");
        setUsernameMessage("Failed to check username");
      } finally {
        setCheckingUsername(false);
      }
    },
    1000,
    { leading: false, trailing: true }
  );

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setUsernameStatus("validating");
    checkUsername.cancel();
    checkUsername(username);
  };

  const handleCountryChange = (value) => {
    const country = countries.find((c) => c.value === value);
    setSelectedCountry(country?.label);
    setIsIndiaSelected(country?.label === "India");
    form.setFieldsValue({ city: undefined });
  };

  // Initialize data
  useEffect(() => {
    fetchInitialData();
    if (initialData.country === "India") {
      setIsIndiaSelected(true);
    }
  }, []);

  // Common input style
  const inputStyle = { width: 500 };

  return (
    <Spin spinning={checkingUsername}>
      <Form.Item
        name="business_name"
        label="Business Name"
        rules={[{ required: true, message: "Business Name is required" }]}
      >
        <Input style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="bio"
        label="Bio"
        rules={[{ max: 500, message: "Bio cannot exceed 500 characters" }]}
      >
        <Input.TextArea rows={4} style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Invalid email format" },
        ]}
      >
        <Input style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        validateStatus={usernameStatus}
        help={
          <span
            style={{ color: usernameStatus === "success" ? "green" : "red" }}
          >
            {usernameMessage}
          </span>
        }
        rules={[{ required: true, message: "Username is required" }]}
      >
        <Input onChange={handleUsernameChange} style={inputStyle} />
      </Form.Item>
      <Form.Item label="Phone" required>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="country_code"
              noStyle
              rules={[{ required: true, message: "Country code is required" }]}
            >
              <Select
                showSearch
                options={countryCodes}
                placeholder="Code"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="phone"
              noStyle
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input placeholder="Phone number" style={{ width: 250 }} />
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
              rules={[{ required: true, message: "Country code is required" }]}
            >
              <Select
                showSearch
                options={countryCodes}
                placeholder="Code"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="whatsapp_no"
              noStyle
              rules={[
                { required: true, message: "WhatsApp number is required" },
              ]}
            >
              <Input placeholder="WhatsApp number" style={{ width: 250 }} />
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
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
        rules={[
          {
            required: isIndiaSelected,
            message: "City is required for India",
          },
        ]}
        required={isIndiaSelected}
      >
        <Select
          showSearch
          options={cities}
          placeholder="Select city"
          style={inputStyle}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          disabled={!isIndiaSelected}
        />
      </Form.Item>
      <Form.Item
        name="pincode"
        label="Pincode"
        rules={[
          { required: isIndiaSelected, message: "Pincode is required" },
          { pattern: /^\d{6}$/, message: "Pincode must be of 6 digits" },
        ]}
        required={isIndiaSelected}
      >
        <Input
          style={inputStyle}
          disabled={!isIndiaSelected}
          placeholder="Enter pincode"
        />
      </Form.Item>
    </Spin>
  );
};

export default BasicDetailsForm;
