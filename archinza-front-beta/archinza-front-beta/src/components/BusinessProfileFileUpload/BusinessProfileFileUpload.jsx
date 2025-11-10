// import Modal from "react-bootstrap/Modal";
// import "./businessprofilefileupload.scss";
// import { InboxOutlined } from "@ant-design/icons";
// import { message, Upload, Spin } from "antd";
// import { useEffect, useState } from "react";
// import config from "../../config/config";
// import http from "../../helpers/http";
// import ToastMsg from "../ToastMsg/ToastMsg";
// import { toast } from "react-toastify";
// import helper from "../../helpers/helper";

// const { Dragger } = Upload;
// const base_url = config.api_url;
// const aws_object_url = config.aws_object_url;

// function BusinessProfileFileUpload({
//   businessContext,
//   onFileUpload,
//   documentMediaType,
//   fileSize,
//   uploadIcon,
//   Upload_heading,
//   fileFormat,
//   showFileList = true,
// }) {
//   const [media, setMedia] = useState([]); // Pre-existing files
//   const [currentUploads, setCurrentUploads] = useState([]); // Files uploaded in current session
//   const [uploading, setUploading] = useState(false);
//   const [uploadBatch, setUploadBatch] = useState({ total: 0, completed: 0 });

//   // Centralized allowed extensions based on documentMediaType
//   const extensionMap = {
//     workspace_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
//     project_renders_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
//     completed_products_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
//     sites_inprogress_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
//     default: ["pdf", "ppt", "jpeg", "png"],
//   };
//   const allowedExtensions =
//     extensionMap[documentMediaType] || extensionMap.default;
//   const acceptAttribute = allowedExtensions.map((ext) => `.${ext}`).join(",");
//   const supportedFormatsText = allowedExtensions
//     .map((ext) => ext.toUpperCase())
//     .join(", ");

//   const maxFileSize = fileSize * 1024 * 1024;

//   const onRemoveHandler = async (file) => {
//     const isCurrentUpload = currentUploads.find((it) => it.uid === file.uid);
//     const fileToBeRemoved = isCurrentUpload
//       ? isCurrentUpload
//       : media.find((it) => it.uid === file.uid);

//     if (!isCurrentUpload) {
//       await http.put(
//         `${base_url}/business/business-details/${businessContext?._id}/documents`,
//         { section: documentMediaType, documentId: fileToBeRemoved.uid }
//       );
//     }

//     if (isCurrentUpload) {
//       const updatedCurrentUploads = currentUploads.filter(
//         (it) => it.uid !== file.uid
//       );
//       setCurrentUploads(updatedCurrentUploads);
//       onFileUpload(updatedCurrentUploads, {
//         state: "removed",
//         documentMediaType,
//       });
//     } else {
//       const updatedMedia = media.filter((it) => it.uid !== file.uid);
//       setMedia(updatedMedia);
//       onFileUpload(updatedMedia, { state: "removed", documentMediaType });
//     }

//     toast(
//       <ToastMsg
//         message={`${helper.truncateFileName(file.name)} file removed.`}
//       />,
//       config.success_toast_config
//     );
//   };

//   const customRequest = async ({ file, onSuccess, onError }) => {
//     setUploading(true);

//     const fileExtension = file.name.split(".").pop().toLowerCase();
//     if (!allowedExtensions.includes(fileExtension)) {
//       toast(
//         <ToastMsg
//           message={`File type .${fileExtension} is not allowed. Supported formats: ${supportedFormatsText}`}
//           danger={true}
//         />,
//         config.error_toast_config
//       );
//       setUploading(false);
//       onError("File type not allowed");
//       return;
//     }

//     if (file.size > maxFileSize) {
//       toast(
//         <ToastMsg
//           message={`File size exceeds the ${
//             maxFileSize / (1024 * 1024)
//           } MB limit.`}
//           danger={true}
//         />,
//         config.error_toast_config
//       );
//       setUploading(false);
//       onError("File size exceeds limit");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("files", file);
//       const uploadData = await http.post(
//         `${base_url}/business/business-details/${businessContext?._id}/upload/${documentMediaType}`,
//         formData
//       );

