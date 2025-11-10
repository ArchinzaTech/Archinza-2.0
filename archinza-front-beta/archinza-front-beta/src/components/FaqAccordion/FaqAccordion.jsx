import { useEffect, useRef, useState } from "react";
import "./faqaccordion.scss";
import { accMinusIcon, accPlusIcon } from "../../images";
import useTheme from "../../components/useTheme/useTheme";
export const FaqAccordion = ({
  items,
  borderLeft = false,
  firstActive = false,
}) => {
  const [openIndex, setOpenIndex] = useState(firstActive === true ? 0 : "");
  const activeAccordionRef = useRef(null);
  const { theme } = useTheme()

  const handleItemClick = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const scrollToActiveAccordion = () => {
    if (activeAccordionRef.current) {
      activeAccordionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    scrollToActiveAccordion();
  }, [openIndex]);

  return (
    <>
      {items.map((item, index) => (
        <div
          className={`${
            borderLeft === true ? "faqborder-accordion" : "faqaccordion-wrapper"
          } ${openIndex === index ? "active" : ""}`}
          key={index}
          ref={openIndex === index ? activeAccordionRef : null}
        >
          <div
            className="faqaccordion-title"
            onClick={() => handleItemClick(index)}
          >
            <span>{item.title}</span>
            {/* <span className="faq_button_icon">{openIndex === index ? "-" : "+"}</span> */}
            <img src={openIndex === index ? accMinusIcon : accPlusIcon } alt="icon" className="faq_button_icon"/>
          </div>
          <div
            className={`faqaccordion-item ${openIndex === index ? "active" : ""}`}
          >
            <div
              className="faqaccordion-content"
              dangerouslySetInnerHTML={{ __html: item.content }}
              style={{
                      color: theme === "light" ? "#000" : "",
                    }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
