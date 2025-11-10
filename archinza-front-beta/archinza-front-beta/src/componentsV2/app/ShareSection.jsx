import { FaWhatsapp, FaLinkedinIn, FaLink } from "react-icons/fa";
import "./ShareSection.scss";
import ToastMsg from "../../components/ToastMsg/ToastMsg";
import { toast } from "react-toastify";
import config from "../../config/config";
import { Link } from "react-router-dom";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import useTheme from "../../components/useTheme/useTheme";

const ShareSection = ({ openPopup }) => {
  const { theme } = useTheme();
  const shareUrl = encodeURI(window.location.href);
  const shareOnWhatsApp = () => {
    const message = `*Archinza*%0AArchinza matches you with the right people and products in the industry effortlessly%0A%0A🔗 Check it out here:%0A${shareUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=Archinza&summary=Archinza Post Test 1`,
      "_blank"
    );
  };

  const handleCopyUrl = async (e) => {
    e.preventDefault();
    try {
      const currentUrl = window.location.href;

      // Fallback method for older browsers
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          toast(
            <ToastMsg message={`URL copied to clipboard`} />,
            config.success_toast_config
          );
        } catch (err) {
          console.error("Unable to copy", err);
          toast(
            <ToastMsg message={`Failed to copy URL`} />,
            config.error_toast_config
          );
        }

        document.body.removeChild(textArea);
        return;
      }

      // Modern Clipboard API method
      await navigator.clipboard.writeText(currentUrl);
      toast(
        <ToastMsg message={`URL copied to clipboard`} />,
        config.success_toast_config
      );
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast(
        <ToastMsg message={`Failed to copy URL`} />,
        config.error_toast_config
      );
    }
  };

  return (
    <section
      className={`share-section  ${
        theme === "dark" ? "dark_mode--theme-styles" : ""
      }`}
    >
      <div className="share-container">
        {/* Did You Know */}
        <div
          className="did-you-know-card"
          style={{
            backgroundColor: theme === "dark" ? "#ffffff1a" : "",
            color: theme === "dark" ? "#ffffffcc" : "",
          }}
        >
          <h2 className="card-title">Did you know?</h2>
          <p
            className={`card-description  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            AI-powered stakeholder analysis utilizes sentiment analysis and
            predictive algorithms to foresee and address potential conflicts
            before they arise.
          </p>
        </div>

        {/* Share */}
        <div className="share-content">
          <h3 className="share-title">
            <span className="orange-text">Love Archinza?</span> Share it with
            your friends!
          </h3>
          <p
            className={`share-description  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            Invite your network to experience the simplicity and efficiency of
            AI-based matchmaking.
          </p>
          <p className="share-cta">
            <span className="orange-text">SHARE ARCHINZA NOW</span> AND MAKE A
            DIFFERENCE!
          </p>

          {/* Share Icons */}
          <div className="share-icons">
            <div
              // href="#"
              onClick={shareOnWhatsApp}
              aria-label="Share on WhatsApp"
              className="share-icon whatsapp"
              style={{
                cursor: "pointer",
              }}
            >
              <FaWhatsapp />
            </div>
            <div
              // href="#"
              onClick={shareOnLinkedIn}
              aria-label="Share on LinkedIn"
              className="share-icon linkedin"
              style={{
                cursor: "pointer",
              }}
            >
              <FaLinkedinIn />
            </div>
            <div
              // href="#"
              aria-label="Copy Link"
              className="share-icon link"
              onClick={handleCopyUrl}
              style={{
                cursor: "pointer",
              }}
            >
              <FaLink />
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="get-started-content">
          <h3 className="get-started-title">Get Started for Free</h3>
          <p
            className={`get-started-description  ${
              theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
            }`}
          >
            Archinza matches you with the right people and products in the
            industry—effortlessly.
          </p>
          <p className="get-started-cta">
            WHY WAIT? <span className="orange-text">TRY ARCHINZA NOW!</span>
          </p>

          {/* CTA Button */}
          <Link to={accountCategoryURL} className="cta-button">
            {/* <button className="cta-button" onClick={openPopup}> */}
            Get Early Access – <span className="strikethrough">₹5999</span> FREE
            {/* </button> */}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
