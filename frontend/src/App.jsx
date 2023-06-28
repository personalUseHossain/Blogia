import React, { createContext, useState } from "react";
import Cookies from "universal-cookie";
import "./css/Universal.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Blog from "./components/Blogs";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import About from "./components/About";
import Login from "./components/Login";
import Singup from "./components/Singup";
import AddBlog from "./components/admin/AddBlog";
import { Route, Routes } from "react-router-dom";
import SingleBlog from "./components/SingleBlog";
import EditBlog from "./components/EditBlog";
import DeleteBlog from "./components/DeleteBlog";

export const authContext = createContext();
function App() {
  const cookies = new Cookies();
  const [userData, setUserData] = useState([]);
  const [token, setToken] = useState(cookies.get("jwt"));
  const [isAdmin, setAdmin] = useState(cookies.get("isAdmin"));
  return (
    <>
      <authContext.Provider
        value={{ token, setToken, isAdmin, setAdmin, userData, setUserData }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/addblog" element={<AddBlog />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="/delete/:id" element={<DeleteBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Singup />} />
        </Routes>
        <Footer />
      </authContext.Provider>
    </>
  );
}

export default App;
