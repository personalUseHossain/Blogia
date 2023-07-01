import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import "../css/Login.css";
import { authContext } from "../App";

export default function Login() {
  const { token, setToken, setAdmin, setUserData } = useContext(authContext);

  const navigate = useNavigate();
  const cookies = new Cookies();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  let name, value;
  function handleInput(e) {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  }
  async function submitLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      var expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      console.log(data);
      if (data.error) {
        alert(data.error);
      }
      if (data.checkUser.admin) {
        window.alert("welcome admin");
        setAdmin(true);
        cookies.set("isAdmin", true, { expires: expirationDate });
        setToken(data.token);
        cookies.set("jwt", data.token, { expires: expirationDate });
        navigate("/blogs");
        setUserData(data.checkUser);
      } else if (data.token) {
        setToken(data.token);
        cookies.set("jwt", data.token, { expires: expirationDate });
        window.alert("sucessfully login");
        setAdmin(false);
        navigate("/");
        setUserData(data.checkUser);
      } else {
        window.alert("Invalid Data. Please try again");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <section className="login">
        <h1>Login</h1>
        <form>
          <div className="input">
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginRight: "1rem", fontSize: "20px" }}
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInput}
              placeholder="Enter Email.."
            />
          </div>
          <div className="input">
            <FontAwesomeIcon
              icon={faKey}
              style={{ marginRight: "1rem", fontSize: "20px" }}
            />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInput}
              placeholder="Enter Password.."
            />
          </div>
          <button onClick={submitLogin}>Login</button>
        </form>
      </section>
    </>
  );
}
