import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";
import "./selectdropdown.scss";
import { dropdownIcon } from "../../images";

const darkTheme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    mode: "dark",
  },
});
const lightThemed = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    mode: "light",
  },
});

const SelectDropdown = ({
  label,
  labelId,
  data,
  lightTheme,
  classProp,
  ...rest
}) => {
  const [menuItem] = useState({ data });
  const { width } = useWindowSize();
  const classNames = [classProp];

  const menuList = data.map((option) => (
    <MenuItem value={option} key={option}>
      {option}
    </MenuItem>
  ));

  return (
    <>
      <ThemeProvider theme={lightThemed}>
        <CssBaseline />
        <FormControl fullWidth className={classProp}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            className={`select_box `}
            labelId={labelId}
            label={label}
            {...rest}
            // error={true}
            inputProps={{
              style: {
                fontSize: width > 768 ? "1.25em" : "1.25em",
                borderRadius: width > 768 ? "10px" : "10px",
              },
            }}
            IconComponent={() => (
              <img
                src={dropdownIcon}
                alt="dropdown"
                style={{ width: "0.8em", marginRight: "1em" }}
              />
            )}
            sx={{
              color: "#111",
              fontSize: width > 768 ? "16px" : "16px",
              "& fieldset": {
                color: "#111",
              },
              "& .MuiSelect-select": {
                textAlign: "left",
              },
              "& .select_box .Mui-focused": {
                color: "#111",
                textAlign: "left",
              },
              ".MuiOutlinedInput-notchedOutline": {
                background: "rgba(255, 255, 255, 1)",
                borderColor: "#707070",
                color: "#111",
                zIndex: "-1",
                borderRadius: width > 768 ? "10px" : "10px",
              },
              "& label": {
                lineHeight: width > 768 ? "2em" : "1.5em",
                color: "#111",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#707070",
                color: "#111",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#707070",
                color: "#111",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderRadius: width > 768 ? "10px" : "10px",
                border: "1px solid #707070",
              },
              "& .MuiSelect-root .MuiSelect-filled ": {
                border: "1px solid #707070",
              },
              "& .Mui-error": {
                color: "red",
              },
              "& .MuiSvgIcon-root ": {
                fill: "#f77b00 !important",
              },
            }}
          >
            {menuList}
          </Select>
        </FormControl>
      </ThemeProvider>
      {/* {lightTheme ? (
      ) : (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <FormControl fullWidth>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
              key={key}
              className="select_box"
              labelId={labelId}
              id={id}
              value={age}
              label={label}
              {...props}
              // error={true}
              onChange={handleChange}
              inputProps={{
                style: {
                  fontSize: width > 768 ? "1.25em" : "1.25em",
                },
              }}
              sx={{
                fontSize: width > 768 ? "1.25em" : "1.25em",
                "& .MuiSelect-select": {
                  textAlign: "left",
                },
                "& .select_box .Mui-focused": {
                  color: "#fff",
                  textAlign: "left",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.3)",
                  color: "#fff",
                  borderRadius: width > 768 ? "10px" : "10px",
                  background: "rgba(228, 219, 233, 0.05)",
                },
                "& label": {
                  lineHeight: width > 768 ? "2em" : "1.5em",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                  color: "#fff",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.3)",
                  color: "#fff",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderRadius: width > 768 ? "10px" : "10px",
                  border: "1px solid #707070",
                },
                "& .MuiSelect-root .MuiSelect-filled ": {
                  border: "1px solid #707070",
                },
                "& .Mui-error": {
                  color: "red",
                },
                "& .MuiSvgIcon-root ": {
                  fill: "#f77b00 !important",
                },
              }}
            >
              {menuList}
            </Select>
          </FormControl>
        </ThemeProvider>
      )} */}
    </>
  );
};
export default SelectDropdown;
