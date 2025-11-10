import TextField from "@mui/material/TextField";
import style from "./fulltextfieldwithicon.module.scss";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useWindowSize } from "react-use";

const TextFieldWithIcon = ({ icon, lightTheme, onIconCLick, ...rest }) => {
  const { width } = useWindowSize();
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

  return (
    <>
      <ThemeProvider theme={lightTheme ? lightThemed : darkTheme}>
        <CssBaseline />
        <div className={style.textfield_wrapper}>
          <TextField
            className={style.fullwidth_input}
            fullWidth
            disabled={rest.disabled}
            inputProps={{
              style: {
                fontSize: width > 768 ? "1.25em" : "1.25em",
                WebkitBoxShadow: lightTheme
                  ? "0 0 0 1000px white inset"
                  : "0 0 0 1000px transparent inset",
                WebkitTextFillColor: lightTheme ? "#111" : "none",
              },
            }}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                opacity: 0.2,
                cursor: "not-allowed",
            
              },
              
              "& fieldset": {
                borderRadius: width > 768 ? "10px" : "10px",
                border: "1px solid #707070",
              },
              // input label
              "& label": {
                lineHeight: width > 768 ? "2em" : "1.5em",
              },
              // input label when focused
              "& label.Mui-focused": {
                color: lightTheme ? "#111" : "fff",
              },
              // focused color for input with variant='standard'
              "& .MuiInput-underline:after": {
                borderBottomColor: lightTheme ? "#111" : "fff",
              },
              // focused color for input with variant='filled'
              "& .MuiFilledInput-underline:after": {
                borderBottomColor: lightTheme ? "#111" : "fff",
              },
              "& .MuiOutlinedInput-input": {
                paddingRight: "5em",
              },
              // focused color for input with variant='outlined'
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: lightTheme ? "#111" : "fff",
                },
              },
            }}
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

export default TextFieldWithIcon;
