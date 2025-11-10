import React, { useEffect, useState } from "react";
import "./whereWePopup.scss";
import Modal from "react-bootstrap/Modal";
import { modalClose } from "../../../../images";

const WhereWePopup = (props) => {
  const [animationClass, setAnimationClass] = useState("opening");
  const { data } = props;

  const shouldRenderField = (fieldKey) => {
    if (!props?.workflowQuestions || !data?.business_types) {
      return false;
    }

    const question = props?.workflowQuestions.find(
      (q) => q.question === fieldKey
    );
    if (!question) {
      return false;
    }

    const userBusinessTypeIds = data.business_types.map((bt) => bt._id);
    const questionBusinessTypeIds = question.business_types.map((bt) => bt._id);

    return userBusinessTypeIds.some((id) =>
      questionBusinessTypeIds.includes(id)
    );
  };
  // When modal opens, add "opening" class
  useEffect(() => {
    if (props.show) {
      setAnimationClass("opening");
    }
  }, [props.show]);

  // When modal is closing, delay actual close to complete animation
  const handleClose = () => {
    setAnimationClass("closing");
    setTimeout(() => {
      props.handleClose();
    }, 100); // Match animation duration
  };

  return (
    <>
      <Modal
        {...props}
        centered
        // className="Where_We_excel_popup"
        className={`Where_We_excel_popup ${animationClass}`}
        backdropClassName="custom-backdrop"
        onHide={handleClose}
        // onExit={() => setIsClosing(true)}
      >
        <Modal.Header>
          <button className="custom-cancel-btn" onClick={handleClose}>
            <img
              src={modalClose}
              alt="close-icon"
              className="ctm_img_Where_We_excel_popup"
            />
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2 className="Where_We_excel_popup_heading">Where We Excel</h2>
          <ul className="common_ul_popups">
            {shouldRenderField("location_preference") &&
              data?.project_location?.data && (
                <li className="common_li_popup">
                  Can do Projects :{" "}
                  <span className="bold_common_li_popup">
                    {data.project_location.data}
                  </span>
                </li>
              )}

            {shouldRenderField("renovation_work") && data?.renovation_work && (
              <li className="common_li_popup">
                Renovation Work :{" "}
                <span className="bold_common_li_popup">
                  {data.renovation_work}
                </span>
              </li>
            )}

            {data?.avg_project_budget?.budgets?.length > 0 && (
              <li className="common_li_popup">
                Approx Budget of Projects :{" "}
                <span className="bold_common_li_popup">
                  {data.avg_project_budget.budgets.join(", ")}
                </span>
              </li>
            )}

            {data?.project_mimimal_fee?.fee && (
              <li className="common_li_popup">
                Current Min. Project Fee :{" "}
                <span className="bold_common_li_popup">
                  {data.project_mimimal_fee.fee}
                </span>
              </li>
            )}

            {data?.project_sizes?.sizes?.length > 0 && (
              <li className="common_li_popup">
                Min. Project Size :{" "}
                <span className="bold_common_li_popup">
                  {data.project_sizes.sizes
                    .map((size) => `${size} ${data?.project_sizes?.unit}`)
                    .join(", ")}
                </span>
              </li>
            )}

            {data?.project_typology?.data?.length > 0 && (
              <li className="common_li_popup common_multi_line_list">
                Project Typology :
                <div className="pills_common_li_popup">
                  {data.project_typology.data.map((it, idx) => (
                    <div key={idx} className="pill_span_li">
                      {it}
                    </div>
                  ))}
                </div>
              </li>
            )}

            {data?.design_style?.data?.length > 0 && (
              <li className="common_li_popup common_multi_line_list extra_mb">
                Design Style :
                <div className="pills_common_li_popup">
                  {data.design_style.data.map((it, idx) => (
                    <div key={idx} className="pill_span_li">
                      {it}
                    </div>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WhereWePopup;
