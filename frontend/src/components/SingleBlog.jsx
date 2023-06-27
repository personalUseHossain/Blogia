import React, { useEffect, useState } from "react";
import "../css/SingleBlog.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SingleBlog() {
  const navigate = useNavigate();
  const [singleBlog, setsingleBlog] = useState([]);
  const { id } = useParams();
  function fetchsingleData() {
    axios
      .post(`http://localhost:5000/blog/:id`, { id })
      .then((res) => {
        setsingleBlog(res.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    fetchsingleData();
  }, []);
  window.scrollTo(0, 0);
  return (
    <>
      <button className="goback" onClick={() => navigate(-1)}>
        X
      </button>
      <div className="singleBlog">
        <img className="singleBlogImg" src={singleBlog.img} alt="" />
        <h1>{singleBlog.heading}</h1>
        <p className="info">20 June 2023</p>
        <p>{singleBlog.bigblog}</p>
      </div>
    </>
  );
}
