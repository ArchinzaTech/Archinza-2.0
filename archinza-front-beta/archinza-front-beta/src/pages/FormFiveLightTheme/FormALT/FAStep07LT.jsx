import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack, rightarrowwhite } from "../../../images";
import YearPicker from "../../../components/YearPicker/YearPicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useWindowSize } from "react-use";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import Joi from "joi";
import helper from "../../../helpers/helper";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";

const FBStep07LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  lightTheme,
  isActive,
  goToStep,
}) => {
  const { width } = useWindowSize();
  const startDate = dayjs("1974-01-01T00:00:00.000");
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const minDate = new Date(minYear, 0, 1);
  const [values, setValues] = useState({
    establishment_year: "",
  });
  const [date, setDate] = useState(null);
  const [formError, setFormError] = useState({});
  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();

  const handleDateChange = (option) => {
    setDate(option);
    setFormError({});
    setValues((prevState) => ({
      ...prevState,
      establishment_year: option ? option.$y.toString() : "",
    }));
  };

  const getYearFromDatePickerValue = (datePickerValue) => {
    if (!datePickerValue || !dayjs(datePickerValue).isValid()) {
      return "";
    }
    return `${datePickerValue.$y}`;
  };

  const validate = async (data) => {
    const schema = Joi.object({
      establishment_year: Joi.string()
        .allow("")
        // .required()
        .label("Establishment Year"),
      // .messages({
      //   "string.empty": "Please Select an Establishment Year",
      // }),
    }).options({ allowUnknown: true });

    const { error } = schema.validate(data, config.joiOptions);
    const errors = {};

    if (error) {
      error.details.forEach((field) => {
        errors[field.path[0]] = field.message;
      });
    }

    return errors || {};
  };

  const handleSubmit = async () => {
    const newDate = getYearFromDatePickerValue(date);

    if (date && !dayjs(date).isValid()) {
      setFormError({
        establishment_year: "Please select a valid year",
      });
      helper.scroll(
        helper.getFirstError({
          establishment_year: "Please select a valid year",
        })
      );
      return;
    }

    const currentYear = new Date().getFullYear();
    const yearAsNumber = parseInt(newDate, 10);

    const errors = await validate({ establishment_year: newDate });
    setFormError(errors);

    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    if (yearAsNumber > currentYear || yearAsNumber < minYear) {
      setFormError({
        establishment_year: "Year must be within the last 100 years",
      });
      helper.scroll(
        helper.getFirstError({
          establishment_year: "Year must be within the last 100 years",
        })
      );
      return;
    }

    const questionsData = await http.get(
      `${config.api_url}/business/business-questions`
    );

    const business_types = BusinessAccountContext.data.business_types.map(
      (it) => it._id
    );

    let stepNumber = helper.redirectBusinessUser(
      questionsData?.data,
      business_types,
      currentStep
    );
    let nextStepToGo = currentStep + 1;
    let saveStatus = Math.max(stepNumber, nextStepToGo);

    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }

    const data = await http.post(
      `${base_url}/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        establishment_year: { data: newDate },
        status: saveStatus,
      }
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        establishment_year: { data: newDate },
        status: saveStatus,
      });
      goToStep(stepNumber);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const establishmentYearData =
      BusinessAccountContext?.data?.establishment_year?.data;
    if (establishmentYearData && dayjs(establishmentYearData).isValid()) {
      const parsedDate = dayjs(establishmentYearData);
      setDate(parsedDate);
      setValues({
        establishment_year: parsedDate.$y.toString(),
      });
    } else {
      setDate(null);
      setValues({ establishment_year: "" });
      setFormError({});
    }
  }, [currentStep, BusinessAccountContext?.data?.establishment_year]);

  useEffect(() => {
    if (isActive) {
      progressStatus((5 / 18) * 100);
    }
  }, [isActive]);
  // useEffect(() => {
  //   progressStatus((currentStep / totalSteps) * 100);
  // }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>AI-Powered Client matchmaking</p>
        <p
          className={`${style.description} ${style.select_notice} mb-2`}
          style={{ fontSize: "1em" }}
        >
          (Optional)
        </p>
        <h1 className={style.title}>Year of Establishment</h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          This information is used by Archinza AI™️to matchmake your ideal
          clients.
        </h2>
        {/* <p className={style.description}></p> */}
      </div>
      <div className={`${style.steps} ${style.fastep04}`}>
        <div className={`${style.add_more_wrap} ${style.add_more_v2}`}>
          <div className={style.field_wrapper}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label={"Year"}
                  openTo="year"
                  views={["year"]}
                  minDate={dayjs(minDate)}
                  maxDate={dayjs(new Date())}
                  disableFuture
                  className={style.year_date_picker}
                  sx={{
                    width: "100%",
                    minWidth: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: width > 768 ? "10px" : "10px",
                    },
                    "& label": {
                      lineHeight: width > 768 ? "2em" : "1.5em",
                    },
                    "& label.Mui-focused": {
                      color: lightTheme ? "#111" : "fff",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: width > 768 ? "10px" : "10px",
                        border: "1px solid #707070",
                      },
                    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid #707070",
                      },
                    "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: formError.establishment_year
                          ? "red"
                          : lightTheme
                          ? "#111"
                          : "fff",
                      },
                  }}
                  value={date || null}
                  onChange={(newdate) => handleDateChange(newdate)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <div id="establishment_year_error">
              <p className={`${style.rstep02Error} ${style.error}`}>
                {formError.establishment_year}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img
              src={rightarrowwhite}
              alt="icon"
              className={style.icon}
              loading="lazy"
            />
          </div>
          <div
            className={style.back_button}
            onClick={() => {
              previousStep(2);
              window.scrollTo(0, 0);
            }}
          >
            Back
          </div>
        </div>
        <LogoutText />
      </div>
    </>
  );
};

export default FBStep07LT;
