import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "../css/BlogSection.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authContext } from "../App";
import Cookies from "universal-cookie";

export default function Blogs() {
  const Scroll = useRef(0);
  const cookies = new Cookies();
  const { isAdmin } = useContext(authContext);
  const [blog, setBlog] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(2);
  const [route, setRoute] = useState("");
  function fetchData() {
    const route = "";
    axios
      .post("http://localhost:5000/blog", { route, limit })
      .then((res) => setBlog(res.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    window.scrollTop = Scroll.current;
    cookies.remove("scroll");
    fetchData();
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll);
    };
  }, [limit]);

  async function handleInfiniteScroll() {
    Scroll.current = document.documentElement.scrollTop;
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setlimit((prev) => prev + 2);
        axios
          .post("http://localhost:5000/blog", { route, limit })
          .then((res) => setBlog(res.data))
          .catch((err) => console.log(err));
      }
    } catch (err) {
      console.log(err);
    }
  }
  const handleLinkClick = (route) => {
    setRoute(route);
    axios
      .post("http://localhost:5000/blog", { route, limit })
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
      .post("http://localhost:5000/search/home", { search })
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
                        Read Post{" "}
                        <img src="../public/img/arrow right.svg" alt="" />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="sidebar">
          <h3>Blog Catagories</h3>
          <div className="catalog">
            <input
              type="text"
              placeholder="Search Blog..."
              onChange={(e) => searchBlog(e)}
            />
            <ul>
              <li
                onClick={() => {
                  handleLinkClick("");
                }}
              >
                View All
              </li>
              <li
                onClick={() => {
                  handleLinkClick("technology");
                }}
              >
                Technology
              </li>
              <li
                onClick={() => {
                  handleLinkClick("science");
                }}
              >
                Science
              </li>
              <li
                onClick={() => {
                  handleLinkClick("currentaffairs");
                }}
              >
                Current Affairs
              </li>
              <li
                onClick={() => {
                  handleLinkClick("bookreview");
                }}
              >
                Book Review
              </li>
              <li
                onClick={() => {
                  handleLinkClick("coding");
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
