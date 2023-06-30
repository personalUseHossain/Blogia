import React, { useEffect, useRef, useState, useContext } from "react";
import "../css/SingleBlog.css";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { authContext } from "../App";

export default function SingleBlog() {
  const { token, userData } = useContext(authContext);
  const navigate = useNavigate();
  const [singleBlog, setsingleBlog] = useState({});
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const commentIput = useRef(null);
  function fetchsingleData() {
    axios
      .post(`http://localhost:5000/blog/:id`, { id })
      .then((res) => {
        setsingleBlog(res.data);
      })
      .catch((err) => console.log(err));
  }
  const handleCommentSubmit = () => {
    console.log(userData);
    if (commentIput.current.value === "") {
      alert("Please enter something on comment box");
    } else {
      axios
        .post("http://localhost:5000/comment", {
          singleBlog,
          comment,
          userData,
        })
        .then((res) => {
          if (res.status === 200) {
            fetchsingleData();
            setComment("");
            window.alert("comment sent");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } else {
      fetchsingleData();
    }
  }, []);
  return (
    <>
      {token ? (
        <>
          <button className="goback" onClick={() => navigate(-1)}>
            X
          </button>
          <div className="singleBlog">
            <img className="singleBlogImg" src={singleBlog.img} alt="" />
            <h1>{singleBlog.heading}</h1>
            <p className="info">20 June 2023</p>
            <div dangerouslySetInnerHTML={{ __html: singleBlog.bigblog }}></div>
          </div>

          {singleBlog.comments ? (
            <>
              <div className="comments">
                <div className="comment-input">
                  <FontAwesomeIcon className="comment-icon" icon={faComment} />
                  <input
                    type="text"
                    ref={commentIput}
                    placeholder="Comment here...."
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button onClick={handleCommentSubmit}>
                    <FontAwesomeIcon
                      className="comment-icon"
                      icon={faPaperPlane}
                    />
                  </button>
                </div>
                {singleBlog.comments.length > 0 ? (
                  <>
                    {singleBlog.comments.map((com) => {
                      return (
                        <div className="comment" key={com.date}>
                          <img
                            className="userImg"
                            src="../public/img/userImg.png"
                            alt=""
                          />
                          <h3>{com.name}</h3>
                          <small>{com.date}</small>
                          <p>{com.comment}</p>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <h2 style={{ textAlign: "center", margin: "5rem" }}>
                      No Comment available
                    </h2>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: "center", margin: "5rem" }}>
                Loading comments...
              </h2>
            </>
          )}
        </>
      ) : (
        <>
          <h1>Sorry you can't acess this page before login.</h1>
          <p>Navigating you to login page</p>
        </>
      )}
    </>
  );
}

{
  /* <h2 style={{ textAlign: "center", margin: "5rem" }}>
          No Comment available
        </h2> */
}
