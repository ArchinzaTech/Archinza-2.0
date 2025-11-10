import React from "react";
import { checkiconWhite, errorFailedWhite } from "../../images";
export default function ToastMsg({ message, danger }) {
  return (
    <div className="otp_box">
      <img
        width={39}
        height={39}
        src={
          message === "Invalid OTP" ||
          danger ||
          message === "Invalid mobile number"
            ? errorFailedWhite
            : checkiconWhite
        }
        className="otp_resend_icon"
        alt="icon"
      />
      <p className="title">{message}</p>
    </div>
  );
}
