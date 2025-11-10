import React, { useEffect } from "react";
import "./edit-profile-business.scss";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import EditFullName from "./EditProfileComponents/EditFullName";
import EditEmailId from "./EditProfileComponents/EditEmailId";
import { useAuth } from "../../context/Auth/AuthState";
import EditBusinessContactPerson from "./EditBusinessProfileComponents/EditBusinessContactPerson";
import EditFirmBusinessEmailId from "./EditBusinessProfileComponents/EditFirmBusinessEmailId";
import EditContact from "./EditBusinessProfileComponents/EditContact";
import EditWhatsapp from "./EditBusinessProfileComponents/EditWhatsapp";
import EditBusinessUserName from "./EditBusinessProfileComponents/EditBusinessUserName";
import EditPassword from "./EditBusinessProfileComponents/EditPassword";
import EditCountry from "./EditBusinessProfileComponents/EditCountry";
import EditOwnerName from "./EditOwnerDetailsComponents/EditOwnerName";
import EditOwnerEmailId from "./EditOwnerDetailsComponents/EditOwnerEmailId";
import EditOwnerContact from "./EditOwnerDetailsComponents/EditOwnerContact";
import EditOwnerWhatsapp from "./EditOwnerDetailsComponents/EditOwnerWhatsapp";
// import FooterV2 from "../../components/FooterV2/FooterV2";

const EditProfileBusiness = () => {
  const { width } = useWindowSize();
  const auth = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="edit_container-business">
        <section className="edit_sec1">
          <div className="my_container">
            <div className="row">
              <div className="col-md-3 d-none d-md-block d-lg-block">
                <p className="title">My Account</p>
                <ul className="account_list">
                  <li className="list-item">Edit Your Profile</li>
                </ul>
              </div>
              <div className="col-md-9">
                <div className="role_wrap">
                  <p className="role_title">YOUR ROLE</p>
                  <p
                    className="user_role"
                    style={{ color: auth?.user?.userType?.color }}
                  >
                    {auth?.user?.userType?.name}
                  </p>
                </div>
                <div className="profile_form_container">
                  <div className={`row ${width < 600 && "gx-0"}`}>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditBusinessContactPerson lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "pe-0"}`}>
                      <EditFirmBusinessEmailId lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditContact lightTheme={true} user={auth?.user} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "pe-0"}`}>
                      <EditWhatsapp lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditBusinessUserName lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "pe-0"}`}>
                      <EditPassword lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}></div>
                    <div className={`col-lg-12 ${width > 992 && "p-0"}`}>
                      <EditCountry lightTheme={true} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 hr_line"></div>

              <div className="col-md-3 d-none d-md-block d-lg-block"></div>
              <div className="col-md-9">
                <div className="role_wrap">
                  <p className="role_title owner_details">Owner Details</p>
                  <p
                    className="user_role"
                    style={{ color: auth?.user?.userType?.color }}
                  >
                    {auth?.user?.userType?.name}
                  </p>
                </div>

                <div className="profile_form_container">
                  <div className={`row ${width < 600 && "gx-0"}`}>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerName lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerEmailId lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerContact lightTheme={true} user={auth?.user} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerWhatsapp lightTheme={true} />
                    </div>
                  </div>
                </div>

                <div className="hr_line_owner_details"></div>

                <div className="profile_form_container">
                  <div className={`row ${width < 600 && "gx-0"}`}>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerName lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerEmailId lightTheme={true} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerContact lightTheme={true} user={auth?.user} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditOwnerWhatsapp lightTheme={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterV2 lightTheme />
      </main>
    </>
  );
};
export default EditProfileBusiness;
