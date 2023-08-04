import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import "../css/Login.css";
import { authContext } from "../App";

export default function Login() {
  const { token, setToken, setAdmin, userData, setUserData } =
    useContext(authContext);

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
      const res = await fetch("https://blogiabackend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      var expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      if (data.error) return alert(data.error);
      if (data.checkUser.admin) {
        cookies.set("isAdmin", true, { expires: expirationDate });
        setAdmin(true);
      }
      setUserData(data.checkUser);
      setToken(data.token);
      cookies.set("userData", data.checkUser, { expires: expirationDate });
      cookies.set("jwt", data.token, { expires: expirationDate });
      console.log(data.checkUser);
      navigate("/");
      alert("sucessfully logged in");
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
