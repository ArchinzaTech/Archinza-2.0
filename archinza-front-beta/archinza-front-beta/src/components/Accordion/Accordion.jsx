import { useEffect, useRef, useState } from "react";
import "./accordion.scss";

export const CustomAccordion = ({
  items,
  borderLeft = false,
  firstActive = false,
}) => {
  const [openIndex, setOpenIndex] = useState(firstActive === true ? 0 : "");
  const activeAccordionRef = useRef(null);

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
            borderLeft === true ? "border-accordion" : "accordion-wrapper"
          } ${openIndex === index ? "active" : ""}`}
          key={index}
          ref={openIndex === index ? activeAccordionRef : null}
        >
          <div
            className="accordion-title"
            onClick={() => handleItemClick(index)}
          >
            <span>{item.title}</span>
            <span className="plus-minus">{openIndex === index ? "-" : "+"}</span>
          </div>
          <div
            className={`accordion-item ${openIndex === index ? "active" : ""}`}
          >
            <div
              className="accordion-content"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
