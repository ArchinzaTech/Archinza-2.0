import React, { useContext, useEffect, useState } from "react";
import style from "./proaccess.module.scss";
import BorderLinearProgress from "../../../components/ProgressBar/ProgressBar";
import StepWizard from "react-step-wizard";
import STStep01 from "../StudentSteps/STStep01";
import STStep02 from "../StudentSteps/STStep02";
import STStep03 from "../StudentSteps/STStep03";
import FooterV2 from "../../../components/FooterV2/FooterV2";
import BlinkingDots from "../../../Animations/BlinkingDots/BlinkingDots";
import TMStep01 from "../TeamMember/TMStep01";
import TMStep02 from "../TeamMember/TMStep02";
import TMStep03 from "../TeamMember/TMStep03";
import BOStep01 from "../BusinessOwner/B0Step01";
import BOStep02 from "../BusinessOwner/B0Step02";
import FLStep01 from "../FreelancerSteps/FLStep01";
import FLStep02 from "../FreelancerSteps/FLStep02";
import { useAuth } from "../../../context/Auth/AuthState";

import config from "../../../config/config";

import Joi from "joi";
import http from "../../../helpers/http";
import helper from "../../../helpers/helper";
import { useNavigate } from "react-router-dom";
import ProAccessContext from "../../../context/ProAccess/ProAccessContext";
import { dashboardURL } from "../../../components/helpers/constant-words";

const ProAccess = () => {
  const [progress, setProgress] = useState(0);
  const [formStep, setformStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const navigate = useNavigate();
  const ProAccess = useContext(ProAccessContext);

  const base_url = config.api_url; //without trailing slash

  const fetchEntry = async (id, user_type) => {
    const { data } = await http.get(
      `${base_url}/pro-access/entries/${user_type}/${id}`
    );

    if (data) {
      if (data?.status === "registered") {
        switch (data?.user_type) {
          case "ST":
            setformStep(1);
            break;
          case "TM":
            setformStep(4);
            break;
          case "BO":
            setformStep(7);
            break;
          case "FL":
            setformStep(9);
            break;

          default:
            break;
        }
      } else if (data?.status === "completed") {
        navigate(dashboardURL);
      } else {
        setformStep(parseInt(data.status));
      }

      ProAccess.update(data);
    } else {
      navigate(dashboardURL);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (auth.user) {
      const id = auth?.user?._id;
      const user_type = auth?.user?.user_type;
      fetchEntry(id, user_type);
    }
  }, [auth]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <BlinkingDots />
      <section className={style.students_sec1}>
        <div className={style.students_form_wrap}>
          <div className="my_container">
            <div className={style.progress_wrapper}>
              <BorderLinearProgress variant="determinate" value={progress} />
            </div>
            <div className={style.steps_wrapper}>
              <StepWizard
                initialStep={formStep}
                transitions={{
                  enterRight: "formChangeAnimation",
                  enterLeft: "formChangeAnimation",
                  intro: "formChangeAnimation",
                }}
              >
                <STStep01 progressStatus={setProgress} />
                <STStep02 progressStatus={setProgress} />
                <STStep03 progressStatus={setProgress} />
                <TMStep01 progressStatus={setProgress} />
                <TMStep02 progressStatus={setProgress} />
                <TMStep03 progressStatus={setProgress} />
                <BOStep01 progressStatus={setProgress} />
                <BOStep02 progressStatus={setProgress} />
                <FLStep01 progressStatus={setProgress} />
                <FLStep02 progressStatus={setProgress} />
              </StepWizard>
            </div>
          </div>
        </div>
      </section>
      <FooterV2 whatsappBotIcon={false} />
    </>
  );
};

export default ProAccess;
