import { protag } from "../../images";
import style from "./radiobutton.module.scss";

const RadioButton = ({
  className,
  lightTheme,
  label,
  labelId,
  isPro,
  extraSpace = false,
  labelClass = "",
  disabled = false,
  checked,
  onChange,
  value,
  isOnline,
  deSelectedItem = false,
  ...rest
}) => {
  const classNames = [className];
  const handleLabelClick = (e) => {
    if (checked) {
      onChange({ target: { name: rest.name, value: "", checked } });
    } else {
      onChange({ target: { name: rest.name, value, checked } });
    }
  };
  return (
    <>
      <li
        className={`${classNames.map((item) => {
          return style[item] + " ";
        })} ${style.radio_wrapper} ${
          lightTheme ? style.radio_wrapper_light : style.radio_wrapper_dark
        }`}
      >
        {isPro === true && (
          <img
            width={41}
            height={21}
            src={protag}
            alt="pro"
            className={style.protag_img}
            loading="lazy"
          />
        )}
        <input
          className={style.radio_input}
          type="radio"
          id={labelId}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          value={value}
          {...rest}
        />
        {deSelectedItem === true ? (
          <label
            className={`${labelClass} ${style.radio_label} ${
              extraSpace === true && style.extraSpace
            }`}
            htmlFor={labelId}
            onClick={handleLabelClick}
          >
            {label}
          </label>
        ) : (
          <label
            className={`${labelClass} ${style.radio_label} ${
              extraSpace === true && style.extraSpace
            }`}
            htmlFor={labelId}
             style={{cursor:"default"}}
          >
            {label}
          </label>
        )}
      </li>
    </>
  );
};

export default RadioButton;