//       if (uploadData) {
//         if (uploadData?.data?.error === "Mimetype") {
//           message.error(`Invalid File Type`);
//           setUploading(false);
//           onError("Invalid File Type");
//           return;
//         }

//         const uploadedFile = {
//           uid: uploadData?.data[0].slice(-1)[0]._id,
//           name: file.name,
//           status: "done",
//           url: `${aws_object_url}business/${
//             uploadData?.data[0].slice(-1)[0].url
//           }`,
//         };

//         setCurrentUploads((prev) => [...prev, uploadedFile]);
//         if (showFileList) {
//           setMedia((prevMedia) => [...prevMedia, uploadedFile]);
//         }

//         onFileUpload([uploadedFile], { state: "uploaded", documentMediaType });
//         onSuccess();
//         setUploadBatch((prev) => ({
//           ...prev,
//           completed: prev.completed + 1,
//         }));
//       }
//     } catch (error) {
//       toast(
//         <ToastMsg
//           message={`File upload failed: ${error.message}`}
//           danger={true}
//         />,
//         config.error_toast_config
//       );
//       onError(error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   useEffect(() => {
//     if (businessContext) {
//       const refinedData = businessContext?.[documentMediaType]
//         ? businessContext[documentMediaType].map((it) => ({
//             uid: it._id || it.uid,
//             name: it.name,
//             status: it.status || "done",
//             url: it.uid ? it.url : `${aws_object_url}business/${it.url}`,
//             mimetype: it.mimetype,
//           }))
//         : [];
//       setMedia(refinedData);
//       // Do NOT reset currentUploads here to preserve uploaded files
//     }
//   }, [businessContext, documentMediaType]);

//   useEffect(() => {
//     if (
//       uploadBatch.total > 0 &&
//       uploadBatch.completed === uploadBatch.total &&
//       !uploading
//     ) {
//       const uploadCount = uploadBatch.total;
//       toast(
//         <ToastMsg
//           message={
//             uploadCount > 1
//               ? "Files uploaded successfully"
//               : "File uploaded successfully"
//           }
//         />,
//         config.success_toast_config
//       );
//       setUploadBatch({ total: 0, completed: 0 });
//     }
//   }, [uploadBatch, uploading]);

//   const handleBeforeUpload = (file, fileList) => {
//     setUploadBatch((prev) => ({
//       total: fileList.length,
//       completed: 0,
//     }));
//     return true;
//   };

//   const displayFileList = showFileList
//     ? [...media, ...currentUploads]
//     : currentUploads;

//   return (
//     <Dragger
//       multiple={true}
//       className="customSizedUpload"
//       fileList={displayFileList}
//       customRequest={customRequest}
//       onRemove={onRemoveHandler}
//       accept={acceptAttribute}
//       showUploadList={true}
//       action=""
//       disabled={uploading}
//       beforeUpload={handleBeforeUpload}
//     >
//       {uploading ? (
//         <div className="loading-indicator">
//           <Spin size="large" />
//           <p>Uploading files, please wait...</p>
//         </div>
//       ) : (
//         <>
//           <p className="ant-upload-drag-icon">
//             {uploadIcon ? (
//               <img src={uploadIcon} alt="Icon" className="upload_icon" />
//             ) : (
//               <InboxOutlined
//                 className="customSizedUpload"
//                 style={{ color: "#f77b00" }}
//               />
//             )}
//           </p>
//           <p className="ant-upload-text">
//             {Upload_heading
//               ? Upload_heading
//               : "Click or drag file to this area to upload"}
//           </p>
//           <p className="ant-upload-hint">
//             {fileFormat
//               ? fileFormat
//               : `Supported file formats: ${supportedFormatsText}`}
//           </p>
//           <p className="ant-upload-hint">{`${
//             fileSize
//               ? `File Size Limit ${fileSize} MB`
//               : `File Size Limit 100 MB`
//           }`}</p>
//         </>
//       )}
//     </Dragger>
//   );
// }

// export default BusinessProfileFileUpload;

