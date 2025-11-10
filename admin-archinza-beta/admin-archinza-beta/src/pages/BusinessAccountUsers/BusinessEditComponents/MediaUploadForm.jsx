import React, { useState, useEffect } from "react";
import {
  Form,
  Upload,
  Button,
  message,
  Modal,
  List,
  Image,
  Row,
  Col,
  Space,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import http from "../../../helpers/http";
import config from "../../../config/config";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/svg+xml",
];

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "application/vnd.ms-powerpoint", // PPT
  "image/jpeg",
  "image/png",
];

const MediaUploadsForm = ({
  form,
  initialData,
  userId,
  mode = "edit",
  onSubmit,
  admin,
}) => {
  const [uploading, setUploading] = useState(false);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [roleConstraints, setRoleConstraints] = useState([]);
  const [companyProfileFiles, setCompanyProfileFiles] = useState(
    initialData.company_profile_media?.map((file) => ({
      uid: file.url,
      name: file.name,
      url: `${config.aws_object_url}/business/${file.url}`,
      _id: file._id,
      status: "done",
    })) || []
  );
  const [productCataloguesFiles, setProductCataloguesFiles] = useState(
    initialData.product_catalogues_media?.map((file) => ({
      uid: file.url,
      name: file.name,
      url: `${config.aws_object_url}/business/${file.url}`,
      _id: file._id,
      status: "done",
    })) || []
  );

  const [completedProductsFiles, setCompletedProductsFiles] = useState(
    initialData.completed_products_media?.map((file) => ({
      uid: file.url,
      name: file.name,
      url: `${config.aws_object_url}/business/${file.url}`,
      _id: file._id,
      status: "done",
    })) || []
  );
  const [projectRendersFiles, setProjectRendersFiles] = useState(
    initialData.project_renders_media?.map((file) => ({
      uid: file.url,
      name: file.name,
      url: `${config.aws_object_url}/business/${file.url}`,
      _id: file._id,
      status: "done",
    })) || []
  );
  const [sitesInProgressFiles, setSitesInProgressFiles] = useState(
    initialData.sites_inprogress_media?.map((file) => ({
      uid: file.url,
      name: file.name,
      url: `${config.aws_object_url}/business/${file.url}`,
      _id: file._id,
      status: "done",
    })) || []
  );
  const [eliminateFiles, setEliminateMediaFiles] = useState(
    initialData.eliminate_media?.map((file) => ({
      uid: file.url,
      name: file.name,
      url: `${config.aws_object_url}/business/${file.url}`,
      _id: file._id,
      status: "done",
    })) || []
  );
  const base_url = config.api_url;
  const aws_object_url = config.aws_object_url;

  // Sync initialData changes to local state
  useEffect(() => {
    if (mode === "edit") {
      setCompanyProfileFiles(
        initialData.company_profile_media?.map((file) => ({
          uid: file.url,
          name: file.name,
          url: `${aws_object_url}/business/${file.url}`,
          _id: file._id,
          status: "done",
        })) || []
      );
      setProductCataloguesFiles(
        initialData.product_catalogues_media?.map((file) => ({
          uid: file.url,
          name: file.name,
          url: `${aws_object_url}/business/${file.url}`,
          _id: file._id,
          status: "done",
        })) || []
      );
      setCompletedProductsFiles(
        initialData.completed_products_media?.map((file) => ({
          uid: file.url,
          name: file.name,
          url: `${aws_object_url}/business/${file.url}`,
          _id: file._id,
          status: "done",
        })) || []
      );
      setProjectRendersFiles(
        initialData.project_renders_media?.map((file) => ({
          uid: file.url,
          name: file.name,
          url: `${aws_object_url}/business/${file.url}`,
          _id: file._id,
          status: "done",
        })) || []
      );
      setSitesInProgressFiles(
        initialData.sites_inprogress_media?.map((file) => ({
          uid: file.url,
          name: file.name,
          url: `${aws_object_url}/business/${file.url}`,
          _id: file._id,
          status: "done",
        })) || []
      );
      setEliminateMediaFiles(
        initialData.eliminate_media?.map((file) => ({
          uid: file.url,
          name: file.name,
          url: `${aws_object_url}/business/${file.url}`,
          _id: file._id,
          status: "done",
        })) || []
      );
    } else if (mode === "create") {
      setCompanyProfileFiles([]);
      setProductCataloguesFiles([]);
      setCompletedProductsFiles([]);
      setProjectRendersFiles([]);
      setSitesInProgressFiles([]);
      setEliminateMediaFiles([]);
    }
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
  }, [initialData, aws_object_url, mode]);

  // File validation rules
  const beforeUpload = (file) => {
    const isDocumentCategory = [
      "company_profile_media",
      "product_catalogues_media",
    ].includes(selectedCategory);

    const allowedTypes = isDocumentCategory
      ? ALLOWED_DOCUMENT_TYPES
      : ALLOWED_IMAGE_TYPES;

    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(
        `You can only upload ${
          isDocumentCategory
            ? "PDF, PPT, JPG, PNG"
            : "JPG, PNG, WEBP, HEIC, HEIF, SVG"
        } files!`
      );
      return Upload.LIST_IGNORE;
    }

    const maxSize = 30 * 1024 * 1024; // 30MB
    const isLessThan30MB = file.size <= maxSize;
    if (!isLessThan30MB) {
      message.error("File must be smaller than 30MB!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (file, fieldName) => {
    let title = "";
    if (
      selectedCategory === "product_catalogues_media" ||
      selectedCategory === "company_profile_media"
    ) {
      title = "document";
    } else {
      title = "image";
    }
    Modal.confirm({
      title: `Are you sure you want to delete this ${title}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDeleteFile(file, fieldName),
    });
  };

  // Delete file API call
  const handleDeleteFile = async (file, fieldName) => {
    let updatedFiles;
    let setter;

    switch (fieldName) {
      case "company_profile_media":
        updatedFiles = companyProfileFiles.filter((f) => f.uid !== file.uid);
        setter = setCompanyProfileFiles;
        break;
      case "product_catalogues_media":
        updatedFiles = productCataloguesFiles.filter((f) => f.uid !== file.uid);
        setter = setProductCataloguesFiles;
        break;
      case "completed_products_media":
        updatedFiles = completedProductsFiles.filter((f) => f.uid !== file.uid);
        setter = setCompletedProductsFiles;
        break;
      case "project_renders_media":
        updatedFiles = projectRendersFiles.filter((f) => f.uid !== file.uid);
        setter = setProjectRendersFiles;
        break;
      case "sites_inprogress_media":
        updatedFiles = sitesInProgressFiles.filter((f) => f.uid !== file.uid);
        setter = setSitesInProgressFiles;
        break;
      case "eliminate_media":
        updatedFiles = eliminateFiles.filter((f) => f.uid !== file.uid);
        setter = setEliminateMediaFiles;
        break;
      default:
        return;
    }

    setter(updatedFiles);

    if (mode === "create") {
      // For create mode, just update the local state and let the parent handle the final submission
      onSubmit({ ...initialData, [fieldName]: updatedFiles });
      return;
    }

    // For edit mode, make the API call
    if (!file._id && !file.url) {
      // If file hasn't been uploaded yet, just update form and parent
      form.setFieldsValue({ [fieldName]: updatedFiles });
      return;
    }

    // Call delete API
    await http.delete(`${base_url}admin/business-users/media/${file.name}`);
    message.success("File deleted successfully");
    form.setFieldsValue({ [fieldName]: updatedFiles });
    if (onSubmit) {
      // In case of edit, if there's an onSubmit, notify it
      onSubmit({ ...initialData, [fieldName]: updatedFiles });
    }
  };

  // Upload files for a category
  const uploadFiles = async (category) => {
    if (!userId) {
      message.error("User ID is required for uploading files");
      return;
    }

    setUploading(true);
    let filesToUpload;
    let fieldName;
    let setter;

    switch (category) {
      case "company_profile_media":
        filesToUpload = companyProfileFiles;
        fieldName = "company_profile_media";
        setter = setCompanyProfileFiles;
        break;
      case "product_catalogues_media":
        filesToUpload = productCataloguesFiles;
        fieldName = "product_catalogues_media";
        setter = setProductCataloguesFiles;
        break;
      case "completed_products_media":
        filesToUpload = completedProductsFiles;
        fieldName = "completed_products_media";
        setter = setCompletedProductsFiles;
        break;
      case "project_renders_media":
        filesToUpload = projectRendersFiles;
        fieldName = "project_renders_media";
        setter = setProjectRendersFiles;
        break;
      case "eliminate_media":
        filesToUpload = eliminateFiles;
        fieldName = "eliminate_media";
        setter = setEliminateMediaFiles;
        break;
      case "sites_inprogress_media":
        filesToUpload = sitesInProgressFiles;
        fieldName = "sites_inprogress_media";
        setter = setSitesInProgressFiles;
        break;
      default:
        setUploading(false);
        return;
    }

    const newFiles = filesToUpload.filter((file) => file.originFileObj);
    if (newFiles.length === 0) {
      message.info("No new files to upload");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    newFiles.forEach((file) => {
      formData.append(fieldName, file.originFileObj);
    });

    const response = await http.post(
      `${base_url}admin/business-users/${userId}/upload-multiple`,
      formData
    );

    let updatedFiles = filesToUpload.filter((file) => !file.originFileObj);
    if (response.data?.[fieldName]) {
      const newUploadedFiles = response.data[fieldName].map((file) => ({
        uid: file._id || file.url,
        name: file.name,
        url: `${aws_object_url}/business/${file.url}`,
        _id: file._id,
        status: "done",
      }));
      updatedFiles.push(...newUploadedFiles);
    }

    setter(updatedFiles);
    form.setFieldsValue({ [fieldName]: updatedFiles });

    message.success("Files uploaded successfully");
    setUploading(false);
    if (onSubmit) {
      // If there's an onSubmit, notify it of the updated data
      onSubmit({ ...initialData, [fieldName]: updatedFiles });
    }
  };

  const handleFileChange = (category, { fileList }) => {
    let setter;
    let currentFiles;

    switch (category) {
      case "company_profile_media":
        setter = setCompanyProfileFiles;
        currentFiles = companyProfileFiles;
        break;
      case "product_catalogues_media":
        setter = setProductCataloguesFiles;
        currentFiles = productCataloguesFiles;
        break;
      case "completed_products_media":
        setter = setCompletedProductsFiles;
        currentFiles = completedProductsFiles;
        break;
      case "project_renders_media":
        setter = setProjectRendersFiles;
        currentFiles = projectRendersFiles;
        break;
      case "sites_inprogress_media":
        setter = setSitesInProgressFiles;
        currentFiles = sitesInProgressFiles;
        break;
      case "eliminate_media":
        setter = setEliminateMediaFiles;
        currentFiles = eliminateFiles;
        break;
      default:
        return;
    }

    // Filter out only the new files (with originFileObj) that are not already in currentFiles by uid
    const existingUids = new Set(currentFiles.map((f) => f.uid));
    const newFiles = fileList.filter(
      (file) => file.originFileObj && !existingUids.has(file.uid)
    );

    // Format the new files
    const formattedNewFiles = newFiles.map((file) => ({
      uid: file.uid,
      name: file.name,
      url: file.originFileObj
        ? URL.createObjectURL(file.originFileObj)
        : file.url || undefined,
      status: file.status,
      originFileObj: file.originFileObj,
    }));

    // Place new files before existing files that are already uploaded (no originFileObj)
    const alreadyUploadedFiles = currentFiles.filter((f) => !f.originFileObj);
    const updatedFiles = [...formattedNewFiles, ...alreadyUploadedFiles];

    setter(updatedFiles);
    form.setFieldsValue({ [category]: updatedFiles });

    if (mode === "create") {
      // For create mode, pass the updated files to the parent
      onSubmit({ ...initialData, [category]: updatedFiles });
    }
  };

  useEffect(() => {
    const event = new CustomEvent("mediaTabActive", { detail: true });
    window.dispatchEvent(event);
    return () => {
      const resetEvent = new CustomEvent("mediaTabActive", { detail: false });
      window.dispatchEvent(resetEvent);
    };
  }, []);

  const businessDocumentCategories = [
    {
      key: "company_profile_media",
      title: "Company Profile (PDF, PPT, Images)",
      files: companyProfileFiles,
      allowedFormats: "PDF, PPT, JPG, PNG",
    },
    {
      key: "product_catalogues_media",
      title: "Product Catalogues (PDF, PPT, Images)",
      files: productCataloguesFiles,
      allowedFormats: "PDF, PPT, JPG, PNG",
    },
  ];

  const galleryCategories = [
    {
      key: "completed_products_media",
      title: "Completed Products",
      files: completedProductsFiles,
      allowedFormats: "JPG, PNG, WEBP, HEIC, HEIF, SVG",
    },
    {
      key: "project_renders_media",
      title: "Project Renders",
      files: projectRendersFiles,
      allowedFormats: "JPG, PNG, WEBP, HEIC, HEIF, SVG",
    },
    {
      key: "sites_inprogress_media",
      title: "Sites In Progress",
      files: sitesInProgressFiles,
      allowedFormats: "JPG, PNG, WEBP, HEIC, HEIF, SVG",
    },
    {
      key: "eliminate_media",
      title: "Eliminate Media",
      files: eliminateFiles,
      allowedFormats: "JPG, PNG, WEBP, HEIC, HEIF, SVG",
    },
  ];

  const getFilePreview = (file) => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    if (isImage) {
      return (
        <Image
          src={file.url || file.thumbUrl}
          alt={file.name}
          style={{ width: "100%", height: "auto" }}
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <object
          data={file.url || file.thumbUrl}
          type="application/pdf"
          width="100%"
          height="200px"
        ></object>
      );
    } else {
      return (
        <div
          style={{
            width: "100%",
            height: "auto",
            padding: 16,
            border: "1px dashed #d9d9d9",
            textAlign: "center",
          }}
        >
          {file.name}
        </div>
      );
    }
  };

  return (
    <div>
      {/* Business Documents Section */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16 }}>Business Documents</h3>
        <List
          dataSource={businessDocumentCategories}
          renderItem={(category) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedCategory(category.key);
                    setGalleryModalVisible(true);
                  }}
                >
                  View Documents
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`${category.title} (${category.files.length} files)`}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Gallery Images Section */}
      <div>
        <h3 style={{ marginBottom: 16 }}>Gallery Images</h3>
        <List
          dataSource={galleryCategories}
          renderItem={(category) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedCategory(category.key);
                    setGalleryModalVisible(true);
                  }}
                >
                  View Gallery
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`${category.title} (${category.files.length} images)`}
              />
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={
          [...businessDocumentCategories, ...galleryCategories].find(
            (c) => c.key === selectedCategory
          )?.title || "Files"
        }
        visible={galleryModalVisible}
        onCancel={() => setGalleryModalVisible(false)}
        footer={null}
        width={800}
      >
        {/* Upload section */}
        <div style={{ marginBottom: 20 }}>
          <Space size="middle" align="start">
            <Upload
              beforeUpload={(file) => beforeUpload(file, selectedCategory)}
              onChange={(info) => handleFileChange(selectedCategory, info)}
              multiple
              showUploadList={false}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
            >
              <Tooltip
                title={
                  roleConstraints?.includes("company_profile_media") &&
                  (selectedCategory === "company_profile_media" ||
                    selectedCategory === "product_catalogues_media")
                    ? "This button is locked due to role restrictions"
                    : ""
                }
              >
                <Button
                  icon={<UploadOutlined />}
                  size="large"
                  disabled={
                    roleConstraints?.includes("company_profile_media") &&
                    (selectedCategory === "company_profile_media" ||
                      selectedCategory === "product_catalogues_media")
                      ? true
                      : false
                  }
                >
                  {selectedCategory === "company_profile_media" ||
                  selectedCategory === "product_catalogues_media"
                    ? "Select Files"
                    : "Select Images"}
                </Button>
              </Tooltip>
            </Upload>
            <div>
              <p style={{ marginBottom: 0, fontWeight: "bold" }}>
                Allowed formats:
              </p>
              <p style={{ marginBottom: 0, color: "#888" }}>
                {selectedCategory === "company_profile_media" ||
                selectedCategory === "product_catalogues_media"
                  ? "PDF, PPT, PPTX, JPG, PNG (Max: 200MB)"
                  : "JPG, PNG, WEBP, HEIC, HEIF, SVG (Max: 200MB)"}
              </p>
            </div>
            <Button
              type="primary"
              loading={uploading}
              onClick={() => uploadFiles(selectedCategory)}
            >
              {selectedCategory === "company_profile_media" ||
              selectedCategory === "product_catalogues_media"
                ? "Upload Files"
                : "Upload Images"}
            </Button>
          </Space>
        </div>

        {/* Files display */}
        {selectedCategory === "company_profile_media" ||
        selectedCategory === "product_catalogues_media" ? (
          // Document list view
          <List
            dataSource={
              selectedCategory === "company_profile_media"
                ? companyProfileFiles
                : productCataloguesFiles
            }
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Button>,
                  <Tooltip
                    title={
                      roleConstraints?.includes("company_profile_media")
                        ? "This button is locked due to role restrictions"
                        : ""
                    }
                  >
                    <Button
                      type="text"
                      disabled={
                        roleConstraints?.includes("company_profile_media")
                          ? true
                          : false
                      }
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        showDeleteConfirmation(file, selectedCategory)
                      }
                      danger
                    />
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  title={file.name}
                  description={`File ID: ${file._id || "New file"}`}
                />
              </List.Item>
            )}
          />
        ) : (
          // Image gallery view (existing code)
          <Row gutter={[16, 16]}>
            {(selectedCategory === "completed_products_media" ||
            selectedCategory === "project_renders_media" ||
            selectedCategory === "sites_inprogress_media" ||
            selectedCategory === "eliminate_media"
              ? galleryCategories.find((c) => c.key === selectedCategory)
                  ?.files || []
              : []
            ).map((file) => (
              <Col span={8} key={file.uid}>
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  {getFilePreview(file)}
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      showDeleteConfirmation(file, selectedCategory)
                    }
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default MediaUploadsForm;
