import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function DeleteBlog() {
  const [blog, setBlog] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .post(`http://localhost:5000/delete/${id}`, { id })
      .then((res) => {
        setBlog(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);
  console.log(id);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <h1>Successfully Blog Deleted</h1>
      <Link to={"/blogs"}>Go Back</Link>
    </div>
  );
}
