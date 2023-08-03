import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/Home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { authContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { isAdmin } = useContext(authContext);
  const lastScrollRef = useRef(0);
  const [homeBlog, setHomeBlog] = useState([]);
  const [search, setSearch] = useState("");
  const [loadedBlog, setloadedBlog] = useState(5);
  const categorySectionRef = useRef(null);
  function fetchData() {
    let route = "";
    axios
      .post("http://localhost:5000/home", { route, loadedBlog })
      .then((res) => {
        setHomeBlog(res.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    fetchData();
  }, []);
  function handleChangeBlog(route) {
    axios
      .post("http://localhost:5000/home", { route, loadedBlog })
      .then((res) => {
        setHomeBlog(res.data);
      })
      .catch((err) => console.log(err));
  }
  function searchBlog(e) {
    const filterBlog = homeBlog.filter((blog) => {
      return Object.values(blog).includes(e.target.value);
    });
    setHomeBlog(filterBlog);
  }
  function searchBlog(e) {
    setSearch(e.target.value);
    axios
      .post("http://localhost:5000/search/home", { search })
      .then((res) => {
        if (res.data.length === 0) {
          setHomeBlog([]);
          document.getElementById("noresulterr").style.display = "block";
        } else {
          setHomeBlog(res.data);
          document.getElementById("noresulterr").style.display = "none";
        }
      })
      .catch((err) => console.log(err));
  }

  function LoadBlog() {
    setloadedBlog((prev) => prev + 10);
  }

  //hiding and showing category section when scrolling

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > lastScrollRef.current) {
        setTimeout(() => {
          categorySectionRef.current.style.transform = "translateY(-50rem)";
        }, 300);
      } else {
        setTimeout(() => {
          categorySectionRef.current.style.transform = "translateY(0)";
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
    axios
      .post("http://localhost:5000/home/loadmore", { loadedBlog, homeBlog })
      .then((res) => {
        setHomeBlog(res.data);
      })
      .catch((err) => console.log(err));
  }, [loadedBlog]);
  return (
    <>
      <section className="home-section">
        <div className="home-txt">
          <h1>Subscribe to Blogia for free to get blogs every week</h1>
          <p>
            New Blogs every week on latest topics checkout our latest blog now
          </p>
        </div>
        <form className="subscribe">
          <input type="text" placeholder="Enter you email..." />
          <button>Subscribe</button>
        </form>
      </section>
      <section className="blogs">
        <div className="category" ref={categorySectionRef}>
          <ul>
            <li onClick={() => handleChangeBlog("")}>All</li>
            <li onClick={() => handleChangeBlog("technology")}>Technology</li>
            <li onClick={() => handleChangeBlog("coding")}>Coding</li>
            <li onClick={() => handleChangeBlog("currentaffairs")}>Current</li>
            <li onClick={() => handleChangeBlog("science")}>Science</li>
            <li onClick={() => handleChangeBlog("bookreview")}>Book</li>
          </ul>
          <div className="search-section">
            <input
              type="text"
              placeholder="Seach blog here.."
              onChange={(e) => searchBlog(e)}
            />
            <button>Search</button>
          </div>
        </div>

        <div className="blog-container">
          <h1 id="noresulterr" style={{ display: "none" }}>
            No Result Found with '{search}' keyword
          </h1>
          {homeBlog.map((blog) => {
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
        </div>
      </section>
      <button onClick={LoadBlog} className="loadMoreBTN">
        Load more
      </button>
    </>
  );
}
