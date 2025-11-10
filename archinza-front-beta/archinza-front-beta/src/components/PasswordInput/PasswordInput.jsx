import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";
import { GlobalStyles } from "@mui/material";
import { eyeIconClose, eyeIconOpen } from "../../images";

const PasswordInput = ({
  hideIcon,
  onChange,
  autoComplete = "current-password",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { width } = useWindowSize();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const darkTheme = createTheme({
    typography: {
      fontFamily: "Poppins",
    },
    palette: {
      mode: "dark",
    },
  });

  return (
    <>
      <GlobalStyles
        styles={{
          "input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
            WebkitTextFillColor: "#fff !important",
            transition: "background-color 5000s ease-in-out 0s",
          },
        }}
      />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {hideIcon ? (
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{
                "& label": {
                  lineHeight: width > 768 ? "2em" : "1.5em",
                },
              }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              autoComplete={autoComplete}
              label="Password "
              inputProps={{
                style: {
                  fontSize: width > 768 ? "1.25em" : "1.25em",
                  borderRadius: width > 768 ? "10px" : "10px",
                },
              }}
              sx={{
                "& fieldset": {
                  borderRadius: width > 768 ? "10px" : "10px",
                  border: "1px solid #707070",
                  background: "rgba(228, 219, 233, 0.05)",
                },
                // input label when focused
                "& label": {
                  lineHeight: width > 768 ? "2em" : "1.5em",
                },
                // input label when focused
                "& label.Mui-focused": {
                  color: "#fff",
                },
                // focused color for input with variant='standard'
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#fff",
                },
                // focused color for input with variant='filled'
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#fff",
                },
                // focused color for input with variant='outlined'
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#707070",
                  },
                },
              }}
              onChange={onChange}
            />
          </FormControl>
        ) : (
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{
                "& label": {
                  lineHeight: width > 768 ? "2em" : "1.5em",
                },
              }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                // <InputAdornment position="end">
                //   <IconButton
                //     aria-label="toggle password visibility"
                //     onClick={handleClickShowPassword}
                //     onMouseDown={handleMouseDownPassword}
                //     edge="end"
                //   >
                //     {showPassword ? <VisibilityOff /> : <Visibility />}
                //   </IconButton>
                // </InputAdornment>
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
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
              }
              label="Password"
              inputProps={{
                style: {
                  fontSize: width > 768 ? "1.25em" : "1.25em",
                  borderRadius: width > 768 ? "10px" : "10px",
                },
              }}
              sx={{
                "& fieldset": {
                  borderRadius: width > 768 ? "10px" : "10px",
                  border: "1px solid #707070",
                  borderWidth: "1px !important",
                  background: "rgba(228, 219, 233, 0.05)",
                },
                "&:hover fieldset": {
                  borderColor: "#707070 !important",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#707070 !important",
                },

                // input label when focused
                "& label": {
                  lineHeight: width > 768 ? "2em" : "1.5em",
                },
                // input label when focused
                "& label.Mui-focused": {
                  color: "#fff",
                },
                // focused color for input with variant='standard'
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#fff",
                },
                // focused color for input with variant='filled'
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#fff",
                },
                // focused color for input with variant='outlined'
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
              onChange={onChange}
            />
          </FormControl>
        )}
      </ThemeProvider>
    </>
  );
};

export default PasswordInput;
