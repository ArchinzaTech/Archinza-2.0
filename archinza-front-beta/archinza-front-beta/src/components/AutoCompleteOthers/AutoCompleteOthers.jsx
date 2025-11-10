import style from "./autocompleteothers.module.scss";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";
import { dropdownarrow, dropdownIcon } from "../../images";
import { VirtualizedListBox } from "../VirtualizedListBox/VirtualizedListBox";
import { Box } from "@mui/material";
import { useState } from "react";

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

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const filter = createFilterOptions();

const AutoCompleteOthers = ({
  classProp,
  textLabel,
  data,
  lightTheme,
  allowAddOption = true,
  ...rest
}) => {
  const { width } = useWindowSize();
  const classNames = [classProp];
  const [inputValue, setInputValue] = useState("");
  const isBusinessDetailsPage = window.location.pathname.includes(
    "business/business-details"
  );
  const proAccess = window.location.pathname.includes(
    "pro-access"
  );

  return (
    <>
      <ThemeProvider theme={lightTheme ? lightThemed : darkTheme}>
        <CssBaseline />
        <Autocomplete
          getOptionDisabled={(option) => option.disabled === true}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            if (allowAddOption) {
              // Case-insensitive comparison
              const isExisting = options.some(
                (option) =>
                  inputValue.toLowerCase() === option.value.toLowerCase()
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  value: inputValue,
                  label: `Add "${inputValue}"`,
                });
              }
            }

            // Rest of the existing code remains the same
            const taggedOptions = filtered.filter((option) => option.tag);
            if (taggedOptions.length > 0) {
              const tags = taggedOptions.map((option) => option.tag);
              const uniqueTags = [...new Set(tags)];

              uniqueTags.forEach((tag) => {
                const optionsWithSameTag = options.filter(
                  (option) => option.tag === tag
                );
                optionsWithSameTag.forEach((option) => {
                  if (!filtered.some((f) => f.value === option.value)) {
                    filtered.push(option);
                  }
                });
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          freeSolo
          className={`  ${
            lightTheme
              ? style.autocomplete_dropdown_light
              : style.autocomplete_dropdown
          }`}
          options={data}
          autoHighlight
          disableClearable
          getOptionLabel={(option) => option.value}
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
                borderColor: lightTheme ? "#707070" : "fff",
                border: "0.5px solid #707070",
              },
            "& .MuiSvgIcon-root ": {
              fill: "#f77b00 !important",
            },
            ...(isBusinessDetailsPage || proAccess
              ? {}
              : {
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
          renderOption={(props, option) => (
            <Box className={style.option_list} component="li" {...props}>
              {option.label}
            </Box>
          )}
          inputValue={inputValue}
          onInputChange={(event, value, reason) => {
            if (reason === "input") {
              const titleCaseValue = toTitleCase(value);
              setInputValue(titleCaseValue);

              if (rest.onInputChange) {
                rest.onInputChange(event, titleCaseValue, reason);
              }
            } else {
              setInputValue(value);
              if (rest.onInputChange) {
                rest.onInputChange(event, value, reason);
              }
            }
          }}
          // ListboxComponent={VirtualizedListBox}
          renderInput={(params) => (
            <>
              <TextField
                className={classNames.map((item) => {
                  return style[item] + " ";
                })}
                {...params}
                label={textLabel}
                inputProps={{
                  style: {
                    fontSize: width > 768 ? "1.25em" : "1.25em",
                  },
                  ...params.inputProps,
                }}
              />
              <img
                width={10}
                height={8}
                // src={dropdownarrow}
                src={dropdownIcon}
                alt="arrow"
                className={style.autocomplete_drop_arrow}
                id="cutom_drop_arrow"
                loading="lazy"
              />
            </>
          )}
          {...rest}
        />
      </ThemeProvider>
    </>
  );
};

export default AutoCompleteOthers;
