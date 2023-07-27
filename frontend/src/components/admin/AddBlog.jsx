import React, { useContext, useState, useRef } from "react";
import "./AdminCSS/AddBlog.css";
import { authContext } from "../../App";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddBlog() {
  const { isAdmin } = useContext(authContext);
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

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:5000/admin/blog/add", { blogContent })
      .then((res) => {
        console.log(res.data);
        setblogContent({
          heading: "",
          img: "",
          blog: "",
          category: "",
        });
        window.alert("Blog sucessfully added");
      })
      .catch((err) => console.log(err));
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
              Small Heading
              <input
                type="text"
                onChange={handleInput}
                value={blogContent.smallHeading}
                placeholder="Small Heading"
                name="smallHeading"
              />
            </label>
            <label>
              Blog
              <textarea
                className="textarea"
                name="blog"
                value={blogContent.blog}
                onChange={handleInput}
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
            Restricted page.
          </h1>
        </>
      )}
    </>
  );
}
