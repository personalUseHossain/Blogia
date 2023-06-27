import React, { useContext, useEffect, useState } from "react";
import "./AdminCSS/AddBlog.css";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../App";

export default function AddBlog() {
  const { isAdmin } = useContext(authContext);
  const navigate = useNavigate();
  const [blogContent, setblogContent] = useState({
    heading: "",
    img: "",
    blog: "",
    category: "",
  });
  function handleInput(e) {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setblogContent({ ...blogContent, [name]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/admin/blog/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogContent),
    });
    setblogContent({
      heading: "",
      img: "",
      blog: "",
      category: "",
    });
    window.alert("Blog sucessfully added");
  }
  return (
    <>
      {isAdmin ? (
        <>
          <form method="post" className="addblog-container">
            <h1>Add Blog</h1>
            <label>
              Blog Heading
              <input
                type="text"
                onChange={handleInput}
                value={blogContent.heading}
                placeholder="Blog Heading"
                name="heading"
              />
            </label>
            <label>
              Img URL
              <input
                type="text"
                onChange={handleInput}
                value={blogContent.img}
                placeholder="Image URL 318*318"
                name="img"
              />
            </label>
            <label>
              Blog Category
              <input
                type="text"
                onChange={handleInput}
                value={blogContent.category}
                placeholder="Blog category"
                name="category"
              />
            </label>
            <label>
              Blog
              <textarea
                onChange={handleInput}
                value={blogContent.blog}
                name="blog"
                cols="5"
                rows="30"
              ></textarea>
            </label>
            <button type="submit" onClick={handleSubmit}>
              Add Blog
            </button>
          </form>
        </>
      ) : (
        <>
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
        </>
      )}
    </>
  );
}
