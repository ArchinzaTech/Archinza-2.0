import React, { useEffect, useState } from "react";
import style from "../ProAccess/proaccess.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowwhite } from "../../../images";
import RadioButton from "../../../components/RadioButton/RadioButton";
import http from "../../../helpers/http";
import Joi from "joi";
import { useProAccess } from "../../../context/ProAccess/ProAccessState";

import config from "../../../config/config";
// const yearsArr = ["0-2", "2-5", "5-10", "10-20", "20+"];

const FLStep01 = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
}) => {
  // =============== VARIABLE & STATES  ===========================

  const [values, setValues] = useState({});
  const [formError, setFormError] = useState({});

  const [options, setOptions] = useState([]);

  const base_url = config.api_url;
  const joiOptions = config.joiOptions;

  const ProAccess = useProAccess();

  // =============== FUNCTIONS  ===========================

  const handleChange = (e) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const validate = async (data) => {
    let schemaObj = {
      fl_establishment: Joi.string().required().label("Establishment Duration"),
    };

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    return errors ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let form_values = values;

    let errors = await validate(form_values);

    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }
    let status = currentStep + 1;

    const data = await http.put(
      `${base_url}/pro-access/update/${ProAccess?.data?._id}`,
      {
        ...form_values,
        status: status,
      }
    );

    if (data) {
      ProAccess.update({ ...ProAccess.data, ...form_values, status: status });

      nextStep();
      window.scrollTo(0, 0);
    }
  };
  // =============== HTML RENDERING  ===========================

  const optionsList = options?.map((option, i) => (
    <React.Fragment key={`freelancer-01-${i}`}>
      <RadioButton
        extraSpace={true}
        label={option.label}
        labelId={`freelancer-01-${i}`}
        name="fl_establishment"
        value={option.value}
        checked={values.fl_establishment === option.value}
        onChange={handleChange}
      />
    </React.Fragment>
  ));

  // =============== DATA FETCHING  ===========================

  const fetchOptions = async (question_key) => {
    const res = await http.get(`${base_url}/options/${question_key}`);

    const data = res?.data || null;

    if (data) {
      console.log(data);

      setOptions(data?.options);
    }
  };

  // =============== SIDE EFFECTS  ===========================

  useEffect(() => {
    fetchOptions("fl_establishment");
  }, []);

  useEffect(() => {
    setValues({
      fl_establishment: ProAccess?.data?.fl_establishment,
    });
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((1 / 2) * 100);
    }
  }, [isActive]);

  return (
    <>
      <div className={style.text_container}>
        <button className={`${style.dashboard_btn} ${style.businessFirm_pill}`}>
          Freelancer/Artist
        </button>
        <h1 className={style.title}>
          How long back did you establish your work / business / firm?
        </h1>
        <p
          className={`${style.description} ${
            formError?.fl_establishment && style.active
          }`}
        >
          Choose one
        </p>
        {formError?.fl_establishment && (
          <p className={`error ${style.error}`}>
            {formError?.fl_establishment}
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={`${style.steps} ${style.step02}`}>
          <ul className={style.step02_ul}>{optionsList}</ul>
        </div>

        <div className={`${style.next_logout} ${style.next_logout_step02}`}>
          <div className={style.cta_wrapper}>
            <button className={style.next_button}>
              <div className={style.text}>Next</div>
              <img
                src={rightarrowwhite}
                alt="icon"
                className={style.icon}
                loading="lazy"
              />
            </button>
            {/* <div
              className={style.back_button}
              onClick={() => {
                previousStep();
                window.scrollTo(0, 0);
              }}
            >
              Back
            </div> */}
          </div>
          {/* <LogoutText /> */}
        </div>
      </form>
    </>
  );
};

export default FLStep01;
