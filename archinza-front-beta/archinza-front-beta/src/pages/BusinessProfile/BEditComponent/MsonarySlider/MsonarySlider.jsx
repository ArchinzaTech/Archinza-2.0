// import React, { useState } from "react";
// import "./msonarySlider.scss";
// import { dropdownIconBlack, editIconCircleBlue } from "../../../../images";
// import { Link } from "react-router-dom";
// import { businessProfileEditURL2 } from "../../../../components/helpers/constant-words";
// import LoadingStateComp from "../LoadingStateComp/LoadingStateComp";
// import config from "../../../../config/config";

// const MsonarySlider = ({ onClick, isSliderEdit, data }) => {
//   const galleryTitles = [
//     { key: "project_renders_media", title: "Project Photos & Renders" },
//     { key: "completed_products_media", title: "Products | Materials" },
//     { key: "sites_inprogress_media", title: "Sites In Progress" },
//   ];
//   const aws_object_url = config.aws_object_url + "business/";
//   const [masonarySlider, setMasonarySlider] = useState(true);

//   const processImages = (data, galleryTitles) => {
//     const allImages = [];
//     const categoryImages = {};

//     galleryTitles.forEach((category) => {
//       const categoryData = data?.[category?.key] || [];
//       const visibleImages = categoryData.filter(
//         (image) => image.visibility === true
//       );
//       categoryImages[category.key] = visibleImages;
//       allImages.push(...visibleImages);
//     });

//     return { allImages, categoryImages };
//   };

//   const distributeImagesForMasonry = (categoryImages, totalNeeded = 14) => {
//     const categories = Object.keys(categoryImages);
//     const availableCounts = categories.map((key) => categoryImages[key].length);
//     const totalAvailable = availableCounts.reduce(
//       (sum, count) => sum + count,
//       0
//     );

//     if (totalAvailable === 0) return [];

//     // If total available is less than needed, use all available
//     const actualTotal = Math.min(totalNeeded, totalAvailable);

//     // Calculate distribution
//     const distribution = {};
//     const nonEmptyCategories = categories.filter(
//       (key) => categoryImages[key].length > 0
//     );

//     if (nonEmptyCategories.length === 0) return [];

//     // Base distribution
//     const basePerCategory = Math.floor(actualTotal / nonEmptyCategories.length);
//     let remaining = actualTotal % nonEmptyCategories.length;

//     nonEmptyCategories.forEach((key) => {
//       const available = categoryImages[key].length;
//       const allocated = Math.min(
//         available,
//         basePerCategory + (remaining > 0 ? 1 : 0)
//       );
//       distribution[key] = allocated;
//       if (remaining > 0) remaining--;
//     });

//     // Redistribute if some categories can't fulfill their allocation
//     let redistributionNeeded = true;
//     while (redistributionNeeded) {
//       redistributionNeeded = false;
//       let surplus = 0;

//       // Calculate surplus from categories that can't fulfill allocation
//       Object.keys(distribution).forEach((key) => {
//         const available = categoryImages[key].length;
//         if (distribution[key] > available) {
//           surplus += distribution[key] - available;
//           distribution[key] = available;
//           redistributionNeeded = true;
//         }
//       });

//       // Redistribute surplus to categories that can take more
//       if (surplus > 0) {
//         const canTakeMore = Object.keys(distribution).filter(
//           (key) => distribution[key] < categoryImages[key].length
//         );

//         if (canTakeMore.length > 0) {
//           const additionalPerCategory = Math.floor(
//             surplus / canTakeMore.length
//           );
//           let extraRemaining = surplus % canTakeMore.length;

//           canTakeMore.forEach((key) => {
//             const available = categoryImages[key].length;
//             const current = distribution[key];
//             const canAdd = Math.min(
//               available - current,
//               additionalPerCategory + (extraRemaining > 0 ? 1 : 0)
//             );
//             distribution[key] += canAdd;
//             if (extraRemaining > 0) extraRemaining--;
//           });
//         }
//       }
//     }

//     // Collect distributed images
//     const distributedImages = [];
//     Object.keys(distribution).forEach((key) => {
//       const images = categoryImages[key].slice(0, distribution[key]);
//       distributedImages.push(...images);
//     });

//     return distributedImages;
//   };

//   const { allImages, categoryImages } = processImages(data, galleryTitles);

//   const shouldUseMasonry = allImages.length > 7;

