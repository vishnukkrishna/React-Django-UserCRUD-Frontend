import React, { useEffect, useState } from "react";
import axios from "axios";
import { getLocal } from "../helpers/auth";
import jwt_decode from "jwt-decode";
import profile from "../images/profile.png";
import { SlUserFollow } from "react-icons/sl";
import { AiFillPlusCircle } from "react-icons/ai";
import { SlLogout } from "react-icons/sl";
import "./userprofile.css";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user_id } = jwt_decode(getLocal());
  const [profile_img, setProfileImg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const history = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    profile_img: "",
  });

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/user-update/${user_id}/`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle the error or redirect to an error page if needed
      }
    }
    getUser();
  }, [user_id]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setProfileImg(selectedImage);
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!profile_img) {
      return; // Do nothing if there's no new image selected
    }

    const formData = new FormData();
    formData.append("profile_img", profile_img);

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/user-update-form/${user_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = { ...user, profile_img: response.data.profile_img };
      setUser(updatedUser);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setUploadError("Failed to update profile picture.");
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    history("/login");
  };

  return (
    <div className="sub-section">
      <div className="sub-one">
        <img
          className="profile-pic rounded"
          src={
            user.profile_img
              ? "http://localhost:8000" + user.profile_img
              : profile
          }
          alt=""
        />
        <form onSubmit={updateProfile}>
          <label htmlFor="profile_img" className="file-label"></label>
          <input
            type="file"
            id="profile_img"
            name="profile_img"
            onChange={handleImageChange}
          />
          <input
            type="submit"
            className="img-upload"
            value={isSubmitting ? "Uploading..." : "Upload Image"}
            disabled={isSubmitting}
          />
        </form>
        {uploadError && <p className="error">{uploadError}</p>}
        <h2>{user.username}</h2>
        <h3>{user.email}</h3>
        <p className="about">
          “I am passionate about my work. Because I love what I do, I have a
          steady source of motivation that drives me to do my best. In my last
          job, this passion led me to challenge myself daily and learn new
          skills that helped me to do better work. For example”
        </p>
      </div>
      <div className="sub-two">
        <h3 className="navi">
          Connect <SlUserFollow />
        </h3>
        <h3>
          Follow <AiFillPlusCircle />
        </h3>
        <h3 onClick={logout}>
          LogOut <SlLogout />
        </h3>
      </div>
    </div>
  );
}

export default UserProfile;
