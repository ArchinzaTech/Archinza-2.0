import React from "react";
import { NavLink } from "react-router-dom";
import SubNavItem from "./SubNavItem";
import { useWindowSize } from "react-use";
import { hamburgerLinkArrow } from "../../images";

const HeaderNavItem = ({
  navData,
  navActiveIndex,
  handleNavIndex,
  arrIndex,
}) => {
  const { width } = useWindowSize();

  if (navData.dropDownLevel === 2) {
    return (
      <li className="nav_item">
        <div
          className="nav_link_wrapper"
          onClick={() => handleNavIndex(arrIndex)}
        >
          <span className="nav_link">{navData.mainTitle}</span>
          {width >= 1024 ? (
            <img
              src="https://via.placeholder.com/20"
              alt="Down arrow"
              loading="lazy"
              className="headerdownarrow down_arrow"
            />
          ) : (
            <span className="headerdownarrow">
              {navActiveIndex === arrIndex ? (
                <img
                  src="https://via.placeholder.com/20"
                  alt="down arrow img"
                  loading="lazy"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/20"
                  className="down_arrow"
                  alt="down arrow img"
                  loading="lazy"
                />
              )}
            </span>
          )}
        </div>
        <div
          className={`dropdown_box ${
            navActiveIndex === arrIndex ? "active" : ""
          }`}
        >
          {/*  */}
          {width >= 1024 && (
            <img
              src="https://via.placeholder.com/20"
              alt="dropdown box up arrow"
              loading="lazy"
              className="dropdownboxuparrow down_arrow"
            />
          )}
          <>
            {navData.dropDownList.map((dropDownData, i) => (
              <SubNavItem
                dropDownData={dropDownData}
                key={dropDownData.id}
                dropDownIndex={i}
              />
            ))}
          </>
        </div>
      </li>
    );
  }

  if (navData.dropDownLevel === 1) {
    return (
      <li className="nav_item">
        <div
          className="nav_link_wrapper"
          onClick={() => handleNavIndex(arrIndex)}
        >
          <span className="nav_link">{navData.mainTitle}</span>
          {width >= 1024 ? (
            <img
              src="https://via.placeholder.com/20"
              alt="Down arrow"
              className="headerdownarrow"
              loading="lazy"
            />
          ) : (
            <span className="headerdownarrow">
              {navActiveIndex === arrIndex ? (
                <img
                  src="https://via.placeholder.com/20"
                  alt="down arrow img"
                  loading="lazy"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/20"
                  className="down_arrow"
                  alt="down arrow img"
                  loading="lazy"
                />
              )}
            </span>
          )}
        </div>
        <div
          className={`dropdown_box ${
            navActiveIndex === arrIndex ? "active" : ""
          }`}
        >
          {width >= 1024 && (
            <img
              src="https://via.placeholder.com/20"
              alt="dropdown box up arrow"
              loading="lazy"
              className="dropdownboxuparrow"
            />
          )}
          {navData.dropDownList.map((data, i) => (
            <div className="dropdown_list_item" key={data.id}>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "dropdown_list_item_link active"
                    : "dropdown_list_item_link"
                }
                to={data.navLink}
              >
                {data.navTitle}
              </NavLink>
            </div>
          ))}
        </div>
      </li>
    );
  }

  return (
    <>
      <li className="nav_item">
        {navData.linktype === "external" ? (
          <a
            className="nav_link"
            href={navData.mainLink}
            target="_blank"
            rel="noreferrer"
          >
            {navData.mainTitle}
            <img
              src={hamburgerLinkArrow}
              alt="arrow"
              loading="lazy"
              className="active_arrow"
            />
          </a>
        ) : // ) : (
        navData.linktype === "externalbtn" ? (
          <a
            className="nav_link"
            href={navData.mainLink}
            target="_blank"
            rel="noreferrer"
          >
            <button className="nav_linkbtn">
              {navData.mainTitle}
              <img
                src="https://via.placeholder.com/20"
                alt="arrow"
                loading="lazy"
                className="active_arrow"
              />
            </button>
          </a>
        ) : (
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav_link active" : "nav_link"
            }
            to={navData.mainLink}
          >
            {navData.mainTitle}
            {navData.typeLogin !== "Login" ? (
              <img
                src={hamburgerLinkArrow}
                alt="arrow"
                loading="lazy"
                className="active_arrow"
              />
            ) : null}
          </NavLink>
        )}
      </li>
    </>
  );
};

export default HeaderNavItem;