//   // For masonry layout (true) - distribute 14 images
//   const masonryImages = shouldUseMasonry
//     ? distributeImagesForMasonry(categoryImages, 14)
//     : [];

//   // For slider layout (false) - use up to 7 images or all available
//   const sliderImages = !shouldUseMasonry ? allImages : [];

//   // Check if we should show loading state
//   const shouldShowLoading =
//     data && Object.keys(data).length > 0 && allImages.length === 0;

//   // Check if we should show loading text when data is not available yet
//   const shouldShowLoadingText = !data || Object.keys(data).length === 0;

//   const renderImageWithEdit = (imageData, className, index) => (
//     <div
//       key={`${imageData._id || index}`}
//       className="wraper_cmn_ms_slider_img_icon"
//     >
//       <img
//         src={`${aws_object_url}${imageData.url}`}
//         alt={imageData.name || ""}
//         className={className}
//       />
//       {isSliderEdit && (
//         <img
//           src={editIconCircleBlue}
//           alt="edit icon"
//           className="edit_icon_msn_slider"
//           onClick={onClick}
//         />
//       )}
//     </div>
//   );

//   // Replace the hardcoded images in masonry layout with:
//   // For the first masonry_wrapper:
//   const firstSetImages = masonryImages.slice(0, 7);
//   // For the second masonry_wrapper:
//   const secondSetImages = masonryImages.slice(7, 14);

//   // return (
//   //   <>
//   //     {/* <div className="loading_state_fr_msn--slider "><LoadingStateComp/></div> */}

//   //     {masonarySlider ? (
//   //       <div className="wrapper_slider_masonary--update">
//   //         {!isSliderEdit && (
//   //           <Link to={businessProfileEditURL2} className="edit_cta--view">
//   //             <img
//   //               src={dropdownIconBlack}
//   //               alt="icon"
//   //               className="icon_back_edit"
//   //             />
//   //             Edit
//   //           </Link>
//   //         )}
//   //         <div className="mns_scr_sp_tp position-relative">
//   //           <div className="masonry_wrapper">
//   //             <div className="col-first-layout">
//   //               <img
//   //                 src={
//   //                   "	https://archinza-ai.vercel.app/BusinessView/Chirmee/23.jpg"
//   //                 }
//   //                 alt=""
//   //                 className="lg-first-ms-slider-img"
//   //               />
//   //               {isSliderEdit && (
//   //                 <img
//   //                   src={editIconCircleBlue}
//   //                   alt="edit icon"
//   //                   className="edit_icon_msn_slider"
//   //                   onClick={onClick}
//   //                 />
//   //               )}
//   //               <div className="btm-col-first-layout">
//   //                 <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon---first">
//   //                   <img
//   //                     src={
//   //                       "https://archinza-ai.vercel.app/BusinessView/Chirmee/1.jpg"
//   //                     }
//   //                     alt=""
//   //                     className="sm-first-ms-slider-img"
//   //                   />

//   //                   {isSliderEdit && (
//   //                     <img
//   //                       src={editIconCircleBlue}
//   //                       alt="edit icon"
//   //                       className="edit_icon_msn_slider"
//   //                       onClick={onClick}
//   //                     />
//   //                   )}
//   //                 </div>
//   //                 <div className="wraper_cmn_ms_slider_img_icon">
//   //                   <img
//   //                     src={
//   //                       "	https://archinza-ai.vercel.app/BusinessView/Chirmee/2.jpg"
//   //                     }
//   //                     alt=""
//   //                     className="sm-first-ms-slider-img"
//   //                   />
//   //                   {isSliderEdit && (
//   //                     <img
//   //                       src={editIconCircleBlue}
//   //                       alt="edit icon"
//   //                       className="edit_icon_msn_slider"
//   //                       onClick={onClick}
//   //                     />
//   //                   )}
//   //                 </div>
//   //               </div>
//   //             </div>

//   //             <div className="col-second-layout">
//   //               <div className="wraper_cmn_ms_slider_img_icon">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/6.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="sm-second-ms-slider-img"
//   //                 />
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //               <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--second">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/7.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="lg-second-ms-slider-img"
//   //                 />
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //             </div>

