import React, { useEffect, useState } from "react";
import style from "../Form/formfivelighttheme.module.scss";
import LogoutText from "../../../components/LogoutText/LogoutText";
import {
  constructin_icon,
  geometryIcon,
  manufacture_icon,
  marketing_icon,
  retail_icon,
  rightarrowwhite,
} from "../../../images";
import FormFiveModal from "../../../components/FormFiveModal/FormFiveModal";
import RadioButton from "../../../components/RadioButton/RadioButton";
import http from "../../../helpers/http";
import config from "../../../config/config";
import { useBusinessContext } from "../../../context/BusinessAccount/BusinessAccountState";
import Joi from "joi";
import helper from "../../../helpers/helper";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import BusinessCategory from "../../../components/BusinessCategory/BusinessCategory";
import LightThemeBackground from "../../../Animations/LightThemeBackground/LightThemeBackground";
import { TextField } from "@mui/material";
import { useWindowSize } from "react-use";

const iconMap = {
  geometryIcon: geometryIcon,
  constructin_icon: constructin_icon,
  manufacture_icon: manufacture_icon,
  marketing_icon: marketing_icon,
  retail_icon: retail_icon,
};

const RStep01LT = ({
  nextStep,
  previousStep,
  currentStep,
  totalSteps,
  progressStatus,
  isActive,
  goToStep,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [formError, setFormError] = useState({});
  const [values, setValues] = useState({
    business_type: [],
    other_busiess_type: "",
  });
  const [activeIndexes, setActiveIndexes] = useState(new Set());
  const [businessTypes, setBusinessTypes] = useState([]);
  const [otherBusinessTypeId, setOtherBusinessTypeId] = useState(null);

  const handleCardClick = (index) => {
    setActiveIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const BusinessAccountContext = useBusinessContext();

  let base_url = config.api_url;
  const joiOptions = config.joiOptions;

  const validate = async (data) => {
    let schemaObj = {
      business_types: Joi.when("other_busiess_type", {
        is: Joi.string().min(1).required(),
        then: Joi.array().optional(),
        otherwise: Joi.array()
          .min(1)
          .required()
          .label("Business Types")
          .messages({
            "array.min": "Please select at least one business type",
          }),
      }),
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

  const handleCheckboxChange = (option, index) => {
    setActiveIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });

    setValues((prevState) => {
      const isAlreadySelected = prevState.business_types.includes(option._id);

      const updatedTypes = isAlreadySelected
        ? prevState.business_types.filter((type) => type !== option._id)
        : [...prevState.business_types, option._id];

      // console.log("Updated business types:", updatedTypes);

      return {
        ...prevState,
        business_types: updatedTypes,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    let errors = await validate(values);
    setFormError(errors);

    if (Object.keys(errors).length) {
      helper.scroll(helper.getFirstError(errors));
      return;
    }

    // const updated_business_types = businessTypes
    //   .concat(
    //     otherBusinessTypeId
    //       ? [{ _id: otherBusinessTypeId, name: "Others" }]
    //       : []
    //   )
    //   .filter((it) => values.business_types.includes(it._id));
    let updated_business_types = businessTypes.filter((it) =>
      values.business_types.includes(it._id)
    );
    if (
      values?.other_busiess_type &&
      values?.other_busiess_type.trim() !== ""
    ) {
      updated_business_types = [...updated_business_types, otherBusinessTypeId];
    }
    const hasOtherThanPrefix4 = updated_business_types.some(
      (bt) => bt.prefix !== "4"
    );

    const hasBusinessTypesChanged = !(
      BusinessAccountContext.data.business_types?.length > 0 &&
      BusinessAccountContext.data.business_types.every((existingType) =>
        values.business_types.includes(existingType._id)
      ) &&
      values.business_types.every((newType) =>
        BusinessAccountContext.data.business_types.some(
          (existingType) => existingType._id === newType
        )
      )
    );

    if (hasBusinessTypesChanged) {
      await http.delete(
        `${base_url}/business/delete-media/${BusinessAccountContext?.data?._id}`
      );
    }

    const dataToSend = {
      ...values,
      status: hasOtherThanPrefix4 ? currentStep + 1 : currentStep + 2,
      ...(hasBusinessTypesChanged && {
        services: [],
        project_sizes: {},
        project_typology: {},
        project_mimimal_fee: {},
        design_style: {},
        avg_project_budget: {},
        project_scope: {},
        project_location: {},
        price_rating: "",
        team_range: {},
      }),
    };

    let data = await http.post(
      base_url +
        `/business/business-details/${BusinessAccountContext?.data?._id}`,
      dataToSend
    );

    if (data) {
      BusinessAccountContext.update({
        ...BusinessAccountContext.data,
        business_types: updated_business_types,
        other_busiess_type: values.other_busiess_type,
        services: hasBusinessTypesChanged
          ? []
          : BusinessAccountContext?.data?.services,
        project_sizes: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.project_sizes,
        project_typology: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.project_typology,
        project_mimimal_fee: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.project_mimimal_fee,
        design_style: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.design_style,
        avg_project_budget: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.avg_project_budget,
        project_scope: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.project_scope,
        project_location: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.project_location,
        price_rating: hasBusinessTypesChanged
          ? ""
          : BusinessAccountContext?.data?.price_rating,
        team_range: hasBusinessTypesChanged
          ? {}
          : BusinessAccountContext?.data?.team_range,
        status: currentStep + 1,
      });

      if (hasOtherThanPrefix4) {
        nextStep();
      } else {
        goToStep(currentStep + 2);
      }
      window.scrollTo(0, 0);
    }
  };

  // const concernList = businessTypes.map((option) => {
  //   // console.log(option);
  //   return (
  //     <React.Fragment key={option._id}>
  //       <CheckboxButton
  //         lightTheme
  //         isChecked={values?.business_types?.includes(option._id)}
  //         label={option?.name}
  //         labelId={option?._id}
  //         onChange={() => handleCheckboxChange(option)}
  //       />
  //     </React.Fragment>
  //   );
  // });

  // new Business Category
  const concernList = businessTypes.map((data) => {
    // console.log(option);
    return (
      <BusinessCategory
        BusinessData={data}
        isActive={activeIndexes.has(data._id)}
        onClick={() => handleCheckboxChange(data, data._id)}
      />
    );
  });

  const fetchBusinessTypes = async () => {
    const { data } = await http.get(`${base_url}/business/business-types`);
    if (data) {
      const otherBusinessType = data.find((it) => it?.name === "Others");
      setOtherBusinessTypeId(otherBusinessType || null);
      const mappedBusinessTypes = data
        .filter((it) => it?.name !== "Others")
        .map((type) => ({
          ...type,
          icon: iconMap[type.icon] || null,
        }));
      setBusinessTypes(mappedBusinessTypes);
    }
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, [currentStep]);

  useEffect(() => {
    if (
      businessTypes.length > 0 &&
      BusinessAccountContext?.data?.business_types
    ) {
      const selectedBusinessTypeIds =
        BusinessAccountContext.data.business_types.map((type) => type._id);

      const otherBusiness = BusinessAccountContext?.data?.business_types?.find(
        (it) => it.name === "Others"
      );

      setValues({
        business_types: selectedBusinessTypeIds || [],
        ...(otherBusiness && {
          other_busiess_type:
            BusinessAccountContext?.data?.other_busiess_type || "",
        }),
      });

      const newActiveIndexes = new Set(selectedBusinessTypeIds);
      setActiveIndexes(newActiveIndexes);
    }
  }, [businessTypes, BusinessAccountContext?.data?.business_types]);

  useEffect(() => {
    if (isActive) {
      progressStatus((currentStep / 18) * 100);
    }
  }, [isActive]);

  const { width } = useWindowSize();
  return (
    <>
      <LightThemeBackground />
      <div className={style.text_container}>
        <p className={style.page_title}>Tell Us About Your Firm/Business</p>
        <h1 className={style.title}>
          What does your business/ firm mainly do? *
        </h1>
        <h2 className={`${style.description} ${style.desc_renovation}`}>
          Help us understand all that you do so Archinza AI™ can know you
          better!
        </h2>
        <p
          className={`${style.description} ${style.select_notice}`}
          style={{
            marginBottom: "3em",
          }}
        >
          <span>Choose as many</span>
          {/* <span className={style.entity} onClick={() => setModalShow(true)}>
            &#9432;
          </span> */}
        </p>
        <div id="business_types_error">
          {formError.business_types && (
            <p className={`${style.rstep02Error} ${style.error}`}>
              {formError.business_types}
            </p>
          )}
        </div>
      </div>
      <div className={`${style.steps} ${style.rstep02}`}>
        {/* <ul className={style.title_list}>{accordionList}</ul> */}
        <ul className={`${style.step02_ul} business_ctg_wrapper`}>
          {concernList}
        </ul>
      </div>

      {/* {values.business_types.find((it) => {
        const business = businessTypes.find((bt) => bt._id === it);
        return business?.name === "Others";
      }) && (
      )} */}
      <>
        <div className={style.text_container}>
          <p
            className={`${style.description} ${style.select_notice}`}
            style={{
              marginBottom: "0em",
              marginTop: "4em",
              fontStyle: "normal",
            }}
          >
            <span>
              Add a short line about your firm’s services, if not mentioned
              above.
            </span>
          </p>
        </div>
        <div className="text_field_others_rsstep01">
          <TextField
            fullWidth
            label="Others"
            name="other_busiess_type"
            variant="outlined"
            value={values.other_busiess_type}
            onChange={handleChange}
            autoComplete="off"
            sx={{
              backgroundColor: "#fff",
              "& fieldset": {
                borderRadius: width > 768 ? "10px" : "5px",
                border: "1px solid #707070",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: width > 768 ? "10px" : "5px",
                fontFamily: "Poppins, sans-serif",
              },
              "& label.Mui-focused": {
                color: "#111",
              },
              "& .MuiInputBase-input": {
                fontFamily: "Poppins, sans-serif",
              },
              "& label": {
                fontFamily: "Poppins, sans-serif",
              },
              "& label.Mui-focused": {
                fontFamily: "Poppins, sans-serif",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: width > 768 ? "10px" : "5px",
                border: "1px solid #707070",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #707070 !important",
                },
            }}
          />
          {formError.other_busiess_type && (
            <p className={`${style.rstep02Error} ${style.error}`}>
              {formError.other_busiess_type}
            </p>
          )}
        </div>
      </>
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
        </div>
        <LogoutText />
      </div>
      <FormFiveModal
        className="white_theme"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default RStep01LT;
