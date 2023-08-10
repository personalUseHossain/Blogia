import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faXmark,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import "../css/BlogSection.css";
import { Link } from "react-router-dom";
import { authContext } from "../App";
import Cookies from "universal-cookie";

export default function Blogs() {
  const lastScrollRef = useRef(0);
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const sideBar = useRef(null);
  const Scroll = useRef(0);
  const cookies = new Cookies();
  const [allLoaded, setAllLoaded] = useState(false);
  const [icon, setIcon] = useState(faBarsStaggered);
  const { isAdmin } = useContext(authContext);
  const [blog, setBlog] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(2);
  const [route, setRoute] = useState("");
  function fetchData() {
    const route = "";
    axios
      .post("https://blogiabackend.onrender.com/blog", { route, limit })
      .then((res) => setBlog(res.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    window.scrollTop = Scroll.current;
    cookies.remove("scroll");
    fetchData();
  }, []);
  useEffect(() => {
    if (allLoaded) {
      setLoading(false);
      window.removeEventListener("scroll", handleInfiniteScroll);
    } else {
      window.addEventListener("scroll", handleInfiniteScroll); // Add scroll event listener
    }
    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll);
    };
  }, [limit]);

  async function handleInfiniteScroll() {
    if (search !== "") {
      return;
    }
    Scroll.current = document.documentElement.scrollTop;
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.scrollHeight
      ) {
        setlimit((prev) => prev + 10);
        setLoading(true);
        axios
          .post("https://blogiabackend.onrender.com/blog", { route, limit })
          .then((res) => {
            if (blog.length === res.data.length) {
              setAllLoaded(true);
              setlimit(limit);
            } else {
              setBlog(res.data);
              setLoading(false);
            }
          })
          .catch((err) => console.log(err));
      }
    } catch (err) {
      console.log(err);
    }
  }
  const handleLinkClick = (route) => {
    setRoute(route);
    axios
      .post("https://blogiabackend.onrender.com/blog", { route, limit })
      .then((response) => {
        setBlog(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  function searchBlog(e) {
    setSearch(e.target.value);
    axios
      .post("https://blogiabackend.onrender.com/search/home", { search })
      .then((res) => {
        if (res.data.length === 0) {
          setBlog([]);
          document.getElementById("noresulterr").style.display = "block";
        } else {
          setBlog(res.data);
          document.getElementById("noresulterr").style.display = "none";
        }
      })
      .catch((err) => console.log(err));
  }
  function handleToggle() {
    if (icon === faBarsStaggered) {
      setIcon(faXmark);
      sideBar.current.style.left = "0";
      // sideBar.body.style.overflow = "hidden";
    } else {
      setIcon(faBarsStaggered);
      // document.body.style.overflow = "auto";
      sideBar.current.style.left = "-100%";
    }
  }
  function handleMenuClick() {
    setIcon(faBarsStaggered);
    sideBar.current.style.left = "-100%";
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero">
          <h1 id="noresulterr" style={{ display: "none" }}>
            No Result Found with '{search}' keyword
          </h1>
          {blog.map((blog) => {
            return (
              <div className="blog" key={blog._id}>
                <img src={blog.img} alt="" />
                <h1>{blog.heading}</h1>
                <p className="info">{blog.date}</p>
                <p>{blog.smallblog}</p>

                {isAdmin ? (
                  <>
                    <Link to={`/edit/${blog._id}`}>
                      <button>Edit</button>
                    </Link>
                    <Link to={`/delete/${blog._id}`}>
                      <button>Delete</button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={`/blog/${blog._id}`}>
                      <button>
                        Read Post
                        <FontAwesomeIcon
                          className="arrow"
                          icon={faArrowUpRightFromSquare}
                        />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            );
          })}

          {loading && (
            <>
              <img
                className="loading"
                src="./public/img/loading_icon.gif"
                alt=""
              />
              <h3 style={{ display: "block", margin: "auto" }}>Loading...</h3>
            </>
          )}
        </div>
        <FontAwesomeIcon
          onClick={handleToggle}
          className="toggleBlogs"
          icon={icon}
        />
        <div className="sidebar" ref={sideBar}>
          <h3>Blog Catagories</h3>
          <div className="catalog">
            <input
              type="text"
              placeholder="Search Blog..."
              onChange={(e) => {
                searchBlog(e);
              }}
            />
            <button
              onClick={() => {
                handleToggle();
                setIcon(faBarsStaggered);
              }}
            >
              Search
            </button>
            <ul>
              <li
                onClick={() => {
                  handleLinkClick("");
                  handleMenuClick();
                }}
              >
                View All
              </li>
              <li
                onClick={() => {
                  handleLinkClick("technology");
                  handleMenuClick();
                }}
              >
                Technology
              </li>
              <li
                onClick={() => {
                  handleLinkClick("science");
                  handleMenuClick();
                }}
              >
                Science
              </li>
              <li
                onClick={() => {
                  handleLinkClick("currentaffairs");
                  handleMenuClick();
                }}
              >
                Current Affairs
              </li>
              <li
                onClick={() => {
                  handleLinkClick("bookreview");
                  handleMenuClick();
                }}
              >
                Book Review
              </li>
              <li
                onClick={() => {
                  handleLinkClick("coding");
                  handleMenuClick();
                }}
              >
                Coding
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