//   //             <div className="col-third-layout">
//   //               <div className="wraper_cmn_ms_slider_img_icon">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/8.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="lg-second-ms-slider-img"
//   //                 />
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //               <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--third">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/21.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="sm-second-ms-slider-img"
//   //                 />{" "}
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //             </div>
//   //           </div>
//   //           <div className="masonry_wrapper">
//   //             <div className="col-first-layout">
//   //               <img
//   //                 src={
//   //                   "https://archinza-ai.vercel.app/BusinessView/Chirmee/30.jpg"
//   //                 }
//   //                 alt=""
//   //                 className="lg-first-ms-slider-img"
//   //               />
//   //               {isSliderEdit && (
//   //                 <img
//   //                   src={editIconCircleBlue}
//   //                   alt="edit icon"
//   //                   className="edit_icon_msn_slider"
//   //                   onClick={onClick}
//   //                 />
//   //               )}

//   //               <div className="btm-col-first-layout">
//   //                 <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon---first">
//   //                   <img
//   //                     src={
//   //                       "https://archinza-ai.vercel.app/BusinessView/Chirmee/22.jpg"
//   //                     }
//   //                     alt=""
//   //                     className="sm-first-ms-slider-img"
//   //                   />

//   //                   {isSliderEdit && (
//   //                     <img
//   //                       src={editIconCircleBlue}
//   //                       alt="edit icon"
//   //                       className="edit_icon_msn_slider"
//   //                       onClick={onClick}
//   //                     />
//   //                   )}
//   //                 </div>
//   //                 <div className="wraper_cmn_ms_slider_img_icon">
//   //                   <img
//   //                     src={
//   //                       "https://archinza-ai.vercel.app/BusinessView/Chirmee/31.jpg"
//   //                     }
//   //                     alt=""
//   //                     className="sm-first-ms-slider-img"
//   //                   />
//   //                   {isSliderEdit && (
//   //                     <img
//   //                       src={editIconCircleBlue}
//   //                       alt="edit icon"
//   //                       className="edit_icon_msn_slider"
//   //                       onClick={onClick}
//   //                     />
//   //                   )}
//   //                 </div>
//   //               </div>
//   //             </div>

//   //             <div className="col-second-layout">
//   //               <div className="wraper_cmn_ms_slider_img_icon">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/35.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="sm-second-ms-slider-img"
//   //                 />
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //               <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--second">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/18.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="lg-second-ms-slider-img"
//   //                 />
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //             </div>

//   //             <div className="col-third-layout">
//   //               <div className="wraper_cmn_ms_slider_img_icon">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/20.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="lg-second-ms-slider-img"
//   //                 />
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //               <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--third">
//   //                 <img
//   //                   src={
//   //                     "https://archinza-ai.vercel.app/BusinessView/Chirmee/11.jpg"
//   //                   }
//   //                   alt=""
//   //                   className="sm-second-ms-slider-img"
//   //                 />{" "}
//   //                 {isSliderEdit && (
//   //                   <img
//   //                     src={editIconCircleBlue}
//   //                     alt="edit icon"
//   //                     className="edit_icon_msn_slider"
//   //                     onClick={onClick}
//   //                   />
//   //                 )}
//   //               </div>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     ) : (
//   //       <div className="single_slider_msn_slider--wrapper">
//   //         {!isSliderEdit && (
//   //           <Link to={businessProfileEditURL2} className="edit_cta--view">
//   //             <img
//   //               src={dropdownIconBlack}
//   //               alt="icon"
//   //               className="icon_back_edit"
//   //             />
//   //             Edit
//   //           </Link>
//   //         )}
//   //         <div className="single_image_slide--sm-masn">
//   //           <img
//   //             src="	https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/1.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //           <img
//   //             src="https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/2.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //           <img
//   //             src="https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/6.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //           <img
//   //             src="https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/7.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //           <img
//   //             src="https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/7.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //           <img
//   //             src="https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/7.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //           <img
//   //             src="https://archinza-ai.vercel.app/BusinessView/DeltaFaucet/7.jpg"
//   //             alt=""
//   //             className="single_img_slide"
//   //           />
//   //         </div>
//   //       </div>
//   //     )}
//   //   </>
//   // );

