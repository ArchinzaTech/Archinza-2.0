import React, { useEffect, useRef, useState } from "react";
import "./supportingdocuments.scss";
import {
  addmoreIcon,
  blackDeleteicon,
  closeIcon,
  greentick,
  images,
  rightarrowwhite,
} from "../../../images";
import { useWindowSize } from "react-use";
import { Link } from "react-router-dom";
import BusinessProfileModal from "../../../components/BusinessProfile/BusinessProfileModal";

const completedGalleryArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const projectRendersArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const wipSiteArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const otherMediaArr = [
  images.projectGallery01.image,
  images.projectGallery01.image,
];

const modalDataArr = [
  {
    description: [
      "Product Catalogues/Brochures",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Completed Project Photos/Videos",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Project Renders",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Work In Progress - Site Photos/Videos",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  {
    description: [
      "Other Media",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
];

const SupportingDocuments = () => {
  const [upload, setUpload] = useState(false);
  const [error] = useState(false);
  const [catalougeShow, setCatalougeShow] = useState(true);
  const [completedProjectImageStates, setCompletedProjectImageStates] =
    useState(Array(completedGalleryArr.length).fill(false));
  const [projectRendersStates, setProjectRendersStates] = useState(
    Array(projectRendersArr.length).fill(false)
  );
  const [wipSiteStates, setWipSiteStates] = useState(
    Array(wipSiteArr.length).fill(false)
  );
  const [otherMediaStates, setOtherMediaStates] = useState(
    Array(otherMediaArr.length).fill(false)
  );
  const [projectImageHeight, setProjectImageHeight] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState([]);
  const projectImageRef = useRef(null);
  const { width, height } = useWindowSize();

  const catalougeVisibility = () => {
    setCatalougeShow(!catalougeShow);
  };

  const completedProjectsVisibility = (i) => {
    const newToggleStates = [...completedProjectImageStates];
    newToggleStates[i] = !newToggleStates[i];
    setCompletedProjectImageStates(newToggleStates);

    // const newWipMediaStates = [...wipSiteStates];
    // newWipMediaStates[i] = !newWipMediaStates[i];
    // setWipSiteStates(newWipMediaStates);

    // const newOtherMediaStates = [...otherMediaStates];
    // newOtherMediaStates[i] = !newOtherMediaStates[i];
    // setOtherMediaStates(newOtherMediaStates);
  };

  const projectRendersVisibility = (i) => {
    const newProjectRendersStates = [...projectRendersStates];
    newProjectRendersStates[i] = !newProjectRendersStates[i];
    setProjectRendersStates(newProjectRendersStates);
  };

  const wipSitesVisibility = (i) => {
    const newWipMediaStates = [...wipSiteStates];
    newWipMediaStates[i] = !newWipMediaStates[i];
    setWipSiteStates(newWipMediaStates);
  };

  const otherMediaVisibility = (i) => {
    const newOtherMediaStates = [...otherMediaStates];
    newOtherMediaStates[i] = !newOtherMediaStates[i];
    setOtherMediaStates(newOtherMediaStates);
  };

  const handleModalData = (i) => {
    setModalData(modalDataArr[i].description);
    setModalShow(true);
  };

  useEffect(() => {
    if (projectImageRef.current) {
      setProjectImageHeight(projectImageRef.current.clientHeight);
    }
  }, [projectImageRef, width, height]);

  return (
    <>
      <div className="support_container">
        <div className="title_edit">
          <h2 className="section_title">Add Media</h2>
          {/* <div className="edit_save">
            <img src={editicon} alt="" className="edit_icon" />
            <img src={bookmarkIcon} alt="" className="book_icon" />
          </div> */}
        </div>

        <div className="brand_subsec">
          <h4 className="title cp_heading">Company Profile*</h4>
          <p className="notice_msg">
            Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC Allowed
          </p>
          <div className="file_flex">
            <div className="filename">Company Profile Lorem Ipsum.PDF</div>
            <img
              width={24}
              height={27}
              src={blackDeleteicon}
              alt="delete"
              className="delete_icon"
              loading="lazy"
            />
          </div>
          <div className="upload_file_wrapper">
            <div className="input_wrapper">
              <input
                className="input_box"
                type="file"
                id="companyProfileUpload"
                hidden
                name="company_logo"
              />
              <label
                htmlFor="companyProfileUpload"
                className="upload_label"
                onClick={() => setUpload(true)}
              >
                <div className="img_wrapper">
                  <img
                    width={26}
                    height={26}
                    src={addmoreIcon}
                    alt="upload"
                    className="upload_icon"
                    loading="lazy"
                  />
                </div>
                <div className="text">Add More</div>
              </label>
            </div>
            <div
              className="notice"
              style={{ display: error || upload === true ? "block" : "none" }}
            >
              {upload === true ? "File name" : "Error message here"}
            </div>
            <div className="notice">
              Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC Allowed
            </div>
          </div>

          <div className="subbrand">
            <div className="title_pin_wrap">
              <h4 className="title cat_heading">
                Product Catalogues/Brochures
              </h4>
              <div className="entity" onClick={() => handleModalData(0)}>
                &#9432;
              </div>
            </div>
            <p className="notice_msg">
              Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC Allowed
            </p>
            <div className="file_flex file_hide">
              <div className="name_flex">
                <div className="filename">Company Profile Lorem Ipsum.PDF</div>
                <img
                  width={24}
                  height={27}
                  src={blackDeleteicon}
                  alt="delete"
                  className="delete_icon"
                  loading="lazy"
                />
              </div>
              <div className="switch_btn catalouge_switch">
                <div className="toggle_container" onClick={catalougeVisibility}>
                  <div className="toggle_text">Hide</div>
                  <div className="toggle_switch">
                    <div
                      className={`toggle_circle ${
                        catalougeShow ? "left" : "right"
                      }`}
                    />
                  </div>
                  <div className="toggle_text">Show</div>
                </div>
              </div>
            </div>
            <div className="upload_file_wrapper">
              <div className="input_wrapper">
                <input
                  className="input_box"
                  type="file"
                  id="catalougeUpload"
                  hidden
                  name="company_logo"
                />
                <label
                  htmlFor="catalougeUpload"
                  className="upload_label"
                  onClick={() => setUpload(true)}
                >
                  <div className="img_wrapper">
                    <img
                      width={26}
                      height={26}
                      src={addmoreIcon}
                      alt="upload"
                      className="upload_icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="text">Add More</div>
                </label>
              </div>
              <div
                className="notice"
                style={{ display: error || upload === true ? "block" : "none" }}
              >
                {upload === true ? "File name" : "Error message here"}
              </div>
              <div className="notice">
                Maximum File Size Is 100MB. PDF, JPEG, PNG, PPT, DOC Allowed
              </div>
            </div>
          </div>
        </div>
        <div className="brand_subsec">
          <div className="title_flex">
            <h4 className="title projects_heading">Projects</h4>
            <p className="notice_msg">
              Maximum File Size Is 25MB. JPEG, PNG, HEIC, MOV, MP4 Allowed
            </p>
          </div>
          <div className="title_pin_wrap">
            <h5 className="image_title cat_heading">
              Completed Project Photos/Videos
            </h5>
            <div className="entity" onClick={() => handleModalData(1)}>
              &#9432;
            </div>
          </div>
          <ul className="pr_images_container">
            {completedGalleryArr.map((img, i) => (
              <li className="list_item" key={i}>
                <div className="project_img_wrapper">
                  <img
                    ref={projectImageRef}
                    width={412}
                    height={413}
                    src={img}
                    alt="completed project"
                    className="uploaded_img"
                    loading="lazy"
                  />
                  <div className="switch_btn image_toggle_btn">
                    <div
                      className="toggle_container"
                      onClick={() => completedProjectsVisibility(i)}
                    >
                      <div className="toggle_text">Hide</div>
                      <div className="toggle_switch">
                        <div
                          className={`toggle_circle ${
                            completedProjectImageStates[i] ? "left" : "right"
                          }`}
                        />
                      </div>
                      <div className="toggle_text">Show</div>
                    </div>
                  </div>
                  <img
                    width={32}
                    height={32}
                    src={closeIcon}
                    alt="close"
                    className="close_icon"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
            <li className="project_image_uploader list_item">
              <div className="input_wrapper">
                <input
                  className="input_box"
                  type="file"
                  id="projectImageUpload"
                  hidden
                  name="company_logo"
                />
                <label
                  style={{ height: projectImageHeight }}
                  htmlFor="projectImageUpload"
                  className="upload_label"
                  onClick={() => setUpload(true)}
                >
                  <div className="img_wrapper">
                    <img
                      width={35}
                      height={35}
                      src={addmoreIcon}
                      alt="upload"
                      className="upload_icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="text">Add More</div>
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="brand_subsec">
          <div className="title_pin_wrap">
            <h5 className="image_title cat_heading">Project Renders</h5>
            <div className="entity" onClick={() => handleModalData(2)}>
              &#9432;
            </div>
          </div>
          <ul className="pr_images_container">
            {projectRendersArr.map((img, i) => (
              <li className="list_item" key={i}>
                <div className="project_img_wrapper">
                  <img
                    ref={projectImageRef}
                    width={412}
                    height={413}
                    src={img}
                    alt="completed project"
                    className="uploaded_img"
                    loading="lazy"
                  />
                  <div className="switch_btn image_toggle_btn">
                    <div
                      className="toggle_container"
                      onClick={() => projectRendersVisibility(i)}
                    >
                      <div className="toggle_text">Hide</div>
                      <div className="toggle_switch">
                        <div
                          className={`toggle_circle ${
                            projectRendersStates[i] ? "left" : "right"
                          }`}
                        />
                      </div>
                      <div className="toggle_text">Show</div>
                    </div>
                  </div>
                  <img
                    width={32}
                    height={32}
                    src={closeIcon}
                    alt="close"
                    className="close_icon"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
            <li className="project_image_uploader list_item">
              <div className="input_wrapper">
                <input
                  className="input_box"
                  type="file"
                  id="projectImageUpload"
                  hidden
                  name="company_logo"
                />
                <label
                  style={{ height: projectImageHeight }}
                  htmlFor="projectImageUpload"
                  className="upload_label"
                  onClick={() => setUpload(true)}
                >
                  <div className="img_wrapper">
                    <img
                      width={35}
                      height={35}
                      src={addmoreIcon}
                      alt="upload"
                      className="upload_icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="text">Add More</div>
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="brand_subsec">
          <div className="title_pin_wrap">
            <h5 className="image_title cat_heading">
              Work In Progress - Site Photos/Videos
            </h5>
            <div className="entity" onClick={() => handleModalData(3)}>
              &#9432;
            </div>
          </div>
          <ul className="pr_images_container">
            {wipSiteArr.map((img, i) => (
              <li className="list_item" key={i}>
                <div className="project_img_wrapper">
                  <img
                    ref={projectImageRef}
                    width={412}
                    height={413}
                    src={img}
                    alt="completed project"
                    className="uploaded_img"
                    loading="lazy"
                  />
                  <div className="switch_btn image_toggle_btn">
                    <div
                      className="toggle_container"
                      onClick={() => wipSitesVisibility(i)}
                    >
                      <div className="toggle_text">Hide</div>
                      <div className="toggle_switch">
                        <div
                          className={`toggle_circle ${
                            wipSiteStates[i] ? "left" : "right"
                          }`}
                        />
                      </div>
                      <div className="toggle_text">Show</div>
                    </div>
                  </div>
                  <img
                    width={32}
                    height={32}
                    src={closeIcon}
                    alt="close"
                    className="close_icon"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
            <li className="project_image_uploader list_item">
              <div className="input_wrapper">
                <input
                  className="input_box"
                  type="file"
                  id="projectImageUpload"
                  hidden
                  name="company_logo"
                />
                <label
                  style={{ height: projectImageHeight }}
                  htmlFor="projectImageUpload"
                  className="upload_label"
                  onClick={() => setUpload(true)}
                >
                  <div className="img_wrapper">
                    <img
                      width={35}
                      height={35}
                      src={addmoreIcon}
                      alt="upload"
                      className="upload_icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="text">Add More</div>
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="brand_subsec">
          <div className="title_pin_wrap">
            <h5 className="image_title cat_heading">
              Work In Progress - Site Photos/Videos
            </h5>
            <div className="entity" onClick={() => handleModalData(4)}>
              &#9432;
            </div>
          </div>
          <ul className="pr_images_container">
            {otherMediaArr.map((img, i) => (
              <li className="list_item" key={i}>
                <div className="project_img_wrapper">
                  <img
                    ref={projectImageRef}
                    width={412}
                    height={413}
                    src={img}
                    alt="completed project"
                    className="uploaded_img"
                    loading="lazy"
                  />
                  <div className="switch_btn image_toggle_btn">
                    <div
                      className="toggle_container"
                      onClick={() => otherMediaVisibility(i)}
                    >
                      <div className="toggle_text">Hide</div>
                      <div className="toggle_switch">
                        <div
                          className={`toggle_circle ${
                            otherMediaStates[i] ? "left" : "right"
                          }`}
                        />
                      </div>
                      <div className="toggle_text">Show</div>
                    </div>
                  </div>
                  <img
                    width={32}
                    height={32}
                    src={closeIcon}
                    alt="close"
                    className="close_icon"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
            <li className="project_image_uploader list_item">
              <div className="input_wrapper">
                <input
                  className="input_box"
                  type="file"
                  id="projectImageUpload"
                  hidden
                  name="company_logo"
                />
                <label
                  style={{ height: projectImageHeight }}
                  htmlFor="projectImageUpload"
                  className="upload_label"
                  onClick={() => setUpload(true)}
                >
                  <div className="img_wrapper">
                    <img
                      width={35}
                      height={35}
                      src={addmoreIcon}
                      alt="upload"
                      className="upload_icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="text">Add More</div>
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="submit_page">
        <div className="cta_wrapper">
          <button
            type="submit"
            className="common_cta without_shadow submit_cta"
          >
            <img
              src={greentick}
              alt="icon"
              className="tick_icon"
              loading="lazy"
            />
            <div className="text">Get Verfied Now</div>
            <img
              src={rightarrowwhite}
              alt="icon"
              className="icon"
              loading="lazy"
            />
          </button>
        </div>
        {/* <div className="notice">
          <Link className="anchor">click here</Link> to save & exit
        </div> */}
        <div className="notice">
          Need help setting up your store? Get help!&nbsp;
          <Link className="anchor blue_anchor">Get help!</Link>
        </div>
      </div>
      <BusinessProfileModal
        dataarr={modalData}
        className="white_theme"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default SupportingDocuments;
