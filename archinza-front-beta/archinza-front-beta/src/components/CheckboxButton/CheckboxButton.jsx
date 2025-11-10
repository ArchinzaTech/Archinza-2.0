import style from "./checkboxbutton.module.scss";

const CheckboxButton = ({
  className,
  label,
  labelId,
  isChecked,
  lightTheme,
  ...rest
}) => {
  const classNames = [className];
  return (
    <>
      <div
        className={`${classNames.map((item) => {
          return style[item] + " ";
        })} ${style.checkbox_wrapper} ${
          lightTheme
            ? style.checkbox_wrapper_light
            : style.checkbox_wrapper_dark
        } checkboxbutton_checkbox_wrapper`}
      >
        <input
          className={`${style.checkbox_input} checkboxbutton_checkbox_input`}
          type="checkbox"
          value={label}
          name="checkbox"
          id={labelId}
          checked={isChecked}
          {...rest}
        />
        <label className={`${style.checkbox_label} checkboxbutton_checkbox_label`} htmlFor={labelId}>
          {label}
          <div className={`${style.close} checkboxbutton_close`}></div>
        </label>
      </div>
    </>
  );
};

export default CheckboxButton;
