import Modal from "react-bootstrap/Modal";
import "./businessuploadmodal.scss";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useEffect, useState } from "react";
import config from "../../config/config";
import http from "../../helpers/http";
import { toast } from "react-toastify";
import ToastMsg from "../../components/ToastMsg/ToastMsg";

const { Dragger } = Upload;
const aws_object_url = config.aws_object_url;

function BusinessUploadModal(props) {
  const { businessContext, handleUpdateMedia, sectionType, workspaceCategory } =
    props;

  const [media, setMedia] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const allowedExtensions =
    sectionType === "company_profile_media" ||
    sectionType === "product_catalogues_media"
      ? ["pdf", "ppt", "jpeg", "jpg", "png"]
      : ["jpeg", "jpg", "png", "heic", "svg", "webp"];
  const maxFileSize = 50 * 1024 * 1024;
  const base_url = config.api_url;

  const handleClose = () => {
    props.onHide(false);
  };

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    const fileUrl = file.url || file.preview;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (["pdf", "ppt", "pptx"].includes(fileExtension)) {
      window.open(fileUrl, "_blank");
    } else {
      const image = new Image();
      image.src = fileUrl;
      const imgWindow = window.open(fileUrl);
      imgWindow.document.write(image.outerHTML);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (files) => {
    if (uploadedFiles.length > 0) {
      const updatedUploadedFiles = uploadedFiles.map((file) => ({
        ...file,
        visibility: true,
      }));

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      const uploadData = await http.post(
        `${base_url}/business/business-edit/${businessContext?._id}/upload/${sectionType}`,
        { files: uploadedFiles }
      );
      handleUpdateMedia(updatedUploadedFiles, sectionType);
      // message.success(`Files uploaded successfully.`);
      toast(
        <ToastMsg message={`Files uploaded successfully`} />,
        config.success_toast_config
      );
      setTempFiles([]);
      setMedia([]);
      setUploadedFiles([]);

      props.onHide(false);
    } else {
      message.error("Please select any file");
    }
  };

  const onUploadChangeHandler = async (info) => {
    if (info.file.status === "removed") {
      return;
    }
    if (info.file.status === "error") {
      return;
    }
    if (info.file.status === "uploading") {
      if (uploadingFiles.has(info.file.uid)) {
        return;
      }
      setUploadingFiles((prev) => new Set(prev).add(info.file.uid));
      const fileExtension = info.file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        // message.error(`File type .${fileExtension} is not allowed.`);
        toast(
          <ToastMsg message={`File type .${fileExtension} is not allowed.`} />,
          config.error_toast_config
        );
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(info.file.uid);
          return newSet;
        });
        return false;
      }

      if (info.file.size > maxFileSize) {
        // message.error(`File size exceeds the 30 limit.`);
        toast(
          <ToastMsg message={`File size exceeds the ${maxFileSize} limit.`} />,
          config.error_toast_config
        );
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(info.file.uid);
          return newSet;
        });
        return false;
      }

      const formData = new FormData();
      formData.append("files", info.file.originFileObj);
      formData.append("allowedExtensions", JSON.stringify(allowedExtensions));

      const uploadData = await http.post(
        `${base_url}/business/upload-media`,
        formData
      );

      if (uploadData?.data?.error == "Mimetype") {
        message.error(`Invalid File Type`);
        return false;
      }

      const uploadedFile = {
        uid: info.file.uid,
        name: info.file.name,
        status: "done",
        url: `${aws_object_url}/business/${uploadData?.data[0].url}`,
        _id: uploadData?.data[0]._id,
        // size: info.file.size,
      };
      setMedia((prevMedia) => [...prevMedia, uploadedFile]);
      setTempFiles((prev) => [...prev, info.file]);
      setUploadedFiles((prev) => [...prev, uploadData?.data[0]]);
    }

    // onFileUpload([uploadedFile], { state: "uploaded" });
  };

  const onRemoveHandler = async (file) => {
    const updatedMedia = media.filter((it) => {
      return it.uid !== file.uid;
    });

    // const { data } = await http.delete(
    //   base_url + `/business/delete-media/${file._id}`
    // );

    setMedia(updatedMedia);
    setTempFiles(tempFiles.filter((tmp) => tmp.uid !== file.uid));
    setTempFiles(updatedMedia);
    setUploadedFiles(uploadedFiles.filter((it) => it._id !== file._id));
    toast(
      <ToastMsg message={`File size exceeds the 30MB limit.`} />,
      config.error_toast_config
    );
    // message.success(`${file.name} file removed.`);
  };

  // const customItemRender = (originNode, file) => {
  //   return (
  //     <div className="custom-file-render">
  //       {originNode}{" "}
  //       <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>{" "}
  //     </div>
  //   );
  // };

  return (
    <Modal
      {...props}
      className={`BE_upload_modal ${props.className}`}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Dragger
          multiple={true}
          className="customSizedUpload"
          fileList={media}
          onChange={(info) => {
            onUploadChangeHandler(info);
          }}
          onRemove={onRemoveHandler}
          onPreview={onPreview}
          // itemRender={customItemRender}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="customSizedUpload" />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
          <p className="ant-upload-hint">
            Supported file formats:{" "}
            {allowedExtensions.map((ext) => ext.toUpperCase()).join(", ")}{" "}
          </p>
          <p className="ant-upload-hint">File Size Limit 30 MB </p>
        </Dragger>
        <div className="save_cancel_cta">
          <button className="save_cta" onClick={() => handleSubmit(tempFiles)}>
            Save
          </button>
          <button className="cancel_cta" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BusinessUploadModal;