import Modal from "react-bootstrap/Modal";
import "./businessprofilefileupload.scss";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Spin } from "antd";
import { useEffect, useState } from "react";
import config from "../../config/config";
import http from "../../helpers/http";
import ToastMsg from "../ToastMsg/ToastMsg";
import { toast } from "react-toastify";
import helper from "../../helpers/helper";

// Define galleryTitles
const galleryTitles = [
  { key: "project_renders_media", title: "Project Photos & Renders" },
  { key: "completed_products_media", title: "Products | Materials" },
  { key: "sites_inprogress_media", title: "Sites In Progress" },
];

const { Dragger } = Upload;
const base_url = config.api_url;
const aws_object_url = config.aws_object_url;

function BusinessProfileFileUpload({
  businessContext,
  onFileUpload,
  documentMediaType,
  fileSize,
  uploadIcon,
  Upload_heading,
  fileFormat,
  showFileList = true,
}) {
  const [media, setMedia] = useState([]);
  const [currentUploads, setCurrentUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadBatch, setUploadBatch] = useState({ total: 0, completed: 0 });

  // Centralized allowed extensions based on documentMediaType
  const extensionMap = {
    workspace_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    project_renders_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    completed_products_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    sites_inprogress_media: ["jpeg", "jpg", "png", "heic", "heif", "webp"],
    default: ["pdf", "pptx", "jpeg", "png"],
  };
  const allowedExtensions =
    extensionMap[documentMediaType] || extensionMap.default;
  const acceptAttribute = allowedExtensions.map((ext) => `.${ext}`).join(",");
  const supportedFormatsText = allowedExtensions
    .map((ext) => ext.toUpperCase())
    .join(", ");

  const maxFileSize = fileSize * 1024 * 1024;
  const TOTAL_STORAGE =
    businessContext?.subscription?.plan?.features?.imagesLimit || 200;

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
      await http.put(
        `${base_url}/business/business-details/${businessContext?._id}/documents`,
        { section: documentMediaType, documentId: fileToBeRemoved.uid }
      );
      const updatedCurrentUploads = currentUploads.filter(
        (it) => it.uid !== file.uid
      );
      setCurrentUploads(updatedCurrentUploads);
      onFileUpload(updatedCurrentUploads, {
        state: "removed",
        documentMediaType,
      });
    } else {
      const updatedMedia = media.filter((it) => it.uid !== file.uid);
      setMedia(updatedMedia);
      onFileUpload(updatedMedia, { state: "removed", documentMediaType });
    }

    toast(
      <ToastMsg message={`${file.name} file removed.`} />,
      config.success_toast_config
    );
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true);
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

        setCurrentUploads((prev) => [...prev, uploadedFile]);
        if (showFileList) {
          setMedia((prevMedia) => [...prevMedia, uploadedFile]);
        }

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
    if (businessContext) {
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
    }
  }, [businessContext, documentMediaType]);

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
    // Calculate total images across all gallery categories
    const totalImages = galleryTitles.reduce((sum, { key }) => {
      const images = businessContext[key] || [];
      const validImages = images.filter((img) => !img.isUnused);
      return sum + validImages.length;
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

    if (fileUploadLimitTypes.includes(documentMediaType)) {
      const totalFilesInCategory =
        (businessContext[documentMediaType]?.length || 0) +
        currentUploads.length;

      if (totalFilesInCategory + fileList.length > fileUploadLimit) {
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
    return true; // Allow upload
  };

  const displayFileList = showFileList
    ? [...media, ...currentUploads]
    : currentUploads;

  return (
    <Dragger
      multiple={true}
      className="customSizedUpload"
      fileList={displayFileList}
      customRequest={customRequest}
      onRemove={onRemoveHandler}
      accept={acceptAttribute}
      showUploadList={true}
      action=""
      disabled={uploading}
      beforeUpload={handleBeforeUpload}
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
          <p className="ant-upload-hint">
            {fileFormat
              ? fileFormat
              : `Supported file formats: ${supportedFormatsText}`}
          </p>
          <p className="ant-upload-hint">{`${
            fileSize
              ? `File Size Limit ${fileSize} MB`
              : `File Size Limit 100 MB`
          }`}</p>
        </>
      )}
    </Dragger>
  );
}

export default BusinessProfileFileUpload;