//   return (
//     <>
//       {shouldShowLoading ? (
//         <div className="loading_state_fr_msn--slider">
//           <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
//             Loading images...
//           </div>
//         </div>
//       ) : shouldShowLoading ? (
//         <div className="loading_state_fr_msn--slider">
//           <LoadingStateComp />
//         </div>
//       ) : (
//         <>
//           {shouldUseMasonry ? (
//             <div className="wrapper_slider_masonary--update">
//               {!isSliderEdit && (
//                 <Link to={businessProfileEditURL2} className="edit_cta--view">
//                   <img
//                     src={dropdownIconBlack}
//                     alt="icon"
//                     className="icon_back_edit"
//                   />
//                   Edit
//                 </Link>
//               )}
//               <div className="mns_scr_sp_tp position-relative">
//                 {/* First masonry wrapper */}
//                 <div className="masonry_wrapper">
//                   <div className="col-first-layout">
//                     {firstSetImages[0] && (
//                       <>
//                         <img
//                           src={`${aws_object_url}${firstSetImages[0].url}`}
//                           alt={firstSetImages[0].name || ""}
//                           className="lg-first-ms-slider-img"
//                         />
//                         {isSliderEdit && (
//                           <img
//                             src={editIconCircleBlue}
//                             alt="edit icon"
//                             className="edit_icon_msn_slider"
//                             onClick={onClick}
//                           />
//                         )}
//                       </>
//                     )}
//                     <div className="btm-col-first-layout">
//                       {firstSetImages[1] &&
//                         renderImageWithEdit(
//                           firstSetImages[1],
//                           "sm-first-ms-slider-img",
//                           1
//                         )}
//                       {firstSetImages[2] &&
//                         renderImageWithEdit(
//                           firstSetImages[2],
//                           "sm-first-ms-slider-img",
//                           2
//                         )}
//                     </div>
//                   </div>
//                   <div className="col-second-layout">
//                     {firstSetImages[3] &&
//                       renderImageWithEdit(
//                         firstSetImages[3],
//                         "sm-second-ms-slider-img",
//                         3
//                       )}
//                     {firstSetImages[4] && (
//                       <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--second">
//                         <img
//                           src={`${aws_object_url}${firstSetImages[4].url}`}
//                           alt={firstSetImages[4].name || ""}
//                           className="lg-second-ms-slider-img"
//                         />
//                         {isSliderEdit && (
//                           <img
//                             src={editIconCircleBlue}
//                             alt="edit icon"
//                             className="edit_icon_msn_slider"
//                             onClick={onClick}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <div className="col-third-layout">
//                     {firstSetImages[5] &&
//                       renderImageWithEdit(
//                         firstSetImages[5],
//                         "lg-second-ms-slider-img",
//                         5
//                       )}
//                     {firstSetImages[6] && (
//                       <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--third">
//                         <img
//                           src={`${aws_object_url}${firstSetImages[6].url}`}
//                           alt={firstSetImages[6].name || ""}
//                           className="sm-second-ms-slider-img"
//                         />
//                         {isSliderEdit && (
//                           <img
//                             src={editIconCircleBlue}
//                             alt="edit icon"
//                             className="edit_icon_msn_slider"
//                             onClick={onClick}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Second masonry wrapper - only if we have more than 7 images */}
//                 {secondSetImages.length > 0 && (
//                   <div className="masonry_wrapper">
//                     <div className="col-first-layout">
//                       {secondSetImages[0] && (
//                         <>
//                           <img
//                             src={`${aws_object_url}${secondSetImages[0].url}`}
//                             alt={secondSetImages[0].name || ""}
//                             className="lg-first-ms-slider-img"
//                           />
//                           {isSliderEdit && (
//                             <img
//                               src={editIconCircleBlue}
//                               alt="edit icon"
//                               className="edit_icon_msn_slider"
//                               onClick={onClick}
//                             />
//                           )}
//                         </>
//                       )}
//                       <div className="btm-col-first-layout">
//                         {secondSetImages[1] &&
//                           renderImageWithEdit(
//                             secondSetImages[1],
//                             "sm-first-ms-slider-img",
//                             8
//                           )}
//                         {secondSetImages[2] &&
//                           renderImageWithEdit(
//                             secondSetImages[2],
//                             "sm-first-ms-slider-img",
//                             9
//                           )}
//                       </div>
//                     </div>
//                     <div className="col-second-layout">
//                       {secondSetImages[3] &&
//                         renderImageWithEdit(
//                           secondSetImages[3],
//                           "sm-second-ms-slider-img",
//                           10
//                         )}
//                       {secondSetImages[4] && (
//                         <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--second">
//                           <img
//                             src={`${aws_object_url}${secondSetImages[4].url}`}
//                             alt={secondSetImages[4].name || ""}
//                             className="lg-second-ms-slider-img"
//                           />
//                           {isSliderEdit && (
//                             <img
//                               src={editIconCircleBlue}
//                               alt="edit icon"
//                               className="edit_icon_msn_slider"
//                               onClick={onClick}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     <div className="col-third-layout">
//                       {secondSetImages[5] &&
//                         renderImageWithEdit(
//                           secondSetImages[5],
//                           "lg-second-ms-slider-img",
//                           12
//                         )}
//                       {secondSetImages[6] && (
//                         <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--third">
//                           <img
//                             src={`${aws_object_url}${secondSetImages[6].url}`}
//                             alt={secondSetImages[6].name || ""}
//                             className="sm-second-ms-slider-img"
//                           />
//                           {isSliderEdit && (
//                             <img
//                               src={editIconCircleBlue}
//                               alt="edit icon"
//                               className="edit_icon_msn_slider"
//                               onClick={onClick}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="single_slider_msn_slider--wrapper">
//               {!isSliderEdit && (
//                 <Link to={businessProfileEditURL2} className="edit_cta--view">
//                   <img
//                     src={dropdownIconBlack}
//                     alt="icon"
//                     className="icon_back_edit"
//                   />
//                   Edit
//                 </Link>
//               )}
//               <div className="single_image_slide--sm-masn">
//                 {sliderImages.map((imageData, index) => (
//                   <img
//                     key={`${imageData._id || index}`}
//                     src={`${aws_object_url}${imageData.url}`}
//                     alt={imageData.name || ""}
//                     className="single_img_slide"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };
// export default MsonarySlider;

