import TextField from "@mui/material/TextField";
import style from "./fulltextfield.module.scss";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";
import { useEffect, useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import {
  eyeIconClose,
  eyeIconOpen,
  whatsappCircleOrange,
  XCircleOrange,
} from "../../images";

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

const FullWidthTextField = ({
  classProp,
  lightTheme,
  autoComplete,
  type,
  ...rest
}) => {
  const { width } = useWindowSize();
  const classNames = [classProp];

  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <ThemeProvider theme={lightTheme ? lightThemed : darkTheme}>
        <CssBaseline />
        <TextField
          // key={Math.random()}
          className={`${classNames.map((item) => {
            return style[item] + " ";
          })} ${
            lightTheme ? style.fullwidth_input_light : style.fullwidth_input
          }`}
          fullWidth
          autoComplete
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          inputProps={{
            style: {
              fontSize: lightTheme ? "1.125em" : "1.25em",
              color: lightTheme ? "111" : "fff",
              borderRadius: width > 768 ? "10px" : "10px",
              WebkitBoxShadow: "0 0 0 1000px transparent inset",
            },
          }}
          InputProps={{
            disableRipple: true,
            endAdornment: isPasswordField && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  disableRipple
                >
                  <img
                    src={showPassword ? eyeIconClose : eyeIconOpen}
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={width > 767 ? 24 : 20}
                    height={width > 767 ? 24 : 20}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& fieldset": {
              borderRadius: width > 768 ? "10px" : "10px",
              border: "1px solid #707070",
            },

            // input label when focused
            "& label": {
              lineHeight: width > 768 ? "2em" : "1.5em",
              color: lightTheme ? "111" : "fff",
            },
            "& label.Mui-focused": {
              color: lightTheme ? "111" : "fff",
              borderColor: "#707070",
            },
            // focused color for input with variant='standard'
            "& .MuiInput-underline:after": {
              borderBottomColor: "#707070",
            },
            // focused color for input with variant='filled'
            "& .MuiFilledInput-underline:after": {
              borderBottomColor: "#707070",
            },
            // focused color for input with variant='outlined'
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                border: "1px solid #707070",
                borderColor: "#707070",
              },
              "&:hover fieldset": {
                border: "1px solid #707070",
              },
            },
          }}
          disabled={false}
          {...rest}
        />
      </ThemeProvider>
    </>
  );
};

export default FullWidthTextField;
