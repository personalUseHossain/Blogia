import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "../css/Login.css";
import { authContext } from "../App";

export default function Login() {
  const { setToken, setAdmin, isAdmin } = useContext(authContext);

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
      if (data.error) {
        alert(data.error);
      }
      if (data.checkUser.admin) {
        window.alert("welcome admin");
        setAdmin(true);
        cookies.set("isAdmin", true);
        setToken(data.token);
        cookies.set("jwt", data.token);
        navigate("/blogs");
      } else if (data.token) {
        setToken(data.token);
        cookies.set("jwt", data.token);
        window.alert("sucessfully login");
        setAdmin(false);
        navigate("/");
      } else {
        window.alert("Invalid Data. Please try again");
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <section className="login">
        <h1>Login</h1>
        <form>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInput}
            placeholder="Enter Email.."
          />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInput}
            placeholder="Enter Password.."
          />
          <button onClick={submitLogin}>Login</button>
        </form>
      </section>
    </>
  );
}
