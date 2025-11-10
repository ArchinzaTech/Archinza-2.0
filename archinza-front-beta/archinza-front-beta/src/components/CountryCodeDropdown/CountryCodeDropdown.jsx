import style from "./countrycode.module.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";
import { dropdownIcon } from "../../images";

const darkTheme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    mode: "dark",
  },
});

const lighttheme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    mode: "light",
  },
});

const CountryCodeDropdown = ({
  lightTheme,
  textLabel,
  data,
  // onChange,
  value,
  ...rest
}) => {
  const { width } = useWindowSize();
  const { key, ...otherProps } = rest;

  return (
    <>
      <ThemeProvider theme={lightTheme ? lighttheme : darkTheme}>
        <CssBaseline />
        <Autocomplete
          popupIcon={
            <img
              src={dropdownIcon}
              alt="dropdown"
              // className="custom_auto_drop_icon_uniq"
              className={style.custom_auto_drop_icon_uniq}
            />
          }
          className={`country-code-wrapper ${
            lightTheme
              ? style.autocomplete_dropdown_lt
              : style.autocomplete_dropdown
          }`}
          // className={
          //   lightTheme
          //     ? style.autocomplete_dropdown_lt
          //     : style.autocomplete_dropdown
          // }
          options={data}
          disableClearable
          componentsProps={{
            paper: {
              sx: {
                width: 500,
                borderRadius: width > 768 ? "10px" : "10px",
              },
            },
          }}
          autoHighlight
          getOptionLabel={(option) => `+ ${option.phone_code}`}
          filterOptions={(options, { inputValue }) => {
            const filterValue = inputValue.toLowerCase();
            return options.filter(
              (option) =>
                option.iso3.toLowerCase().includes(filterValue) ||
                option.name.toLowerCase().includes(filterValue) ||
                option.phone_code.includes(filterValue) ||
                `+${option.phone_code}`.includes(filterValue)
            );
          }}
          // onChange={onChange}
          sx={{
            color: lightTheme ? "#111" : "fff",
            "& fieldset": {
              borderRadius: width > 768 ? "10px" : "10px",
              border: "1px solid #707070",
              color: lightTheme ? "#111" : "fff",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: width > 768 ? "10px" : "10px",
            },
            "& label": {
              lineHeight: width > 768 ? "2em" : "1.5em",
              color: lightTheme ? "#111" : "fff",
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
                border: "1px solid #707070",
              },
            "& .MuiSvgIcon-root ": {
              fill: "#f77b00 !important",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "1px solid #707070", 
              },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #707070", 
            },
          }}
          renderOption={(props, option) => (
            <Box
              className={style.option_list}
              component="li"
              {...props}
              key={option.iso3}
              sx={{
                minWidth: 450,
                zIndex: 9,
                overflow: "visible",
              }}
            >
              <span>{option.iso3}</span>
              <span>{option.name}</span>
              <span>+{option.phone_code}</span>
            </Box>
          )}
          value={value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={textLabel}
              inputProps={{
                style: {
                  fontSize: width > 768 ? "1.25em" : "1.25em",
                  // height: "2em",
                },
                ...params.inputProps,
                // autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option?.phone_code == value?.phone_code
          }
          {...otherProps}
        />
      </ThemeProvider>
    </>
  );
};

export default CountryCodeDropdown;
