import React, { useEffect, useState } from "react";
import style from "../TeamAccess/teammember.module.scss";
import CheckboxButton from "../../../components/CheckboxButton/CheckboxButton";
import LogoutText from "../../../components/LogoutText/LogoutText";
import { plusicon, rightarrowwhite } from "../../../images";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Input } from "@mui/material";

const darkTheme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    mode: "dark",
  },
});

const questionArr = [
  {
    title: "Design/Consult/Manage",
    options: [
      "Architect",
      "Interior Designer",
      "Stylist",
      "Curator",
      "Design & Build",
      "PMC",
      "Vastu",
      "Fengshui",
      "Astro-Related",
      "Structure",
      "Electrical",
      "Plumbing",
      "HVAC",
      "Lighting",
      "Product/industrial",
      "Furniture design",
      "Landscape",
      "Waterbody",
      "Urban",
      "Transport",
      "Infrastructure",
      "Sustainability/LEED",
      "Restoration/Conservation",
    ],
  },
  {
    title: "Make/Build/Curate/Sell",
    options: [
      "Contractor/Manufacturer",
      "Retailer/Reseller/Distributor",
      "Material supplier",
      "Product creator",
      "Curator",
      "Artist",
    ],
  },
  {
    title: "Supporting Design",
    options: [
      "Influencer/Public figure",
      "Public Relations/Media & Marketing/BD",
      "Industry Events",
      "Content/Journalism/Photography",
      "BIM/Visualiser",
      "Admin/Human Resources",
    ],
  },
];

const TAStep06 = ({ nextStep, currentStep, totalSteps, progressStatus }) => {
  const [tabActive, setTabActive] = useState(0);

  const accordionList = questionArr.map((item, i) => (
    <React.Fragment key={item.title}>
      <li
        className={`${style.categoryTab} ${
          tabActive === i ? style.active : ""
        }`}
        onClick={() => setTabActive(i)}
        key={i}
      >
        <div className={style.title_wrap}>
          <h5 className={style.title}>{item.title}</h5>
          <div className={style.icon}>{tabActive === i ? "-" : "+"}</div>
        </div>
        <div
          className={`${style.tab_content} ${
            tabActive === i ? style.active : ""
          }`}
        >
          {item.options.map((option) => (
            <React.Fragment key={option}>
              <CheckboxButton label={option} labelId={option} />
            </React.Fragment>
          ))}
          <div className={style.add_more_wrap}>
            <div className={style.cta_wrap}>
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Input
                  outlined="false"
                  placeholder="Add more"
                  inputProps={{
                    style: {
                      padding: 0,
                      margin: 0,
                    },
                  }}
                  fullWidth
                  disableUnderline
                  className={style.addmore_input}
                  sx={{}}
                />
              </ThemeProvider>
              <img
                src={plusicon}
                alt="icon"
                className={style.icon}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  ));

  useEffect(() => {
    progressStatus((currentStep / totalSteps) * 100);
  }, [currentStep, progressStatus, totalSteps]);

  return (
    <>
      <div className={style.text_container}>
        <h1 className={style.title}>
          Your Role In The Design & Build Industry.
        </h1>
        <p className={style.description}>
          To proceed, you must choose a single tab and make selections
          exclusively within that tab; you cannot combine options from all three
          tabs.
        </p>
      </div>
      <div className={`${style.steps} ${style.step01}`}>
        <ul className={style.title_list}>{accordionList}</ul>
      </div>
      <div className={style.next_logout}>
        <div className={style.cta_wrapper}>
          <div
            className={style.next_button}
            onClick={() => {
              nextStep(2);
              window.scrollTo(0, 0);
            }}
          >
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
    </>
  );
};

export default TAStep06;
