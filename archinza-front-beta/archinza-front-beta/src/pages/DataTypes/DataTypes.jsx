import "./datatypes.scss";
import FullWidthTextField from "../../components/TextField/FullWidthTextField";
import { countries } from "../../db/dataTypesData";
import CountryCodeDropdown from "../../components/CountryCodeDropdown/CountryCodeDropdown";
import { useEffect, useState } from "react";
import RadioButton from "../../components/RadioButton/RadioButton";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import CheckboxButton from "../../components/CheckboxButton/CheckboxButton";
import BorderLinearProgress from "../../components/ProgressBar/ProgressBar";
import AutoCompleteField from "../../components/AutoCompleteField/AutoCompleteField";
import FooterV2 from "../../components/FooterV2/FooterV2";
import AutoCompleteOthers from "../../components/AutoCompleteOthers/AutoCompleteOthers";
import SelectDropdown from "../../components/SelectDropdown/SelectDropdown";
import TextFieldWithIcon from "../../components/TextFieldWithIcon/TextFieldWithIcon";
import { editiconorange } from "../../images";

const servicesDropdownArr = [
  "Service 01",
  "Service 02",
  "Service 03",
  "Service 04",
  "Service 05",
];

const DataTypes = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <section className="datatypes_sec1">
        <div className="my_container">
          <FullWidthTextField lightTheme label="Full name?*" />
          <br />
          <br />
          <br />
          <br />
          <TextFieldWithIcon lightTheme label="E-mail*" icon={editiconorange} />
          <br />
          <br />
          <br />
          <br />
          <div className="row">
            <div className="col-4 col-sm-4 col-md-4 ps-0">
              <CountryCodeDropdown lightTheme textLabel="Code" />
            </div>
            <div className="col-8 col-sm-8 col-md-8 pe-0">
              <FullWidthTextField label="Phone*" type="number" />
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <AutoCompleteField lightTheme textLabel="Country*" data={countries} />
          <br />
          <br />
          <br />
          <br />
          <AutoCompleteOthers lightTheme textLabel="Others*" data={countries} />
          <br />
          <br />
          <br />
          <br />
          <BorderLinearProgress variant="determinate" value={progress} />
          <br />
          <br />
          <br />
          <br />
          <ul>
            <RadioButton
              label="BUSINESS/FIRM OWNER"
              labelId="BUSINESS/FIRM OWNER"
              isPro
            />
            <RadioButton label="STUDENT" labelId="STUDENT" isPro />
            <RadioButton
              label="WORKING PROFESSIONAL"
              labelId="TEAM MEMBER"
              isPro
              lightTheme
            />
            <RadioButton
              label="DESIGN ENTHUSIAST"
              labelId="DESIGN ENTHUSIAST"
            />
          </ul>
          <br />
          <br />
          <br />
          <br />
          <PasswordInput hideIcon lightTheme />
          <br />
          <br />
          <br />
          <br />
          <FullWidthTextField label="Email*" type="email" />
          <br />
          <br />
          <br />
          <br />
          <FullWidthTextField label="Set Password*" type="password" />
          <br />
          <br />
          <br />
          <br />
          <FullWidthTextField label="Whatsapp Number*" type="number" />
          <br />
          <br />
          <br />
          <br />
          <ul>
            <CheckboxButton
              label="Jobs/internships"
              labelId="Jobs/internships"
            />
            <CheckboxButton
              label="Searching products materials for projects"
              labelId="Searching products materials for projects"
              lightTheme
            />
            <CheckboxButton
              label="Knowledge on trends/materials"
              labelId="Knowledge on trends/materials"
            />
          </ul>
          <br />
          <br />
          <br />
          <br />
          <SelectDropdown
            label="Select Services*"
            labelId="selectservices"
            data={servicesDropdownArr}
            // lightMode
          />
          <br />
          <br />
          <br />
          <br />
        </div>
        <FooterV2 />
      </section>
    </>
  );
};

export default DataTypes;
