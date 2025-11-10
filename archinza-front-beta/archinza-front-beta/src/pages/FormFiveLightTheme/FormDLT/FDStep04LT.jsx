import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { rightarrowblack } from "../../../images";
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

const FDStep04LT = ({
  previousStep,
  nextStep,
  currentStep,
  totalSteps,
  progressStatus,
  lightTheme,
  isActive,
}) => {
  const { width } = useWindowSize();
  const startDate = dayjs("1974-01-01T00:00:00.000");
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 50;
  const minDate = new Date(minYear, 0, 1);
  const [values, setValues] = useState({
    d_establishment_year: "",
  });
  const [date, setDate] = useState(null);
  const [formError, setFormError] = useState({});
  const base_url = config.api_url;
  const BusinessAccountContext = useBusinessContext();

  const handleDateChange = (option) => {
    setDate(option);
    setValues((prevState) => {
      return {
        ...prevState,
        ["d_establishment_year"]: option,
      };
    });
  };

  const getYearFromDatePickerValue = (datePickerValue) => {
    if (!datePickerValue) {
      return ""; // Handle empty value
    }

    return `${datePickerValue.$y}`; // Access year property based on your data structure
  };
  const validate = async (data) => {
    let schemaObj = {
      d_establishment_year: Joi.string()
        .required()
        .label("Establishment Year")
        .messages({
          "string.empty": "Please Select an Establishment Year",
        }),
    };

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, config.joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    return errors ? errors : null;
  };
  const handleSubmit = async () => {
    if (date && date?.$d == "Invalid Date") {
      setFormError({
        d_establishment_year: "Invalid Date",
      });
      helper.scroll(
        helper.getFirstError({
          d_establishment_year: "Invalid Date",
        })
      );
      return;
    }
    let newDate = getYearFromDatePickerValue(date);

    let currentYear = new Date().getFullYear();

    values.d_establishment_year = newDate;
    let errors = await validate({ ...values });

    setFormError(errors);
    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }
    if (newDate > currentYear || newDate < minYear) {
      setFormError({
        d_establishment_year: "Date must be within the last 50 years",
      });
      helper.scroll(
        helper.getFirstError({
          d_establishment_year: "Date must be within the last 50 years",
        })
      );
      return;
    }

    const status = currentStep + 1;
    let saveStatus = status;
    if (BusinessAccountContext?.data?.status > currentStep) {
      saveStatus = BusinessAccountContext.data.status;
    }
    let data = await http.post(
      base_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      {
        d_establishment_year: newDate,
        status: saveStatus,
      }
    );
    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        ...values,
        status: saveStatus,
      });
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setDate(
      BusinessAccountContext?.data?.d_establishment_year !== ""
        ? dayjs(BusinessAccountContext?.data?.d_establishment_year)
        : ""
    );
    setValues(() => ({
      d_establishment_year:
        BusinessAccountContext?.data?.d_establishment_year !== ""
          ? dayjs(BusinessAccountContext?.data?.d_establishment_year)
          : "",
    }));
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      progressStatus((6 / 11) * 100);
    }
  }, [isActive]);
  // useEffect(() => {
  //   progressStatus((currentStep / totalSteps) * 100);
  // }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>Year of establishment*</h1>
        <p className={style.description}></p>
        <div id="d_establishment_year_error">
          <p className={`${style.rstep02Error} ${style.error}`}>
            {formError.d_establishment_year}
          </p>
        </div>
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
                        borderColor: lightTheme ? "#111" : "fff",
                      },
                  }}
                  value={date || null}
                  onChange={(newdate) => handleDateChange(newdate)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
      </div>

      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div className={style.next_button} onClick={handleSubmit}>
            <div className={style.text}>Next</div>
            <img
              src={rightarrowblack}
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

export default FDStep04LT;
