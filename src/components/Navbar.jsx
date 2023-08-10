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

export default function Navbar() {
  const lastScrollRef = useRef(0);
  const navbarRef = useRef(null);
  const { userData } = useContext(authContext);
  const DarkRef = useRef(null);
  const [themeIcon, setThemeIcon] = useState(faSun);
  const navigate = useNavigate();
  const menu = useRef(null);
  const [icon, setIcon] = useState(faBarsStaggered);
  const cookies = new Cookies();
  const { token, setToken, isAdmin } = useContext(authContext);
  function handleLogout() {
    cookies.remove("jwt", { path: "https://blogia.onrender.com" });
    cookies.remove("isAdmin", { path: "https://blogia.onrender.com" });
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

  function toggleUserInfo() {
    const user_menu = document.querySelector(".user-menu");
    if (user_menu.style.display === "none") {
      user_menu.style.display = "grid";
    } else {
      user_menu.style.display = "none";
    }
  }

  //hiding and showing navbar when scrolling

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > lastScrollRef.current) {
        setTimeout(() => {
          document.querySelector(".navbar").style.transform =
            "translateY(-7rem)";
        }, 300);
      } else {
        setTimeout(() => {
          document.querySelector(".navbar").style.transform = "translateY(0)";
        }, 300);
      }

      lastScrollRef.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    handleDarkToggle();
  }, []);
  return (
    <>
      {token !== undefined ? (
        <>
          <nav className="navbar" ref={navbarRef}>
            <div className="menu-logo">
              <Link onClick={handleMenuClick} to="/">
                <img
                  className="logo"
                  src="https://cdn-icons-png.flaticon.com/512/60/60736.png"
                  alt="Logo"
                />
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
                onClick={toggleUserInfo}
                src={
                  userData.img !== null
                    ? `https://blogiabackend.onrender.com/public/${userData.img}`
                    : "https://rb.gy/vz10c"
                }
                alt="User"
              />

              <div className="user-menu" style={{ display: "none" }}>
                <FontAwesomeIcon
                  onClick={toggleUserInfo}
                  icon={faXmark}
                  style={{
                    position: "absolute",
                    top: "2rem",
                    left: "2rem",
                    fontSize: "25px",
                    cursor: "pointer",
                    padding: "10px",
                  }}
                />
                <div className="user-info">
                  <img
                    src={
                      userData.img !== null
                        ? `https://blogiabackend.onrender.com/public/${userData.img}`
                        : "https://rb.gy/vz10c"
                    }
                    alt="User"
                  />
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
                <img
                  className="logo"
                  src="https://cdn-icons-png.flaticon.com/512/60/60736.png"
                  alt="Logo"
                />
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
