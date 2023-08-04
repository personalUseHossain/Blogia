import React, { useEffect, useContext, useState } from "react";
import "../css/Contact.css";
import axios from "axios";
import { authContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const { token } = useContext(authContext);
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    message: "",
  });
  function GetUserData() {
    axios
      .post("http://localhost:5000/contact", { token })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }
  if (token) {
    inputValue.name = user.firstname;
    inputValue.email = user.email;
    useEffect(() => {
      GetUserData();
      setInputValue({ ...inputValue, name: user.firstname, email: user.email });
    }, []);
  }

  function handleInput(e) {
    let name = e.target.name,
      value = e.target.value;
    setInputValue({ ...inputValue, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5000/contact/form", { inputValue })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          window.alert("Sucessfully message send");
          navigate("/");
        } else {
          alert("Unknow Problem occure please try again");
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <div className="contact">
        <h1>
          Love to hear from you, <br />
          Get in touch with me
        </h1>
        <form>
          <div className="name-email">
            <label>
              <p>Your Name</p>
              <input
                placeholder="Enter you name..."
                type="text"
                value={user.firstname}
                onChange={(e) => handleInput(e)}
                name="name"
              />
            </label>
            <label>
              <p>Email</p>
              <input
                placeholder="Enter you email..."
                type="email"
                value={user.email}
                onChange={(e) => handleInput(e)}
                name="email"
              />
            </label>
          </div>
          <label>
            <p>Message</p>
            <textarea
              rows="10"
              name="message"
              value={inputValue.message}
              onChange={(e) => {
                handleInput(e);
              }}
            ></textarea>
          </label>
          <button onClick={handleSubmit}>Send</button>
        </form>
        <div className="map-container">
          <h1>Contact me physically here...</h1>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d251.1431160270501!2d90.36801608117312!3d23.78693968398198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1688116894883!5m2!1sen!2sbd"
            width="600"
            height="450"
            allowfullscreen=""
            loading="lazy"
            className="map"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}
