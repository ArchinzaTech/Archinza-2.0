import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React from "react";
import style from "./yearpicker.module.scss";
import { useWindowSize } from "react-use";
import dayjs from "dayjs";

const YearPicker = ({ lightTheme, classProp, onChange, value, ...props }) => {
  const { width } = useWindowSize();
  const startDate = dayjs("1974-01-01T00:00:00.000");
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 50;
  const minDate = new Date(minYear, 0, 1);

  return (
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
          onChange={onChange}
          value={value || null}
          inputProps={{
            style: {
              fontSize:
                classProp === "business_edit_year" ? "1.125em" : "1.25em",
              color: lightTheme ? "111" : "fff",
              borderRadius: width > 768 ? "10px" : "10px",
              WebkitBoxShadow: "0 0 0 1000px transparent inset",
            },
          }}
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
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default YearPicker;
