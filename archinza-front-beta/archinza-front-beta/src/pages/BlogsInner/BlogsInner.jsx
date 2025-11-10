import React, { useEffect } from "react";
import "./blogsInner.scss";
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb";
import {
  blogsInner,
  blogsShareIcon,
  facebook,
  insta,
  linkedIn,
} from "../../images";
import { BlogsInnerData } from "../../components/Data/blogsData";
import FooterV2 from "../../components/FooterV2/FooterV2";

const BlogsInner = () => {
  const blogsInnerArr = BlogsInnerData.map((item, i) => (
    <div className="blogsinner_content_wrapper" key={i}>
      <img src={item.heroImg} alt={item.heroAlt} className="hero_img" />
      <ul className="desc_wrapper">
        {item.desc.map((list) => (
          <li className="desc" dangerouslySetInnerHTML={{ __html: list }}></li>
        ))}
      </ul>

      <div className="social_media_wrapper">
        <img src={blogsShareIcon} alt="share icon" className="social_icon" />
        <a
          href={item.facebookLink}
          // target="_blank"
          rel="noreferrer"
          className="social_link"
        >
          <img src={facebook} alt="facebook" className="social_icon" />
        </a>
        <a
          href={item.instaLink}
          // target="_blank"
          rel="noreferrer"
          className="social_link"
        >
          <img src={insta} alt="instagram" className="social_icon" />
        </a>
        <a
          href={item.linkedInLink}
          // target="_blank"
          rel="noreferrer"
          className="social_link"
        >
          <img src={linkedIn} alt="linkedIn" className="social_icon" />
        </a>
      </div>
    </div>
  ));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="blogsinner_main">
        <img
          src={blogsInner}
          alt="background"
          className="blogsinner_background"
        />
        <section className="blogsinner_sec1">
          <div className="my_container">
            <div className="my_container">
              <div className="Breadcrumb_container">
                <BreadCrumb
                  link="/blogs"
                  linkDisabled1
                  text="Blogs"
                  text1="Disconnections in the Design Industry: Concerns & Solutions"
                  title="Disconnections in the Design Industry: <span className='bread_block'>Concerns & Solutions</span>"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="blogsinner_sec2">
          <div className="my_container">{blogsInnerArr}</div>
        </section>

        <FooterV2 bgColor="#000000" />
      </main>
    </>
  );
};

export default BlogsInner;
