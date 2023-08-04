import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { authContext } from "../App";

export default function EditBlog() {
  const navigate = useNavigate();
  const [singleBlog, setSingleBlog] = useState([]);
  const { id } = useParams();
  const { isAdmin } = useContext(authContext);
  useEffect(() => {
    axios
      .post("https://blogiabackend.onrender.com/edit", { id })
      .then((res) => {
        setSingleBlog(res.data);
      });
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("https://blogiabackend.onrender.com/updateBlog", { id, singleBlog })
      .then((res) => {
        if (res.status === 200) {
          alert("sucessfully updated");
          navigate("/blogs");
        }
      });
  }
  function handleInput(e) {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setSingleBlog({ ...singleBlog, [name]: value });
  }
  return (
    <>
      {isAdmin ? (
        <>
          <form method="post" className="addblog-container">
            <h1>Update Blog</h1>
            <label>
              Blog Heading
              <input
                type="text"
                onChange={handleInput}
                value={singleBlog.heading}
                placeholder="Blog Heading"
                name="heading"
              />
            </label>
            <label>
              Img URL
              <input
                type="text"
                onChange={handleInput}
                value={singleBlog.img}
                placeholder="Image URL 318*318"
                name="img"
              />
            </label>
            <label>
              Blog Category
              <input
                type="text"
                onChange={handleInput}
                value={singleBlog.category}
                placeholder="Blog category"
                name="category"
              />
            </label>
            <label>
              Small Heading
              <input
                type="text"
                onChange={handleInput}
                value={singleBlog.smallblog}
                placeholder="Small Heading"
                name="smallblog"
              />
            </label>
            <label>
              Blog
              <textarea
                style={{ width: "50vw" }}
                onChange={handleInput}
                value={singleBlog.bigblog}
                name="bigblog"
                cols="5"
                rows="30"
              ></textarea>
            </label>
            <button onClick={handleSubmit}>Update Blog</button>
          </form>
        </>
      ) : (
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          You're not allowed for this page
        </h1>
      )}
    </>
  );
}
