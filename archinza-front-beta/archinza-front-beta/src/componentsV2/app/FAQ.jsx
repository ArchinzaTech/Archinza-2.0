import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import "./faq.scss";
import useTheme from "../../components/useTheme/useTheme";
import { invert } from "lodash";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { theme } = useTheme();
  const faqData = [
    {
      question: "What is Archinza all about?",
      answer: {
        text: `Archinza is an AI-powered discovery platform built for the Design & Build industry. 
It streamlines how professionals and clients find products, materials, and expertise instantly on demand.
At its core, Archinza enhances visibility and discovery across the entire design spectrum starting with a mobile-first WhatsApp interface for real-time answers and extending to the Archinza Web platform for matchmaking.`,
      },
    },
    {
      question: "Who is Archinza for?",
      answer: {
        text: `Archinza is designed for anyone in the Design & Build industry. 
Whether you're a creative professional (designer, architect, content creator), a service provider (business owner, contractor, vendor, PR or marketing professional), a material or product seller/distributor, or simply someone passionate about the industry, Archinza is here to empower your journey at every stage.`,
      },
    },
    {
      question: 'What is the "Ask" feature in Archinza?',
      answer: {
        text: `The Ask feature (available on WhatsApp) is powered by AI and provides instant, relevant answers to your queries about design, construction, and professional guidance. 
In the currently available Beta version of Archinza, you can ask about technical details, materials suggestions, methods, project tips, or even mentorship. 
After the full product, you will be able to get matchmade recommendations for vendors / consultants / designers or execution teams. </br>
Please note: Archinza AI™ is a model in development, doing its best to provide helpful responses in real time and continuously learning to improve.`,
      },
    },
    {
      question: "How will Archinza benefit me?",
      answer: {
        text: "Here’s how Archinza can help you:",
        list: [
          "Quick, real-time answers to design or construction-related questions.",
          "Smarter search for products, materials, inspirations, and services across the industry.",
          "Expanded visibility for your offerings or expertise, helping you reach the right audience.",
          "Curated resources to stay updated on trends, upskilling, and industry developments.",
          "It’s like having a design-savvy assistant for anyone searching, showcasing, building in the Design & Build industry.",
        ],
      },
    },
    {
      question: "Where do I sign up?",
      answer: {
        text: `Sign up via WhatsApp or the Archinza Web platform to get started.<a href="/register"> Click here </a>  to be a part of the Archinza Network.`,
        // text: `Sign up via WhatsApp or the Archinza Web platform to get started. Click here to be a part of the Archinza Network <a href="/register">Click here</a> (link to sign up).`,
      },
    },
    {
      question: "What can I do on Archinza?",
      answer: {
        text: "With a Business Account you can:",
        list: [
          "Showcase your products, materials, and services to the right audience.",
          "Reach potential clients, or industry professionals instantly.",
          "Get discovered through AI-powered search and matchmaking.",
          "Access insights to understand what users are searching for and trending in the industry.",
        ],
        extraText: "With a Personal Account you can:",
        extraList: [
          "Search for products, materials, services, and professionals across the Design & Build ecosystem.",
          "Ask questions and get real-time answers, from design guidance to technical queries.",
          "Explore curated resources, industry updates, business reviews, and AI-matched upskilling courses.",
          "Discover relevant businesses and professionals to support your projects or interests.",
        ],
      },
    },
    {
      question: "Is Archinza free?",
      answer: {
        text: `Archinza is currently free for personal accounts during our limited early access phase available only until the full product launch.  </br></br>
      For Businesses 
        </br>
      We're also offering exclusive free access to our first 1000 business users for the STARTER Plan features —no charges. While the SUPPORTER Plan is available at ₹999
`,
        // list: [
        //   "For Businesses 💼: ",
        //   "We're offering exclusive free access to our first 1000 business users for the STARTER Plan features — no charges, no catches. Post that, business accounts will be available at ₹ 999 - ₹2,500 per month until the full product rollout. Click here to get free access to the Archinza Network (LINK?).",
        // ],
      },
    },
    {
      question: "How can I edit my business name or details on Archinza?",
      answer: {
        text: `You can update your information anytime from your Dashboard. Simply log in, go to your dashboard, and make the changes.`,
      },
    },
    {
      question:
        "How can I change, upgrade, or cancel my Archinza subscription?",
      answer: {
        text: `You can update your Archinza subscription anytime from your dashboard. Simply click on your Profile Icon in the top-right corner, then select ‘Your Plan’ from the dropdown menu. 
There, you’ll see a full overview of your current subscription. Click on ‘Manage Plan’ to upgrade, downgrade, cancel, or switch between monthly and yearly billing.
`,
        list: ["🛠 Need help choosing the right plan?"],
      },
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`faq ${theme === "dark" ? "dark_mode--theme-styles" : ""}`}>
      <div className="faq__container">
        <div className="faq__grid">
          {/* Left Column */}
          <div className="faq__left-column">
            <div className="faq__left-content">
              <h1
                className={`faq__title ${theme === "dark" ? "text-white" : ""}`}
              >
                Frequently Asked Questions
              </h1>
              <p
                className={`faq__subtitle ${
                  theme === "dark" ? "dark_mode_text_muted--theme-styles" : ""
                }`}
              >
                Answers to most common questions
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="faq__items">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="faq__item"
                style={{
                  borderColor: theme === "dark" ? "#ffffff4f" : "",
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="faq__question-button"
                >
                  <h3 className="faq__question-text">{item.question}</h3>
                  <div
                    className={`faq__icon ${
                      openIndex === index ? "faq__icon--open" : ""
                    }`}
                    style={{
                      filter: theme === "dark" ? "invert(1)" : "",
                    }}
                  >
                    {openIndex === index ? (
                      <Minus size={24} />
                    ) : (
                      <Plus size={24} />
                    )}
                  </div>
                </button>

                <div
                  className={`faq__answer ${
                    openIndex === index
                      ? "faq__answer--open"
                      : "faq__answer--closed"
                  }`}
                >
                  {item.answer.text && (
                    <p
                      className="faq__answer-text"
                      dangerouslySetInnerHTML={{ __html: item.answer.text }}
                    />
                  )}
                  {/* {item.answer.text && (
                    <p className="faq__answer-text" >{item.answer.text}</p>
                  )} */}
                  {item.answer.list && (
                    <ul className="faq__answer-list">
                      {item.answer.list.map((li, i) => (
                        <li
                          key={i}
                          style={{
                            listStyleType: "disc",
                          }}
                        >
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
