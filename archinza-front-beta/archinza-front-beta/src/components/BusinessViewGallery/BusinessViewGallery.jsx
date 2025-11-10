import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./businessviewgallery.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { beleftarrow, berightarrow } from "../../images";

function BusinessViewGallery(props) {
  const galleryList = props.dataarr.map((image, i) => (
    <SwiperSlide key={`gallery-${i}`}>
      <img src={image} alt="gallery" className="gallery_img" />
    </SwiperSlide>
  ));

  return (
    <Modal
      {...props}
      className="gallery_modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Swiper
          className="gallery_swiper"
          modules={[Autoplay, Navigation]}
          spaceBetween={80}
          slidesPerView={2.5}
          navigation={{
            prevEl: ".beleftarrow",
            nextEl: ".berightarrow",
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          loop={true}
          centeredSlides={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            992: {
              slidesPerView: 2.5,
              spaceBetween: 80,
            },
          }}
        >
          {galleryList}
        </Swiper>
        <div className="navigation_wrapper">
          <img
            src={beleftarrow}
            alt=""
            className="nav_arrow beleftarrow"
            loading="lazy"
          />
          <img
            src={berightarrow}
            alt=""
            className="nav_arrow berightarrow"
            loading="lazy"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BusinessViewGallery;
