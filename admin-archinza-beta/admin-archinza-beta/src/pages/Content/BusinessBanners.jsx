import React, { useState, useEffect } from "react";
import { Row, Col, Upload, Button, message, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import http from "../../helpers/http";
import config from "../../config/config";
const { Dragger } = Upload;

const BusinessBanners = () => {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnyUploading, setIsAnyUploading] = useState(false);
  const [banners, setBanners] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [temporaryImages, setTemporaryImages] = useState({});
  const [showButtons, setShowButtons] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const base_url = config.api_url;
  const maxFileSize = 5 * 1024 * 1024;
  const allowedExtensions = ["png", "jpeg", "jpg"];

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      const { data } = await http.get(
        `${base_url}business/business-type-options`
      );
      const business_types = data?.business_types?.map((it) => it.category);
      setBusinessTypes(business_types);
      const previewImages = {};
      data?.business_types.forEach((businessType) => {
        if (businessType.banner && businessType.banner.url) {
          previewImages[
            businessType.category
          ] = `${base_url}public/uploads/business/${businessType?.banner?.url}`;
        }
      });
      setPreviewImages(previewImages);
    };

    fetchBusinessTypes();
  }, []);

  // const handleUpload = (businessType, file) => {
  //   setIsUploading(true);
  //   setBanners((prevBanners) => ({
  //     ...prevBanners,
  //     [businessType]: { file, previewUrl: URL.createObjectURL(file) },
  //   }));
  //   setPreviewImages((prevPreviewImages) => {
  //     delete prevPreviewImages[businessType];
  //     return {
  //       ...prevPreviewImages,
  //       [businessType]: URL.createObjectURL(file),
  //     };
  //   });
  //   setShowButtons((prevShowButtons) => ({
  //     ...prevShowButtons,
  //     [businessType]: true,
  //   }));
  // };

  // const customUpload = async (businessType, options) => {
  //   const { file } = options;
  //   if (!banners[businessType]) {
  //     handleUpload(businessType, file);
  //   }
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const uploadData = await http.put(
  //     `${base_url}admin/content/business-options/${businessType}/banners`,
  //     formData
  //   );
  //   console.log(uploadData);
  //   return {
  //     abort() {},
  //   };
  // };

  const onUploadChangeHandler = async (info, businessType) => {
    if (info.file.status === "uploading") {
      if (uploadingFiles.has(info.file.uid)) {
        return;
      }

      setIsUploading(true);
      setUploadingFiles((prev) => new Set(prev).add(info.file.uid));
      setIsUploading((prev) => ({
        ...prev,
        [businessType]: true,
      }));

      const fileExtension = info.file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        message.error(`File type .${fileExtension} is not allowed.`);
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(info.file.uid);
          return newSet;
        });
        return false;
      }

      if (info.file.size > maxFileSize) {
        message.error(
          `File size exceeds the ${maxFileSize.toString().charAt(0)} limit.`
        );
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(info.file.uid);
          return newSet;
        });
        return false;
      }
      const fileObj = info.file.originFileObj || info.file;
      const previewUrl = URL.createObjectURL(fileObj);
      setBanners((prevBanners) => ({
        ...prevBanners,
        [businessType]: { file: fileObj, previewUrl },
      }));
      setTemporaryImages((prevTemporaryImages) => ({
        ...prevTemporaryImages,
        [businessType]: previewImages[businessType],
      }));
      setPreviewImages((prevPreviewImages) => {
        if (prevPreviewImages[businessType]) {
          URL.revokeObjectURL(prevPreviewImages[businessType]);
        }
        return { ...prevPreviewImages, [businessType]: previewUrl };
      });
      setShowButtons((prevShowButtons) => ({
        ...prevShowButtons,
        [businessType]: true,
      }));
      setIsAnyUploading(true);
    }
  };

  // Handle save button click
  const handleSave = async (businessType) => {
    if (!banners[businessType]) {
      message.error("No banner to save for this business type.");
      return;
    }
    const formData = new FormData();
    Object.keys(banners).forEach((businessType) => {
      formData.append("file", banners[businessType]?.file);
    });
    console.log(banners[businessType].file);

    const { data } = await http.put(
      `${base_url}admin/content/business-options/${
        Object.keys(banners)[0]
      }/banners`,
      formData
    );

    if (data) {
      message.success("Banners saved successfully!");
    } else {
      message.error("Error saving banners!");
    }
    console.log(previewImages[businessType]);

    setIsUploading(false);
    setIsAnyUploading(false);
    setShowButtons({});
    setBanners({});
  };

  // Handle cancel button click
  const handleCancel = (businessType) => {
    setIsUploading(false);
    setBanners((prevBanners) => {
      delete prevBanners[businessType];
      return { ...prevBanners };
    });
    if (temporaryImages[businessType]) {
      setPreviewImages((prevPreviewImages) => ({
        ...prevPreviewImages,
        [businessType]: temporaryImages[businessType],
      }));
    } else {
      setPreviewImages((prevPreviewImages) => {
        delete prevPreviewImages[businessType];
        return { ...prevPreviewImages };
      });
    }
    setShowButtons((prevShowButtons) => {
      delete prevShowButtons[businessType];
      return { ...prevShowButtons };
    });
    setIsAnyUploading(false);
  };

  const beforeUpload = (file, businessType) => {
    if (isUploading[businessType]) {
      return false;
    }
    if (!previewImages[businessType]) {
      return true;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      message.error(`File type .${fileExtension} is not allowed.`);
      return false;
    }
    if (file.size > maxFileSize) {
      message.error(
        `File size exceeds the ${maxFileSize.toString().charAt(0)} limit.`
      );
      return false;
    }
    if (isAnyUploading) {
      return false;
    }

    return true;
  };

  return (
    <div>
      {businessTypes.length > 0 && (
        <Row gutter={[16, 16]}>
          {businessTypes.map((businessType, index) => (
            <Col key={index} span={8}>
              <h3>{businessType}</h3>
              {previewImages[businessType] ? (
                <Image
                  src={previewImages[businessType]}
                  alt={businessType}
                  style={{ width: 200, height: 100, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 100,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px dashed #d9d9d9",
                    borderRadius: 4,
                  }}
                >
                  <InboxOutlined />
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <Upload
                  beforeUpload={(file) => beforeUpload(file, businessType)}
                  onChange={(info) => onUploadChangeHandler(info, businessType)}
                  showUploadList={false}
                >
                  <Button
                    type="primary"
                    disabled={isAnyUploading}
                    style={{ width: 120 }}
                  >
                    Select Image
                  </Button>
                </Upload>
              </div>
              {/* <span>
                {banners[businessType] && (
                  <span>
                    {banners[businessType].name} ({banners[businessType].size}{" "}
                    bytes)
                  </span>
                )}
              </span> */}
              {showButtons[businessType] && (
                <div style={{ marginTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => handleSave(businessType)}
                    style={{ marginRight: 10 }}
                  >
                    Save
                  </Button>
                  <Button onClick={() => handleCancel(businessType)}>
                    Cancel
                  </Button>
                </div>
              )}
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BusinessBanners;
