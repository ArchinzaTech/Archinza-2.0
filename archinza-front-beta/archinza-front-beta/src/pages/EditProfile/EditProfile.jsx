import React, { useEffect } from "react";
import "./edit-profile.scss";
import { useWindowSize } from "react-use";
import FooterV2 from "../../components/FooterV2/FooterV2";
import BlinkingDots from "../../Animations/BlinkingDots/BlinkingDots";
import EditFullName from "./EditProfileComponents/EditFullName";
import EditEmailId from "./EditProfileComponents/EditEmailId";
import EditPassword from "./EditProfileComponents/EditPassword";
import EditContact from "./EditProfileComponents/EditContact";
import EditWhatsapp from "./EditProfileComponents/EditWhatsapp";
import { useAuth } from "../../context/Auth/AuthState";
import EditCountry from "./EditProfileComponents/EditCountry";

const EditProfile = () => {
  const { width } = useWindowSize();
  const auth = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BlinkingDots />
      <main className="edit_container">
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
                      <EditFullName />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "pe-0"}`}>
                      <EditEmailId />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditPassword />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "pe-0"}`}>
                      <EditContact user={auth?.user} />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "ps-0"}`}>
                      <EditWhatsapp />
                    </div>
                    <div className={`col-lg-6 ${width > 992 && "pe-0"}`}>
                      <EditCountry />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterV2 />
      </main>
    </>
  );
};
export default EditProfile;
