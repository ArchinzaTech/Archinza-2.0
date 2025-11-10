import React, { useState, useEffect } from "react";
import {
  Input,
  Tag,
  Select,
  Modal,
  Form,
  Button,
  Tooltip,
  Typography,
} from "antd";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const DynamicOptionInput = ({
  label,
  name,
  placeholder = "Enter new option",
  initialValues = [],
  form,
  mode = "tags",
  onChange,
  withTags = false, // New prop to determine if tags are required
}) => {
  const [options, setOptions] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newOptionForm] = Form.useForm();
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    // Handle both array of strings and array of objects
    const processedValues = withTags
      ? initialValues
      : initialValues.map((value) =>
          typeof value === "string" ? value : value.value
        );
    setOptions(processedValues);

    // Extract unique tags only if withTags is true
    if (withTags) {
      const tags = [...new Set(initialValues.map((service) => service.tag))];
      setAvailableTags(tags);
    }
  }, [initialValues, withTags]);

  const handleClose = (removedOption) => {
    const newOptions = withTags
      ? options.filter((option) => option.value !== removedOption.value)
      : options.filter((option) => option !== removedOption);
    updateOptions(newOptions);
  };

  const handleSimpleInputConfirm = () => {
    if (inputValue && !options.includes(inputValue)) {
      const capitalizedValue = inputValue
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      const newOptions = [...options, capitalizedValue];
      updateOptions(newOptions);
      setInputValue("");
    }
    setInputVisible(false);
  };

  const handleTaggedInputConfirm = (values) => {
    const { optionValue, tag } = values;
    if (optionValue && !options.find((opt) => opt.value === optionValue)) {
      const capitalizedValue = optionValue
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      const newOption = {
        value: capitalizedValue,
        tag: tag,
      };

      const newOptions = [...options, newOption];
      updateOptions(newOptions);
      newOptionForm.resetFields();
    }
    setIsModalVisible(false);
    setInputVisible(false);
  };

  const updateOptions = (newOptions) => {
    setOptions(newOptions);
    form.setFieldsValue({ [name]: newOptions });
    onChange?.(newOptions);
  };

  const filteredOptions = options?.filter((option) => {
    const searchTerm = searchValue.toLowerCase();
    if (withTags) {
      return option.value.toLowerCase().includes(searchTerm);
    }
    return option?.toLowerCase()?.includes(searchTerm);
  });

  const handleNewTag = (e) => {
    const value = e.target.value.trim();
    if (value && !availableTags.includes(value)) {
      setAvailableTags((prev) => [...prev, value]);
      newOptionForm.setFieldsValue({ tag: value });
      e.target.value = "";
    }
    e.preventDefault();
  };

  const showAddModal = () => {
    if (withTags) {
      setIsModalVisible(true);
    }
    setInputVisible(true);
  };

  const renderSimpleTag = (option) => (
    <Tag
      key={option}
      closable
      color="processing"
      onClose={() => handleClose(option)}
      style={{ margin: "0 8px 8px 0" }}
    >
      {option}
    </Tag>
  );

  const renderTaggedOption = (option) => (
    <div
      key={option.value}
      style={{ display: "inline-block", marginRight: 8, marginBottom: 8 }}
    >
      <Tooltip title="Service name">
        <Tag
          closable
          color="processing"
          onClose={() => handleClose(option)}
          style={{ marginRight: 4 }}
        >
          {option.value}
        </Tag>
      </Tooltip>
      <Tooltip title="Category/Type">
        <Tag color="success" icon={<TagOutlined />}>
          {option.tag}
        </Tag>
      </Tooltip>
    </div>
  );

  const renderSimpleTagsMode = () => (
    <>
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
        {filteredOptions.map((option) => renderSimpleTag(option))}
        {inputVisible && (
          <Input
            ref={(input) => input && input.focus()}
            type="text"
            size="small"
            style={{ width: 200 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSimpleInputConfirm}
            onPressEnter={handleSimpleInputConfirm}
          />
        )}
      </div>
      {!inputVisible && (
        <Tag
          onClick={() => setInputVisible(true)}
          style={{
            background: "#fff",
            borderStyle: "dashed",
            cursor: "pointer",
          }}
        >
          <PlusOutlined /> Add Option
        </Tag>
      )}
    </>
  );

  const renderTaggedTagsMode = () => (
    <>
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: "13px" }}>
          Format: <Tag color="processing">Service Name</Tag>{" "}
          <Tag color="success" icon={<TagOutlined />}>
            Category
          </Tag>
        </Text>
      </div>
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
        {filteredOptions.map((option) => renderTaggedOption(option))}
      </div>
      <Tag
        onClick={showAddModal}
        style={{ background: "#fff", borderStyle: "dashed", cursor: "pointer" }}
      >
        <PlusOutlined /> Add Option
      </Tag>
      <Modal
        title="Add New Option"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          newOptionForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={newOptionForm}
          onFinish={handleTaggedInputConfirm}
          layout="vertical"
        >
          <Form.Item
            name="optionValue"
            label="Option Value"
            rules={[{ required: true, message: "Please enter option value" }]}
          >
            <Input placeholder="Enter option value" />
          </Form.Item>
          <Form.Item
            name="tag"
            label={
              <span>
                Tag &nbsp;
                <Tooltip title="Tags group related options together. When a user searches for an option, all options sharing the same tag will be suggested.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: "Please select or enter a tag" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select or enter tag"
              allowClear
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div style={{ padding: 8 }}>
                    <Input
                      placeholder="Enter new tag"
                      onPressEnter={handleNewTag}
                      onBlur={handleNewTag}
                    />
                  </div>
                </div>
              )}
            >
              {availableTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  newOptionForm.resetFields();
                }}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  const renderTagsMode = () =>
    withTags ? renderTaggedTagsMode() : renderSimpleTagsMode();
  const renderDropdownMode = () => (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={placeholder}
      value={withTags ? options.map((opt) => opt.value) : options}
      onChange={(values) => {
        const newOptions = withTags
          ? values.map((value) => ({
              value,
              tag: options.find((opt) => opt.value === value)?.tag || "default",
            }))
          : values;
        updateOptions(newOptions);
      }}
      onSearch={setSearchValue}
      filterOption={false}
      dropdownRender={(menu) => (
        <div>
          {menu}
          {withTags && (
            <div style={{ padding: 8 }}>
              <Button type="link" onClick={showAddModal}>
                <PlusOutlined /> Add new option with tag
              </Button>
            </div>
          )}
        </div>
      )}
    >
      {filteredOptions.map((option) => (
        <Option
          key={withTags ? option.value : option}
          value={withTags ? option.value : option}
        >
          {withTags ? (
            <>
              <span>{option.value}</span>
              <Tag color="success" style={{ marginLeft: 8 }}>
                {option.tag}
              </Tag>
            </>
          ) : (
            <span>{option}</span>
          )}
        </Option>
      ))}
    </Select>
  );

  return (
    <div>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search options"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      {mode === "tags" ? renderTagsMode() : renderDropdownMode()}
    </div>
  );
};

export default DynamicOptionInput;
