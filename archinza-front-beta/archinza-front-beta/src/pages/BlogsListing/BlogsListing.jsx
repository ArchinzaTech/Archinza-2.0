import React, { useEffect } from "react";
import "./blogsListing.scss";
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb";
import { blogsListing, rightArrowBlue } from "../../images";
import { Link } from "react-router-dom";
import { BlogsListingData } from "../../components/Data/blogsData";
import FooterV2 from "../../components/FooterV2/FooterV2";

const BlogsListing = () => {
  const blogsListingArr = BlogsListingData.map((item, i) => (
    <div className="col-md-6 col-lg-4 blogslisting_col" key={i}>
      <div className="blogslisting_content_wrapper">
        <img src={item.img} alt={item.alt} className="blogslisting_img" />
        <div className="details_wrapper">
          <p className="date">{item.date}</p>
          <h2 className="title">{item.title}</h2>
          <Link
            to={item.link !== "" ? item.link : () => false}
            className="link"
          >
            <span className="link_text">Read More</span>
            <img
              src={rightArrowBlue}
              alt="right arrow"
              className="right_arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="blogslisting_main">
        <img
          src={blogsListing}
          alt="background"
          className="blogslisting_background"
        />

        <section className="blogslisting_sec1">
          <div className="my_container">
            <div className="Breadcrumb_container">
              <BreadCrumb
                link="/blogs"
                linkDisabled
                text="Blogs"
                title="Our Blogs"
              />
            </div>
          </div>
        </section>

        <section className="blogslisting_sec2">
          <div className="my_container">
            <div className="row blogslisting_row">
              {/* <div className="col-md-4 blogslisting_col">
                <div className="blogslisting_content_wrapper">
                  <img src={blog1} alt="" className="blogslisting_img"/>
                  <div className="details_wrapper">
                    <p className="date">01.05.2023</p>
                    <h2 className="title">
                      Disconnections in the Design Industry: Concerns &
                      Solutions
                    </h2>
                    <Link to={() => false} className="link">
                      <span className="link_text">Read More</span>
                      <img
                        src={rightArrowBlue}
                        alt="right arrow"
                        className="right_arrow"
                      />
                    </Link>
                  </div>
                </div>
              </div> */}
              {blogsListingArr}
            </div>
          </div>
        </section>

        <FooterV2 bgColor="#000000" />
      </main>
    </>
  );
};

export default BlogsListing;
