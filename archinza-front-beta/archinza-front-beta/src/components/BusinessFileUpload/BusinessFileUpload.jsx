import Modal from "react-bootstrap/Modal";
import "./businessfileupload.scss";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Spin } from "antd";
import { useEffect, useState } from "react";
import { fileTypeFromBlob } from "file-type";
import config from "../../config/config";
import http from "../../helpers/http";
import ToastMsg from "../ToastMsg/ToastMsg";
import { toast } from "react-toastify";
import helper from "../../helpers/helper";
import { useWindowSize } from "react-use";
// import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const { Dragger } = Upload;
const base_url = config.api_url;
const aws_object_url = config.aws_object_url;

function BusinessFileUpload({
  businessContext,
  onFileUpload,
  documentMediaType,
  fileSize,
  uploadIcon,
  Upload_heading,
  fileFormat,
  showFileList = true,
  validateBeforeUpload,
  checkFileSelectionLimit,
  maxFiles,
  freeMaxFileSize,
  freeMaxFilePages,
  currentFileCount,
}) {
  const { width } = useWindowSize();
  const [media, setMedia] = useState([]); // Pre-existing files from context
  const [currentUploads, setCurrentUploads] = useState([]); // Files uploaded in current session
  const [uploading, setUploading] = useState(false);
  const [uploadBatch, setUploadBatch] = useState({ total: 0, completed: 0 });
  const [filesInitialized, setFilesInitialized] = useState(false);

  // Centralized allowed extensions based on documentMediaType
  const extensionMap = {
    workspace_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    project_renders_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    completed_products_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    sites_inprogress_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    bot_media: ["pdf", "pptx", "jpg", "png"],
    default: ["pdf", "pptx", "jpeg", "jpg", "png"],
  };
  const allowedExtensions =
    extensionMap[documentMediaType] || extensionMap.default;
  const acceptAttribute = allowedExtensions.map((ext) => `.${ext}`).join(",");
  const supportedFormatsText = allowedExtensions
    .map((ext) => ext.toUpperCase())
    .join(", ");

  const maxFileSize = freeMaxFileSize * 1024 * 1024;

  const onRemoveHandler = async (file) => {
    const isCurrentUpload = currentUploads.find((it) => it.uid === file.uid);
    const fileToBeRemoved = isCurrentUpload
      ? isCurrentUpload
      : media.find((it) => it.uid === file.uid);
    if (!isCurrentUpload) {
      await http.put(
        `${base_url}/business/business-details/${businessContext?._id}/documents`,
        { section: documentMediaType, documentId: fileToBeRemoved.uid }
      );
    }

    if (isCurrentUpload) {
      const updatedCurrentUploads = currentUploads.filter(
        (it) => it.uid !== file.uid
      );
      setCurrentUploads(updatedCurrentUploads);
      const completeUpdatedList = [...media, ...updatedCurrentUploads];
      onFileUpload(completeUpdatedList, {
        state: "removed",
        isCurrentUpload: true,
        documentMediaType,
      });
      await http.put(
        `${base_url}/business/business-details/${businessContext?._id}/documents`,
        { section: documentMediaType, documentId: fileToBeRemoved.uid }
      );
    } else {
      const updatedMedia = media.filter((it) => it.uid !== file.uid);
      setMedia(updatedMedia);
      onFileUpload(updatedMedia, { state: "removed", documentMediaType });
    }

    toast(
      <ToastMsg
        message={`${helper.truncateFileName(
          file.name,
          width >= 1200 ? 40 : 28
        )} file removed.`}
      />,
      config.success_toast_config
    );
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true);

    try {
      const detectedType = await fileTypeFromBlob(file);
      const fileExtension = detectedType
        ? detectedType.ext
        : file.name.split(".").pop().toLowerCase();

      if (!detectedType || !allowedExtensions.includes(fileExtension)) {
        toast(
          <ToastMsg
            message={`Invalid or unsupported file type. Please upload a valid file format: ${supportedFormatsText}`}
            danger={true}
          />,
          config.error_toast_config
        );
        setUploading(false);
        onError("Invalid file type");
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

      // if (fileExtension === "pdf" && freeMaxFilePages) {
      //   try {
      //     const pageCount = await getPdfPageCount(file);
      //     if (pageCount > freeMaxFilePages) {
      //       toast(
      //         <ToastMsg
      //           message={`PDF exceeds the ${freeMaxFilePages} page limit. This file has ${pageCount} pages.`}
      //           danger={true}
      //         />,
      //         config.error_toast_config
      //       );
      //       setUploading(false);
      //       onError("PDF page limit exceeded");
      //       return;
      //     }
      //   } catch (error) {
      //     console.log(error);
      //     toast(
      //       <ToastMsg
      //         message="Unable to read PDF file. Please try again."
      //         danger={true}
      //       />,
      //       config.error_toast_config
      //     );
      //     setUploading(false);
      //     onError("PDF read error");
      //     return;
      //   }
      // }

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

        // Only add to currentUploads, not to media
        setCurrentUploads((prev) => [...prev, uploadedFile]);

        // Pass only the new file to parent
        onFileUpload([uploadedFile], { state: "uploaded", documentMediaType });
        onSuccess();
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
      setUploading(false);
    }
  };

  useEffect(() => {
    if (businessContext && !filesInitialized) {
      const refinedData = businessContext?.[documentMediaType]
        ? businessContext[documentMediaType].map((it) => ({
            uid: it._id || it.uid,
            name: it.name,
            status: it.status || "done",
            url: it.uid ? it.url : `${aws_object_url}business/${it.url}`,
            mimetype: it.mimetype,
          }))
        : [];

      setMedia(refinedData);
      setFilesInitialized(true);
    }
  }, [businessContext, documentMediaType, filesInitialized]);

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
      setUploadBatch({ total: 0, completed: 0 });
    }
  }, [uploadBatch, uploading]);

  const handleBeforeUpload = (file, fileList) => {
    // Check if max file limit is reached before upload
    if (validateBeforeUpload && !validateBeforeUpload()) {
      return false;
    }

    // Check if file selection exceeds limit
    if (checkFileSelectionLimit && !checkFileSelectionLimit(fileList)) {
      return false;
    }

    // Additional check for individual file upload when using maxFiles prop
    if (maxFiles && currentFileCount !== undefined) {
      const currentTotalFiles = getUniqueFileList().length;
      if (currentTotalFiles >= maxFiles) {
        toast(
          <ToastMsg
            message={`Maximum ${maxFiles} files allowed. Please remove some files before uploading new ones.`}
            danger={true}
          />,
          config.error_toast_config
        );
        return false;
      }

      // Check if the selected batch would exceed the limit
      if (currentTotalFiles + fileList.length > maxFiles) {
        const remainingSlots = maxFiles - currentTotalFiles;
        toast(
          <ToastMsg
            message={`You can only upload ${remainingSlots} more file(s). Maximum ${maxFiles} files allowed.`}
            danger={true}
          />,
          config.error_toast_config
        );
        return false;
      }
    }

    setUploadBatch((prev) => ({
      total: fileList.length,
      completed: 0,
    }));
    return true;
  };

  // Display only unique files by combining media from context and current uploads
  const getUniqueFileList = () => {
    // Create a map of files by uid to remove duplicates
    const fileMap = new Map();

    // First add all media files
    media.forEach((file) => {
      fileMap.set(file.uid, file);
    });

    // Then add current uploads (will overwrite any duplicates)
    currentUploads.forEach((file) => {
      fileMap.set(file.uid, file);
    });

    // Convert map values back to array
    return Array.from(fileMap.values());
  };

  const displayFileList = showFileList ? getUniqueFileList() : currentUploads;

  const isUploadDisabled = () => {
    if (uploading) return true;
    if (businessContext?.media_consent_approval === true) {
      return true;
    }

    return false;
  };

  const isDeletionDisabled = () => {
    return businessContext?.media_consent_approval === true;
  };

  // New function to check if it's max files limit (not media consent)
  const isMaxFilesReached = () => {
    if (businessContext?.media_consent_approval === true) return false;
    return maxFiles && getUniqueFileList().length >= maxFiles;
  };

  return (
    <div className={`upload-wrapper ${isUploadDisabled() ? "disabled" : ""}`}>
      <Dragger
        multiple={true}
        className="customSizedUpload"
        fileList={displayFileList}
        customRequest={customRequest}
        onRemove={isDeletionDisabled() ? null : onRemoveHandler}
        accept={acceptAttribute}
        showUploadList={true}
        action=""
        disabled={isUploadDisabled()}
        beforeUpload={handleBeforeUpload}
        openFileDialogOnClick={!isUploadDisabled()}
      >
        {uploading ? (
          <div className="loading-indicator">
            <Spin size="large" />
            <p>Uploading files, please wait...</p>
          </div>
        ) : businessContext?.media_consent_approval === true ? (
          <div className="upload-disabled-message">
            <p className="ant-upload-drag-icon">
              <InboxOutlined
                className="customSizedUpload"
                style={{ color: "#ccc" }}
              />
            </p>
            <p className="ant-upload-text" style={{ color: "#999" }}>
              Media consent approved
            </p>
            <p className="ant-upload-hint" style={{ color: "#999" }}>
              Files cannot be modified unless you upgrade your plan
            </p>
          </div>
        ) : isMaxFilesReached() ? (
          <div className="upload-disabled-message">
            <p className="ant-upload-drag-icon">
              <InboxOutlined
                className="customSizedUpload"
                style={{ color: "#ccc" }}
              />
            </p>
            <p className="ant-upload-text" style={{ color: "#999" }}>
              Maximum {maxFiles} files reached
            </p>
            <p className="ant-upload-hint" style={{ color: "#999" }}>
              Remove some files to upload new ones
            </p>
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
            <p className="ant-upload-hint">
              {fileFormat
                ? fileFormat
                : `Supported file formats: ${supportedFormatsText}`}
            </p>
            <p className="ant-upload-hint">{`${
              fileSize ? fileSize : `File Size Limit ${freeMaxFileSize} MB`
            }`}</p>
          </>
        )}
      </Dragger>
    </div>
  );
}

export default BusinessFileUpload;
