import React from "react";
import "./gridImage.scss";
import { albero_furniture, editIconBlue, kenny_eliason, laura_adai } from "../../../../images";
import { Link } from "react-router-dom";
import { BeditGridImagesData } from "../../../../components/Data/bEditData";
const GridImage = () => {
  return (
    <>
      {BeditGridImagesData.map((data, index) => (
        <div className="Grid_image_container" key={index}>
          <div className="my_container">
            <div className="grid_container">
              <div className="text_container">
                <div className="cta_container">
                  <h2 className="title">{data.title}</h2>
                  <div className="cta_wrapper">
                    <img src={editIconBlue} alt="edit icon" className="edit_icon" />
                    <Link to={() => false} className="bedit_common_cta">
                      Edit | View
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid_images_wrapper">
                <div className="row">
                  <div className="col-7 col_left_grid">
                    <img src={laura_adai} alt="Gallery" className="col_left_grid_img" />
                  </div>

                  <div className="col-5 col_right_grid">
                    <div className="row">
                      <div className="col-12 col_right_grid_inner_top">
                        <img src={albero_furniture} alt="Gallery" className="grid_inner_top" />
                      </div>
                      <div className="col-12 col_right_grid_inner_botom">
                        <img src={kenny_eliason} alt="Gallery" className="grid_inner_btm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </>
   
  );
};

export default GridImage;
