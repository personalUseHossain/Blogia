import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faXmark,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import "../css/Navbar.css";
import { authContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Logo from "/public/img/logo.png";

export default function Navbar() {
  const { userData } = useContext(authContext);
  const DarkRef = useRef(null);
  const [themeIcon, setThemeIcon] = useState(faSun);
  const navigate = useNavigate();
  const menu = useRef(null);
  const [icon, setIcon] = useState(faBarsStaggered);
  const cookies = new Cookies();
  const { token, setToken, isAdmin } = useContext(authContext);
  function handleLogout() {
    cookies.remove("jwt", { path: "http://localhost:5173" });
    cookies.remove("isAdmin", { path: "http://localhost:5173" });
    setToken(undefined);
    window.location.reload();
    navigate("/");
  }
  function handleToggle() {
    if (icon === faBarsStaggered) {
      setIcon(faXmark);
      menu.current.style.left = "0";
      document.body.style.overflow = "hidden";
    } else {
      setIcon(faBarsStaggered);
      document.body.style.overflow = "auto";
      menu.current.style.left = "-100%";
    }
  }
  function handleMenuClick() {
    setIcon(faBarsStaggered);
    menu.current.style.left = "-100%";
    document.body.style.overflow = "auto";
  }
  function handleDarkToggle() {
    const Darkmode = cookies.get("Darkmode") || false;
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    if (Darkmode === "false") {
      setThemeIcon(faMoon);
      cookies.set("Darkmode", "true", { expires: expirationDate });
      document.documentElement.style.setProperty("--white", "black");
      document.documentElement.style.setProperty("--dark", "white");
    } else {
      setThemeIcon(faSun);
      document.body.classList.remove("dark");
      cookies.set("Darkmode", "false", { expires: expirationDate });
      document.documentElement.style.setProperty("--white", "white");
      document.documentElement.style.setProperty("--dark", "black");
    }
  }
  useEffect(() => {
    handleDarkToggle();
  }, []);
  return (
    <>
      {token !== undefined ? (
        <>
          <nav className="navbar">
            <div className="menu-logo">
              <Link onClick={handleMenuClick} to="/">
                <img className="logo" src={Logo} alt="Logo" />
              </Link>
              <FontAwesomeIcon
                onClick={handleToggle}
                className="fa-solid fa-bars"
                icon={icon}
              />
              <ul className="navbar-ul" ref={menu}>
                {isAdmin && (
                  <>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/blogs">
                        Blogs
                      </Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/admin/addblog">
                        Add
                      </Link>
                    </li>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/">
                        Home
                      </Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/blogs">
                        Blogs
                      </Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/contact">
                        Contact
                      </Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/about">
                        About
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="user-nav">
              <img
                onClick={() => {
                  const user_menu = document.querySelector(".user-menu");
                  if (user_menu.style.display === "none") {
                    user_menu.style.display = "grid";
                  } else {
                    user_menu.style.display = "none";
                  }
                }}
                src={
                  userData.img
                    ? `../public/uploads/${userData.img}`
                    : "https://rb.gy/vz10c"
                }
                alt="User"
              />

              <div className="user-menu" style={{ display: "none" }}>
                <div className="user-info">
                  <img src={`../public/uploads/${userData.img}`} alt="404" />
                  <h3>{`${userData.firstname}  ${userData.lastname}`}</h3>
                </div>
                <div className="button">
                  <Link to={"/updateUserInfo"}>
                    <button> Update Profile</button>
                  </Link>
                  <button
                    onClick={() => {
                      cookies.remove("jwt");
                      cookies.remove("isAdmin");
                      cookies.remove("userData");
                      window.location.reload(false);
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <FontAwesomeIcon
                ref={DarkRef}
                icon={themeIcon}
                onClick={handleDarkToggle}
                className="toggleDark"
              />
            </div>
          </nav>
        </>
      ) : (
        <>
          <nav className="navbar">
            <div className="menu-logo">
              <Link onClick={handleMenuClick} to="/">
                <img className="logo" src="./public/img/logo.png" alt="Logo" />
              </Link>
              <FontAwesomeIcon
                onClick={handleToggle}
                className="fa-solid fa-bars"
                icon={icon}
              />
              <ul className="navbar-ul" ref={menu}>
                <li className="navbar-li">
                  <Link onClick={handleMenuClick} to="/">
                    Home
                  </Link>
                </li>
                <li className="navbar-li">
                  <Link onClick={handleMenuClick} to="/blogs">
                    Blogs
                  </Link>
                </li>
                <li className="navbar-li">
                  <Link onClick={handleMenuClick} to="/contact">
                    Contact
                  </Link>
                </li>
                <li className="navbar-li">
                  <Link onClick={handleMenuClick} to="/about">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="user-nav">
              {/* <div className="user">
                    <img className="user-img" src="./public/img/userImg.png" onerror="errimg()" />
                    <i className="fa-solid fa-bars-staggered"></i>
                </div> */}
              <Link onClick={handleMenuClick} to={"/login"}>
                <button>Login</button>
              </Link>
              <Link onClick={handleMenuClick} to={"/signup"}>
                <button className="signup">SignUp</button>
              </Link>
              <FontAwesomeIcon
                ref={DarkRef}
                icon={themeIcon}
                onClick={handleDarkToggle}
                className="toggleDark"
              />
            </div>
          </nav>
        </>
      )}
    </>
  );
}
