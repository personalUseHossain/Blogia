import React, { useContext, useRef, useState } from "react";
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
  const DarkRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
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
    if (themeIcon === faSun) {
      setThemeIcon(faMoon);
      setDarkMode(true);
      document.documentElement.style.setProperty("--white", "black");
      document.documentElement.style.setProperty("--dark", "white");
    } else {
      setThemeIcon(faSun);
      setDarkMode(false);
      document.body.classList.remove("dark");
      document.documentElement.style.setProperty("--white", "white");
      document.documentElement.style.setProperty("--dark", "black");
    }
  }
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
                {/* {isAdmin ? (
                  <>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/blogs">Blogs</Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/admin/addblog">Add Blog</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/">Home</Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/blogs">Blogs</Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/contact">Contact</Link>
                    </li>
                    <li className="navbar-li">
                      <Link onClick={handleMenuClick} to="/about">About</Link>
                    </li>
                  </>
                )} */}
              </ul>
            </div>

            <div className="user-nav">
              {/* <div className="user">
                    <img className="user-img" src="./public/img/userImg.png" onerror="errimg()" />
                    <i className="fa-solid fa-bars-staggered"></i>
                </div> */}
              <button onClick={handleLogout}>Log Out</button>
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
