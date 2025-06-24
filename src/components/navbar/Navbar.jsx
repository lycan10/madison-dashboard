import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import "./navbar.css";
import defaultAvatar from "../../assets/a1.png";
import { useSidebar } from "../../context/SideBarContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { sidebarShow, toggleSidebar } = useSidebar();
  const { user, logout, setUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.profile_picture || defaultAvatar);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.profile_picture) {
      setAvatar(
        user.profile_picture.startsWith("http") ||
          user.profile_picture.startsWith("/")
          ? user.profile_picture
          : `${process.env.REACT_APP_BASE_URL}/storage/${user.profile_picture}`
      );
    } else {
      setAvatar(defaultAvatar);
    }
  }, [user?.profile_picture, process.env.REACT_APP_BASE_URL]);

  const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleAvatarChange = () => {
    fileInputRef.current.click();
    setDropdownOpen(false);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      setLoading(true);

      const formData = new FormData();
      formData.append("profile_picture", file);

      try {
        const userId = user?.id;

        if (!userId) {
          console.error(
            "User ID not available. Cannot upload profile picture."
          );
          setLoading(false);
          setAvatar(user?.profile_picture || defaultAvatar);
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/users/${userId}/profile-picture`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        if (!response.ok) {
          throw new Error("Failed to upload profile picture.");
        }

        const data = await response.json();
        console.log("Profile picture uploaded successfully:", data);

        const newProfilePicturePath =
          data.path.startsWith("http") || data.path.startsWith("/")
            ? data.path
            : `${process.env.REACT_APP_BASE_URL}/storage/${data.path}`;

        const updatedUser = { ...user, profile_picture: newProfilePicturePath };
        setUser(updatedUser); 
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        setAvatar(user?.profile_picture || defaultAvatar);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    window.location.reload();
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-date">
          <div
            className={`mobile-filter ${sidebarShow ? "show" : ""}`}
            onClick={toggleSidebar}
          >
            <HugeiconsIcon
              icon={Menu01Icon}
              size={16}
              color="#000000"
              strokeWidth={1.5}
            />
          </div>
          <div className="navbar-date-title">
            <p>{getFormattedDate()}</p>
          </div>
        </div>

        <div className="navbar-right">
          <div
            className={`navbar-image-container ${loading ? "loading" : ""}`}
            onClick={toggleDropdown}
          >
            <img src={avatar} alt="User" />
            {loading && <div className="spinner"></div>}
          </div>

          {dropdownOpen && (
            <div className="navbar-dropdown">
              <p onClick={handleAvatarChange}>Change logo</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <div className="navbar-text">
            <p>{user ? user.name : "Guest"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
