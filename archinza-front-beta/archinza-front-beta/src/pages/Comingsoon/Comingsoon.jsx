import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./comingsoon.scss";
import {
  chatImg,
  facebook,
  homepageBanner,
  insta,
  linkedIn,
  logo,
  mbChatImg,
  mbHomepageBanner,
  mbLogo,
} from "../../images";
import { useWindowSize } from "react-use";
import {
  homepageURL,
  privacypolicyURL,
  termsandconditionURL,
} from "../../components/helpers/constant-words";

const Comingsoon = () => {
  const { width } = useWindowSize();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const deadline = "August, 18, 2024 00:00:00";
  // text animation start
  // const typedTextRef = useRef(null);
  // const cursorRef = useRef(null);
  // const textArray = ["starts here!"];
  // const textArray = ["starts", "here", "a journey", "LIFE"];
  // const textArray = ["hard", "fun", "a journey", "LIFE"];
  // const typingDelay = 200;
  // const erasingDelay = 100;
  // const newTextDelay = 2000;
  // let textArrayIndex = 0;
  // let charIndex = 0;

  // text animation end

  const getTime = () => {
    // if (Date.parse(deadline) >= 0) {
    const time = Date.parse(deadline) - Date.now();

    // if (Date.parse(deadline) >= 0) {
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
    // }
    // else {
    //   setDays("00");
    //   setHours("00");
    //   setMinutes("00");
    //   setSeconds("00");
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  // text animation start
  // const type = () => {
  //   if (charIndex < textArray[textArrayIndex].length) {
  //     if (!cursorRef.current.classList.contains("typing")) {
  //       cursorRef.current.classList.add("typing");
  //     }
  //     typedTextRef.current.textContent +=
  //       textArray[textArrayIndex].charAt(charIndex);
  //     charIndex++;
  //     setTimeout(type, typingDelay);
  //   } else {
  //     cursorRef.current.classList.remove("typing");
  //     setTimeout(erase, newTextDelay);
  //   }
  // };

  // const erase = () => {
  //   if (charIndex > 0) {
  //     if (!cursorRef.current.classList.contains("typing")) {
  //       cursorRef.current.classList.add("typing");
  //     }
  //     typedTextRef.current.textContent = textArray[textArrayIndex].substring(
  //       0,
  //       charIndex - 1
  //     );
  //     charIndex--;
  //     setTimeout(erase, erasingDelay);
  //   } else {
  //     cursorRef.current.classList.remove("typing");
  //     textArrayIndex++;
  //     if (textArrayIndex >= textArray.length) {
  //       textArrayIndex = 0;
  //     }
  //     setTimeout(type, typingDelay + 1100);
  //   }
  // };

  // useEffect(() => {
  //   if (textArray.length) {
  //     setTimeout(type, newTextDelay + 250);
  //   }
  // }, []);
  // text animation end

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="main_container">
        <section className="homepage_sec1">
          <div className="banner_img_wrapper">
            <img
              src={width > 767 ? homepageBanner : mbHomepageBanner}
              alt="banner"
              className="banner_img"
            />
          </div>
          <div className="logo_wrapper">
            <Link to={homepageURL}>
              <img
                src={width > 767 ? logo : mbLogo}
                alt="logo"
                className="logo_img"
              />
            </Link>
          </div>

          <div className="banner_content">
            <div className="row banner_row">
              <div className="col-lg-7 banner_col">
                <div className="content_wrapper">
                  {/* text animation start */}
                  {/* <div className="animation_container">
                    <h1 className="heading">
                      It {""}
                      <span className="typed-text" ref={typedTextRef}></span>
                      <span className="cursor" ref={cursorRef}>
                        &nbsp;
                      </span>
                    </h1>
                  </div> */}
                  <div className="animation_container_1">
                    <h1 className="heading_1">It starts here!</h1>
                    {width > 600 ? (
                      <p className="text_1">
                        <span className="color_text">Redesigning</span>the
                        business of design.
                        <span className="cursor">|</span>
                      </p>
                    ) : (
                      <>
                        <p className="text_1">
                          <span className="color_text">Redesigning</span>the
                          business
                        </p>
                        <p className="text_1">
                          <span>of design.</span>{" "}
                          <span className="cursor">|</span>
                        </p>
                      </>
                    )}
                  </div>
                  {/* text animation end */}
                  {/* <h1 className="heading">It starts here!</h1>
                  <p className="text">
                    <span className="color_text">Redesigning</span>the business
                    of design.
                  </p> */}
                  <h2 className="subheading">
                    <span className="subheading_text">We are coming</span> soon!
                  </h2>
                  <div className="clock_wrapper">
                    {/* {deadline >= 0 ? (
                    <> */}
                    <div className="clock_content">
                      <p className="clock_number">
                        {/* {days < 10 ? "0" + days : days} */}
                        {days >= 0 ? (days < 10 ? "0" + days : days) : "00"}
                      </p>
                      {/* <p className="clock_number">02</p> */}
                      <p className="clock_text">Days</p>
                    </div>
                    <div className="clock_dots">:</div>
                    <div className="clock_content">
                      <p className="clock_number">
                        {hours >= 0 ? (hours < 10 ? "0" + hours : hours) : "00"}
                      </p>
                      {/* <p className="clock_number">06</p> */}
                      <p className="clock_text">Hours</p>
                    </div>
                    <div className="clock_dots">:</div>
                    <div className="clock_content">
                      <p className="clock_number">
                        {minutes >= 0
                          ? minutes < 10
                            ? "0" + minutes
                            : minutes
                          : "00"}
                      </p>
                      {/* <p className="clock_number">15</p> */}
                      <p className="clock_text">Minutes</p>
                    </div>
                    <div className="clock_dots">:</div>
                    <div className="clock_content">
                      <p className="clock_number">
                        {seconds >= 0
                          ? seconds < 10
                            ? "0" + seconds
                            : seconds
                          : "00"}
                        {/* {setSeconds >= 0
                        ? seconds < 10
                          ? "0" + seconds
                          : seconds
                        : "00"} */}
                      </p>
                      {/* <p className="clock_number">48</p> */}
                      <p className="clock_text">Seconds</p>
                    </div>
                    {/* </>
                  ) : (
                    <div className="clock_content expired">
                      <p className="clock_number">Expired</p>
                    </div>
                  )} */}
                  </div>
                  <p className="description">
                    Archinza will be your digital tribe, built to power creators
                    and builders, designers & consultants, students & design
                    lovers, for the next generation <br />
                    <span className="desc_color_text">
                      in the built environment.
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-lg-4 banner_col">
                <div className="img_wrapper">
                  <img
                    src={width > 767 ? chatImg : mbChatImg}
                    alt="chat img"
                    className="chat_img"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="footer_sec1">
          <div className="footer_wrapper">
            <div className="row">
              <div className="col-md-4 order-md-1 footer_col">
                <p className="footer_copyright">
                  Copyright © 2023 Archinza Connect Pvt Ltd.
                </p>
              </div>
              <div className="col-md-4 order-md-3 footer_col">
                <p className="footer_terms">
                  <Link to={termsandconditionURL}> Terms & conditions</Link> |{" "}
                  <Link to={privacypolicyURL}>Privacy policy</Link>
                </p>
              </div>
              <div className="col-md-4 order-md-2 footer_col">
                <div className="footer_social_icon">
                  <a
                    href="https://www.facebook.com/profile.php?id=100091559990889&mibextid=LQQJ4d"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={facebook}
                      alt="facebook"
                      className="social_icon facebook_icon"
                    />
                  </a>
                  <a
                    href="https://instagram.com/archin.za?igshid=MzRlODBiNWFlZA"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={insta} alt="facebook" className="social_icon" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/92807055/admin/feed/posts/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={linkedIn}
                      alt="facebook"
                      className="social_icon"
                    />
                  </a>
                  {/* <a
                    href="https://www.linkedin.com/in/natasha-nk9999"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={linkedIn}
                      alt="facebook"
                      className="social_icon"
                    />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Comingsoon;
