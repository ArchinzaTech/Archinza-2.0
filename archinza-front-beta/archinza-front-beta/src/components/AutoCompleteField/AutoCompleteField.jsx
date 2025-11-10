import style from "./autocompletefield.module.scss";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";
import { VirtualizedListBox } from "../VirtualizedListBox/VirtualizedListBox";
import { dropdownIcon } from "../../images";
import { useLocation } from "react-router-dom";
import { businessProfileEditURL2 } from "../helpers/constant-words";

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

const AutoCompleteField = ({
  classProp,
  textLabel,
  data,
  lightTheme,
  icon = dropdownIcon,
  ...rest
}) => {
  const { width } = useWindowSize();
  const classNames = [classProp];
  const location = useLocation();
  // const isBusinessDetails = location.pathname.includes("business/business-details");
  const isBusinessEdit = location.pathname.includes(businessProfileEditURL2);
  // const isPersonalDetails = location.pathname.includes("/register/personal/basic-details");


  return (
    <>
      <ThemeProvider theme={lightTheme ? lightThemed : darkTheme}>
        <CssBaseline />
        <div className={style.autocomplete_wrapper}>
          <Autocomplete
            className={` ${classNames.map((item) => {
              return style[item] + " ";
            })} ${
              lightTheme
                ? style.autocomplete_dropdown_light
                : style.autocomplete_dropdown
            }`}
            options={data}
            autoHighlight
            disableClearable
            ListboxComponent={VirtualizedListBox}
            getOptionLabel={(option) => option.value}
            getOptionDisabled={(option) => option.disabled === true}
            sx={{
              "& fieldset": {
                borderRadius: width > 768 ? "10px" : "10px",
                border: "1px solid #707070",
              },
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
              "& .MuiSvgIcon-root ": {
                fill: "#f77b00 !important",
                display: icon ? "none" : "block",
              },
              // ✅ Fix floating label gap
              ...(isBusinessEdit  && {
                "& .MuiOutlinedInput-notchedOutline legend": {
                  maxWidth: "0.01px",
                  transition: "max-width 150ms ease-in-out",
                },
                "& .MuiInputLabel-shrink + .MuiOutlinedInput-notchedOutline legend":
                  {
                    maxWidth: "1000px",
                  },
                "& .MuiInputLabel-root": {
                  backgroundColor: "#fff",
                  padding: "0 4px",
                  marginLeft: "-4px",
                  lineHeight: "1.8em",
                },
              }),
            }}
            // renderOption={(props, option) => (
            //   <Box
            //     className={style.option_list}
            //     component="li"
            //     {...props}
            //     key={option.id}
            //   >
            //     {option.value}
            //   </Box>
            // )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={textLabel}
                inputProps={{
                  style: {
                    fontSize: width > 768 ? "1.25em" : "1.25em",
                    cursor: "pointer",
                  },
                  ...params.inputProps,
                }}
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            {...rest}
          />
          {icon && (
            <div className={style.img_wrapper}>
              <img src={icon} alt="icon" className={style.input_icon} />
            </div>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default AutoCompleteField;
