import React, { useContext, useEffect, useState } from "react";
import "../css/UpdateUserInfo.css";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faUser,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import { authContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function UpdateUserInfo() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(authContext);
  const [name, setName] = useState(
    userData.firstname + " " + userData.lastname
  );
  const cookies = new Cookies();
  const [ImageUrl, setImageUrl] = useState(null);
  async function handleUpdateProfile() {
    if (!ImageUrl) return alert("please select a profile image");
    try {
      const formData = new FormData();
      formData.append("image", ImageUrl);
      const requestData = {
        userData: userData,
        name: name,
      };
      const req = await axios.post(
        "http://localhost:5000/updateUserProfile",
        formData,
        {
          params: requestData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const data = req.data;
      console.log(data);
      if (data) {
        setUserData(data);
        cookies.set("userData", data);
        navigate("/");
        alert("sucessfully user data updated");
      }
    } catch (err) {
      console.log(err);
    }
  }
  console.log(delete "./public/uploads/1691138207291my img.jpg");
  return (
    <div className="updateUserInfo">
      <h1>Update Your Details</h1>
      <label>
        <FontAwesomeIcon icon={faUser} style={{ fontSize: "20px" }} />
        <p>What's your name</p>
        <input
          type="text"
          placeholder={userData.firstname + " " + userData.lastname}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        <FontAwesomeIcon icon={faImage} style={{ fontSize: "20px" }} />
        <p>Profile Image</p>
        {/* <FileBase64
          multiple={false}
          onDone={(base64) => setImageUrl(base64.base64)}
        /> */}
        <input
          type="file"
          accept="image/"
          onChange={(e) => setImageUrl(e.target.files[0])}
        />
      </label>

      <button onClick={handleUpdateProfile}>
        Save Updated Details <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
