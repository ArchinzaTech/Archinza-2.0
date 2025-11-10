import React, { useEffect } from "react";
import "./faqs.scss";
import { faqsBanner, faqsBannerWhite } from "../../images";
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb";
import GlowCta from "../../components/GlowCta/GlowCta";
import { FaqAccordion } from "../../components/FaqAccordion/FaqAccordion";
import FooterV2 from "../../components/FooterV2/FooterV2";
import { homeFaqData } from "../../components/Data/homeData";
import { accountCategoryURL } from "../../components/helpers/constant-words";
import useTheme from "../../components/useTheme/useTheme";

const Faqs = () => {
  // const faqsList = homeFaqData.map((item, i) => (
  //   <Accordion.Item eventKey={i + ""} key={i}>
  //     <Accordion.Header>{item.title}</Accordion.Header>
  //     <Accordion.Body>
  //       <div className="accord_desc">{item.desc}</div>
  //     </Accordion.Body>
  //   </Accordion.Item>
  // ));

  const {theme} = useTheme()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="faq_main">
        <img src={theme === "light" ? faqsBannerWhite : faqsBanner} alt="background" className="faq_background" />

        <section className="faq_sec1">
          <div className="my_container">
          <div
              className={`Breadcrumb_container ${
                theme === "light"
                  ? "breadcrumb_conatiner_faq_light_mode"
                  : ""
              }`}
            >
              <BreadCrumb
                link="/faqs"
                linkDisabled
                text="FAQs"
                title="Frequently asked questions"
              />
            </div>
            <div className="cta_container">
              <GlowCta link={accountCategoryURL} text="Get Early Access" />
            </div>
          </div>
        </section>

        <section className="faq_sec2">
          <div className="my_container">
            <div className="accordion_wrapper">
              {/* <Accordion defaultActiveKey="0">
                {faqsList}
              </Accordion> */}

              <FaqAccordion
                firstActive={true}
                // borderLeft={false}
                items={homeFaqData}
              />
            </div>
          </div>
        </section>
      </main>
      {theme === "dark" ? <FooterV2 bgColor="#000000"/> : <FooterV2 lightTheme bgColor="#ffffff"/>}
    </>
  );
};

export default Faqs;
