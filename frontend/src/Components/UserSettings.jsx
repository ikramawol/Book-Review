import React, { useState } from 'react';
import Navbar from './Navbar';
import "../styles/userSetting.css";

const UserSettings = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const avatars = [
    "/avatars/avatar1.jpg",
    "/avatars/avatar2.jpg",
    "/avatars/avatar3.jpg",
    "/avatars/avatar4.webp",
    "/avatars/avatar5.jpg",
    "./pfp.png",
  ];

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    // Here you can call an API to update password
  };

  return (
    <div className="user-settings-container">
      <Navbar />

      <div className="navgap"></div>
 
      <div className="settings-wrapper">
        <h2>User Settings</h2>

        {/* Avatar Selection */}
        <section className="avatar-section">
          <h3>Select Your Avatar</h3>
          <div className="avatar-list">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`avatar-${index}`}
                className={`avatar ${selectedAvatar === avatar ? "selected" : ""}`}
                onClick={() => handleAvatarSelect(avatar)}
              />
            ))}
          </div>
          {selectedAvatar && (
            <p className="selected-text">Selected Avatar: {selectedAvatar}</p>
          )}
        </section>

        {/* Update Password */}
        <section className="password-section">
          <h3>Update Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <div className="input-group">
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                required
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="update-btn">Update Password</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default UserSettings;