import React, { useState, useEffect } from "react";
import "./msonarySlider.scss";
import { dropdownIconBlack, editIconCircleBlue } from "../../../../images";
import { Link } from "react-router-dom";
import { businessProfileEditURL2 } from "../../../../components/helpers/constant-words";
import LoadingStateComp from "../LoadingStateComp/LoadingStateComp";
import config from "../../../../config/config";

const MsonarySlider = ({ onClick, isSliderEdit, data, onImageReplace }) => {
  const galleryTitles = [
    { key: "project_renders_media", title: "Project Photos & Renders" },
    { key: "completed_products_media", title: "Products | Materials" },
    { key: "sites_inprogress_media", title: "Sites In Progress" },
  ];
  const aws_object_url = config.aws_object_url + "business/";
  const [positionedImages, setPositionedImages] = useState({});

  // Initialize positioned images from data
  useEffect(() => {
    if (!data) return;

    const { allImages, categoryImages } = processImages(data, galleryTitles);
    const shouldUseMasonry = allImages.length > 7;
    const totalPositions = shouldUseMasonry ? 14 : 7;

    // Check if images already have positions assigned
    const imagesWithPositions = allImages.filter(
      (img) => img.masonryPosition !== undefined && img.masonryPosition !== null
    );

    if (imagesWithPositions.length > 0) {
      // Use existing positions
      const positioned = {};
      imagesWithPositions.forEach((img) => {
        if (img.masonryPosition < totalPositions) {
          positioned[img.masonryPosition] = img;
        }
      });
      setPositionedImages(positioned);
    } else {
      // Assign new positions using distribution logic
      const distributedImages = shouldUseMasonry
        ? distributeImagesForMasonry(categoryImages, 14)
        : allImages.slice(0, 7);

      const positioned = {};
      distributedImages.forEach((img, index) => {
        positioned[index] = { ...img, masonryPosition: index };
      });
      setPositionedImages(positioned);
    }
  }, [data]);

  const processImages = (data, galleryTitles) => {
    const allImages = [];
    const categoryImages = {};

    galleryTitles.forEach((category) => {
      const categoryData = data?.[category?.key] || [];
      const visibleImages = categoryData.filter(
        (image) => image.visibility === true && image.isUnused === false
      );
      categoryImages[category.key] = visibleImages;
      allImages.push(...visibleImages);
    });
    return { allImages, categoryImages };
  };

  const distributeImagesForMasonry = (categoryImages, totalNeeded = 14) => {
    const categories = Object.keys(categoryImages);
    const availableCounts = categories.map((key) => categoryImages[key].length);
    const totalAvailable = availableCounts.reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalAvailable === 0) return [];

    const actualTotal = Math.min(totalNeeded, totalAvailable);
    const distribution = {};
    const nonEmptyCategories = categories.filter(
      (key) => categoryImages[key].length > 0
    );

    if (nonEmptyCategories.length === 0) return [];

    const basePerCategory = Math.floor(actualTotal / nonEmptyCategories.length);
    let remaining = actualTotal % nonEmptyCategories.length;

    nonEmptyCategories.forEach((key) => {
      const available = categoryImages[key].length;
      const allocated = Math.min(
        available,
        basePerCategory + (remaining > 0 ? 1 : 0)
      );
      distribution[key] = allocated;
      if (remaining > 0) remaining--;
    });

    let redistributionNeeded = true;
    while (redistributionNeeded) {
      redistributionNeeded = false;
      let surplus = 0;

      Object.keys(distribution).forEach((key) => {
        const available = categoryImages[key].length;
        if (distribution[key] > available) {
          surplus += distribution[key] - available;
          distribution[key] = available;
          redistributionNeeded = true;
        }
      });

      if (surplus > 0) {
        const canTakeMore = Object.keys(distribution).filter(
          (key) => distribution[key] < categoryImages[key].length
        );

        if (canTakeMore.length > 0) {
          const additionalPerCategory = Math.floor(
            surplus / canTakeMore.length
          );
          let extraRemaining = surplus % canTakeMore.length;

          canTakeMore.forEach((key) => {
            const available = categoryImages[key].length;
            const current = distribution[key];
            const canAdd = Math.min(
              available - current,
              additionalPerCategory + (extraRemaining > 0 ? 1 : 0)
            );
            distribution[key] += canAdd;
            if (extraRemaining > 0) extraRemaining--;
          });
        }
      }
    }

    const distributedImages = [];
    Object.keys(distribution).forEach((key) => {
      const images = categoryImages[key].slice(0, distribution[key]);
      distributedImages.push(...images);
    });

    return distributedImages;
  };

  const { allImages } = processImages(data, galleryTitles);
  const shouldUseMasonry = allImages.length > 7;

  const shouldShowLoading =
    data && Object.keys(data).length > 0 && allImages.length === 0;
  const shouldShowLoadingText = !data || Object.keys(data).length === 0;

  const handleImageEdit = (position) => {
    // console.log(positionedImages[position]);
    // console.log(onImageReplace);
    // onClick();
    if (onImageReplace) {
      onImageReplace(position, positionedImages[position]);
    } else if (onClick) {
      onClick();
    }
  };

  const renderImageWithEdit = (position, className) => {
    const imageData = positionedImages[position];
    if (!imageData) return null;

    return (
      <div
        key={`position-${position}`}
        className="wraper_cmn_ms_slider_img_icon"
      >
        <img
          src={`${aws_object_url}${imageData.url}`}
          alt={imageData.name || ""}
          className={className}
        />
        {isSliderEdit && (
          <img
            src={editIconCircleBlue}
            alt="edit icon"
            className="edit_icon_msn_slider"
            onClick={() => handleImageEdit(position)}
          />
        )}
      </div>
    );
  };

  const renderLargeImageWithEdit = (position, className) => {
    const imageData = positionedImages[position];
    if (!imageData) return null;

    return (
      <>
        <img
          src={`${aws_object_url}${imageData.url}`}
          alt={imageData.name || ""}
          className={className}
        />
        {isSliderEdit && (
          <img
            src={editIconCircleBlue}
            alt="edit icon"
            className="edit_icon_msn_slider"
            onClick={() => handleImageEdit(position)}
          />
        )}
      </>
    );
  };

  return (
    <>
      {shouldShowLoading ? (
        <div className="loading_state_fr_msn--slider">
          {/* <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            Loading images...
          </div> */}
        </div>
      ) : shouldShowLoadingText ? (
        <div className="loading_state_fr_msn--slider">
          <LoadingStateComp />
        </div>
      ) : (
        <>
          {shouldUseMasonry ? (
            <div className="wrapper_slider_masonary--update">
              {!isSliderEdit && (
                <Link to={businessProfileEditURL2} className="edit_cta--view">
                  <img
                    src={dropdownIconBlack}
                    alt="icon"
                    className="icon_back_edit"
                  />
                  Edit
                </Link>
              )}
              <div className="mns_scr_sp_tp position-relative">
                {/* First masonry wrapper - positions 0-6 */}
                <div className="masonry_wrapper">
                  <div className="col-first-layout">
                    {positionedImages[0] &&
                      renderLargeImageWithEdit(0, "lg-first-ms-slider-img")}
                    <div className="btm-col-first-layout">
                      {renderImageWithEdit(1, "sm-first-ms-slider-img")}
                      {renderImageWithEdit(2, "sm-first-ms-slider-img")}
                    </div>
                  </div>
                  <div className="col-second-layout">
                    {renderImageWithEdit(3, "sm-second-ms-slider-img")}
                    {positionedImages[4] && (
                      <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--second">
                        <img
                          src={`${aws_object_url}${positionedImages[4].url}`}
                          alt={positionedImages[4].name || ""}
                          className="lg-second-ms-slider-img"
                        />
                        {isSliderEdit && (
                          <img
                            src={editIconCircleBlue}
                            alt="edit icon"
                            className="edit_icon_msn_slider"
                            onClick={() => handleImageEdit(4)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-third-layout">
                    {renderImageWithEdit(5, "lg-second-ms-slider-img")}
                    {positionedImages[6] && (
                      <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--third">
                        <img
                          src={`${aws_object_url}${positionedImages[6].url}`}
                          alt={positionedImages[6].name || ""}
                          className="sm-second-ms-slider-img"
                        />
                        {isSliderEdit && (
                          <img
                            src={editIconCircleBlue}
                            alt="edit icon"
                            className="edit_icon_msn_slider"
                            onClick={() => handleImageEdit(6)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Second masonry wrapper - positions 7-13 */}
                {Object.keys(positionedImages).some(
                  (key) => parseInt(key) >= 7
                ) && (
                  <div className="masonry_wrapper">
                    <div className="col-first-layout">
                      {positionedImages[7] &&
                        renderLargeImageWithEdit(7, "lg-first-ms-slider-img")}
                      <div className="btm-col-first-layout">
                        {renderImageWithEdit(8, "sm-first-ms-slider-img")}
                        {renderImageWithEdit(9, "sm-first-ms-slider-img")}
                      </div>
                    </div>
                    <div className="col-second-layout">
                      {renderImageWithEdit(10, "sm-second-ms-slider-img")}
                      {positionedImages[11] && (
                        <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--second">
                          <img
                            src={`${aws_object_url}${positionedImages[11].url}`}
                            alt={positionedImages[11].name || ""}
                            className="lg-second-ms-slider-img"
                          />
                          {isSliderEdit && (
                            <img
                              src={editIconCircleBlue}
                              alt="edit icon"
                              className="edit_icon_msn_slider"
                              onClick={() => handleImageEdit(11)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-third-layout">
                      {renderImageWithEdit(12, "lg-second-ms-slider-img")}
                      {positionedImages[13] && (
                        <div className="wraper_cmn_ms_slider_img_icon wraper_cmn_ms_slider_img_icon--third">
                          <img
                            src={`${aws_object_url}${positionedImages[13].url}`}
                            alt={positionedImages[13].name || ""}
                            className="sm-second-ms-slider-img"
                          />
                          {isSliderEdit && (
                            <img
                              src={editIconCircleBlue}
                              alt="edit icon"
                              className="edit_icon_msn_slider"
                              onClick={() => handleImageEdit(13)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="single_slider_msn_slider--wrapper">
              {!isSliderEdit && (
                <Link to={businessProfileEditURL2} className="edit_cta--view">
                  <img
                    src={dropdownIconBlack}
                    alt="icon"
                    className="icon_back_edit"
                  />
                  Edit
                </Link>
              )}
              <div className="single_image_slide--sm-masn">
                {Array.from({ length: 7 }).map((_, index) => {
                  const imageData = positionedImages[index];
                  if (!imageData) return null;

                  return (
                    <div
                      key={`slider-${index}`}
                      className="slider-image-wrapper"
                    >
                      <img
                        src={`${aws_object_url}${imageData.url}`}
                        alt={imageData.name || ""}
                        className="single_img_slide"
                      />
                      {isSliderEdit && (
                        <img
                          src={editIconCircleBlue}
                          alt="edit icon"
                          className="edit_icon_msn_slider"
                          onClick={() => handleImageEdit(index)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MsonarySlider;
