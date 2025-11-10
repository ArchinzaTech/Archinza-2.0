import React from "react";
import "./oflineProfileMsg.scss";
import { profileOfflineIcon } from "../../../../images";
const OflineProfileMsg = ({
  isTrialExpired = false,
  isVerified = false,
  emptyFields = [],
  verificationStatus = null,
  pageStatus = "offline",
}) => {
  const getMessageContent = () => {
    // Case 2: Highest priority - Trial expired
    if (isTrialExpired) {
      return {
        // icon: "⏳",
        heading: "Subscription expired",
        message:
          "Your profile went offline because your subscription plan expired. Renew now to make it online again.",
      };
    }

    // Case 5: Verification pending
    if (verificationStatus === "pending") {
      return {
        // icon: "🕒",
        heading: "Verification pending",
        message:
          "Your business verification is currently under process. We will notify you once the verification is complete.",
      };
    }

    // Case 4: Not verified
    if (!isVerified && emptyFields?.length === 0) {
      return {
        // icon: "🕒",
        heading: "Verify Now",
        message:
          "Your business isn't live yet. Verify now to go online and build instant credibility with potential clients.",
      };
    }

    // Case 3: Profile incomplete
    if (emptyFields.length > 0) {
      return {
        // icon: "⚠️",
        heading: "Your business page is incomplete",
        message:
          "Add the missing details to make your offerings visible, attract relevant leads, and appear in industry searches.",
      };
    }

    // Case 1: Default - Profile manually turned offline (only shown when all other cases are resolved)
    if (pageStatus === "offline") {
      return {
        // icon: "🚫",
        heading: "Your profile is offline",
        message:
          "You've turned your profile offline. Switch back online to showcase your work, increase visibility, attract clients, and stay discoverable in the industry.",
      };
    }

    return null;
  };

  const messageContent = getMessageContent();

  if (!messageContent) return null;
  return (
    <div className="offline_msg_wrapper">
      <div className="offline_msg_f_row">
        <div className="offline_msg_icon_wrapper">
          <img src={profileOfflineIcon} alt="offline" />
        </div>
        <div className="offline_msg_heading_wrapper">
          <span dangerouslySetInnerHTML={{ __html: messageContent.heading }} />
        </div>
      </div>
      <div className="offline_msg_s_row">
        <span dangerouslySetInnerHTML={{ __html: messageContent.message }} />
      </div>
    </div>
  );
};

export default OflineProfileMsg;
