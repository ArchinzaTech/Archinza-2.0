import Modal from "react-bootstrap/Modal";
import "./businessfileuploadedit.scss";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Spin } from "antd";
import { useEffect, useState } from "react";
import config from "../../config/config";
import http from "../../helpers/http";
import ToastMsg from "../ToastMsg/ToastMsg";
import { toast } from "react-toastify";

const { Dragger } = Upload;
const base_url = config.api_url;
const aws_object_url = config.aws_object_url;

const galleryTitles = [
  { key: "project_renders_media", title: "Project Photos & Renders" },
  { key: "completed_products_media", title: "Products | Materials" },
  { key: "sites_inprogress_media", title: "Sites In Progress" },
];
function BusinessFileUploadEdit({
  businessContext,
  onFileUpload,
  documentMediaType,
  fileSize,
  uploadIcon,
  Upload_heading,
  fileFormat,
}) {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadBatch, setUploadBatch] = useState({ total: 0, completed: 0 }); // Track batch

  const allowedExtensions = ["pdf", "pptx", "jpeg", "png", "heic", "heif"];
  const acceptAttribute = allowedExtensions.map((ext) => `.${ext}`).join(",");
  const supportedFormatsText = allowedExtensions
    .map((ext) => ext.toUpperCase())
    .join(", ");

  const maxFileSize = fileSize * 1024 * 1024;
  const TOTAL_STORAGE =
    businessContext?.subscription?.plan?.features?.imagesLimit || 200;

  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true);

    // Validate file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast(
        <ToastMsg
          message={`File type .${fileExtension} is not allowed. Supported formats: ${supportedFormatsText}`}
          danger={true}
        />,
        config.error_toast_config
      );
      setUploading(false);
      onError("File type not allowed");
      return;
    }

    if (file.size > maxFileSize) {
      toast(
        <ToastMsg
          message={`File size exceeds the ${
            maxFileSize / (1024 * 1024)
          } MB limit.`}
          danger={true}
        />,
        config.error_toast_config
      );
      setUploading(false);
      onError("File size exceeds limit");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append(
        "filePageLimit",
        businessContext?.subscription?.plan?.features?.filePageLimit
      );
      const uploadData = await http.post(
        `${base_url}/business/business-details/${businessContext?._id}/upload/${documentMediaType}`,
        formData
      );

      if (uploadData) {
        if (uploadData?.data?.error === "Mimetype") {
          message.error(`Invalid File Type`);
          setUploading(false);
          onError("Invalid File Type");
          return;
        }

        const uploadedFile = {
          uid: uploadData?.data[0].slice(-1)[0]._id,
          name: file.name,
          status: "done",
          url: `${aws_object_url}business/${
            uploadData?.data[0].slice(-1)[0].url
          }`,
        };

        setMedia((prevMedia) => [...prevMedia, uploadedFile]);
        onFileUpload([uploadedFile], { state: "uploaded" });
        onSuccess();

        // Update batch completion
        setUploadBatch((prev) => ({
          ...prev,
          completed: prev.completed + 1,
        }));
      }
    } catch (error) {
      toast(
        <ToastMsg
          message={`File upload failed: ${error.message}`}
          danger={true}
        />,
        config.error_toast_config
      );
      onError(error);
    } finally {
      if (!uploading) {
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    if (businessContext[documentMediaType]) {
      const refinedData = businessContext[documentMediaType].map((it) => ({
        uid: it._id || it.uid,
        name: it.name,
        status: it.status,
        url: it.uid ? it.url : `${aws_object_url}business/${it.url}`,
        mimetype: it.mimetype,
      }));
      setMedia(refinedData);
    }
  }, [businessContext]);

  // Handle toast for batch completion
  useEffect(() => {
    if (
      uploadBatch.total > 0 &&
      uploadBatch.completed === uploadBatch.total &&
      !uploading
    ) {
      const uploadCount = uploadBatch.total;
      toast(
        <ToastMsg
          message={
            uploadCount > 1
              ? "Files uploaded successfully"
              : "File uploaded successfully"
          }
        />,
        config.success_toast_config
      );
      // Reset batch
      setUploadBatch({ total: 0, completed: 0 });
    }
  }, [uploadBatch, uploading]);

  // Set total files in batch when upload starts
  const handleBeforeUpload = (file, fileList) => {
    const totalImages = galleryTitles.reduce((sum, { key }) => {
      return sum + (businessContext[key]?.length || 0);
    }, 0);

    // Check if adding new images exceeds TOTAL_STORAGE
    if (totalImages + fileList.length > TOTAL_STORAGE) {
      toast(
        <ToastMsg
          message={`Cannot upload files. Storage limit of ${TOTAL_STORAGE} images reached. Please upgrade your plan.`}
          danger={true}
        />,
        config.error_toast_config
      );
      return false; // Prevent upload
    }

    const fileUploadLimit =
      businessContext?.subscription?.plan?.features?.fileUploadLimit || 5;
    const fileUploadLimitTypes = [
      "company_profile_media",
      "product_catalogues_media",
    ];
    const combinedTotal = fileUploadLimitTypes.reduce((sum, type) => {
      return sum + (businessContext[type]?.length || 0);
    }, 0);
    if (fileUploadLimitTypes.includes(documentMediaType)) {
      if (combinedTotal + fileList.length > fileUploadLimit) {
        toast(
          <ToastMsg
            message={`Cannot upload files. File upload limit of ${fileUploadLimit} files reached. Please upgrade your plan.`}
            danger={true}
          />,
          config.error_toast_config
        );
        return false; // Prevent upload
      }
    }
    setUploadBatch((prev) => ({
      total: fileList.length,
      completed: 0,
    }));
    return true;
  };

  return (
    <Dragger
      multiple={true}
      className="customSizedUpload"
      customRequest={customRequest}
      accept={acceptAttribute}
      disabled={uploading}
      showUploadList={false}
      action=""
      beforeUpload={handleBeforeUpload} // Add beforeUpload to set batch total
    >
      {uploading ? (
        <div className="loading-indicator">
          <Spin size="large" />
          <p>Uploading files, please wait...</p>
        </div>
      ) : (
        <>
          <p className="ant-upload-drag-icon">
            {uploadIcon ? (
              <img src={uploadIcon} alt="Icon" className="upload_icon" />
            ) : (
              <InboxOutlined
                className="customSizedUpload"
                style={{ color: "#f77b00" }}
              />
            )}
          </p>
          <p className="ant-upload-text">
            {Upload_heading
              ? Upload_heading
              : "Click or drag file to this area to upload"}
          </p>
        </>
      )}
    </Dragger>
  );
}

export default BusinessFileUploadEdit;
