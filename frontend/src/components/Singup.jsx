import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";
import axios from "axios";

export default function Singup() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(null);
  const [OPTINPUT, setOTPINPUT] = useState("");
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  let inputname, value;
  const handleInput = (e) => {
    inputname = e.target.name;
    value = e.target.value;
    setUserData({ ...userData, [inputname]: value });
  };
  const { firstname, lastname, email, password } = userData;
  const submitForm = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPass) {
      alert("Password and confirm password dosen't match");
    }
    try {
      const data = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
        }),
      });
      const res = await data.json();
      if (res.error) {
        alert(res.error);
      }
      if (res.otp) {
        setOtp(res.otp);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <section className="signup">
        <h1>Register Now!</h1>
        <form method="POST">
          <label>
            <p>First Name</p>
            <input
              type="text"
              name="firstname"
              value={userData.firstname}
              placeholder="First Name..."
              onChange={handleInput}
            />
          </label>
          <label>
            <p>Last Name</p>
            <input
              type="text"
              name="lastname"
              value={userData.lastname}
              placeholder="Last Name..."
              onChange={handleInput}
            />
          </label>
          <label>
            <p>Email</p>
            <input
              type="email"
              name="email"
              value={userData.email}
              placeholder="Email..."
              onChange={handleInput}
            />
          </label>
          <label>
            <p>Password</p>
            <input
              type="password"
              name="password"
              value={userData.password}
              placeholder="Password"
              onChange={handleInput}
            />
          </label>
          <label>
            <p>Confirm Password</p>
            <input
              className="confirm"
              type="password"
              name="confirmPass"
              value={userData.confirmPass}
              placeholder="Confirm Email..."
              onChange={handleInput}
            />
          </label>
          <button onClick={submitForm}>Next</button>
        </form>
        {otp && (
          <>
            <input
              style={{ width: "20vw" }}
              value={OPTINPUT}
              type="number"
              placeholder="OTP..."
              onChange={(e) => {
                setOTPINPUT(e.target.value);
              }}
            />
            <button
              style={{ padding: "7px" }}
              onClick={() => {
                if (otp.toString() === OPTINPUT) {
                  axios
                    .post("http://localhost:5000/register/optverify", {
                      userData,
                    })
                    .then(() => {
                      alert("successfully user created");
                      navigate("/login");
                    });
                } else {
                  alert("Wrong OTP");
                }
              }}
            >
              SignUp
            </button>
          </>
        )}
      </section>
    </>
  );
}
