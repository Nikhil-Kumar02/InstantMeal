import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./Profile.css";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL;

function Profile() {
  const navigate = useNavigate();

  const {user, setUser} = useContext(StoreContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = response.data;

      setUser(profile);

      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Unable to load profile:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      toast.error("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return "U";
    }

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    const emailChanged =
      formData.email.trim().toLowerCase() !== user.email.toLowerCase();

    const passwordChanged = formData.newPassword.trim() !== "";

    if (emailChanged || passwordChanged) {
      if (!formData.currentPassword) {
        toast.error("Please enter your current password.");
        return;
      }
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE}/users/me`,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = response.data.user;

      const newToken = response.data.token;

      /* Store refreshed JWT. */
      localStorage.setItem("token", newToken);

      /* Store updated user. */
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        currentPassword: "",
        newPassword: "",
      });

      toast.success("Profile updated successfully!");

      /* Return to the application after successfully saving. */
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.error("Profile update failed:", error);

      const message = error.response?.data?.message;

      if (message) {
        toast.error(message);
      } else {
        toast.error("Unable to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}

        <div className="profile-heading">
          <button
            type="button"
            className="profile-back-button"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <h1>My Profile</h1>

            <p>Manage your personal information</p>
          </div>
        </div>

        {/* Profile Card */}

        <div className="profile-card">
          {/* Profile Header */}

          <div className="profile-card-header">
            <div className="profile-avatar">{getInitials(user?.name)}</div>

            <div className="profile-user-info">
              <h2>{user?.name}</h2>

              <p>{user?.email}</p>

              <span className="profile-role">
                <i className="bi bi-person-check-fill"></i>
                Customer
              </span>
            </div>
          </div>

          {/* Form */}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-section">
              <div className="profile-section-title">
                <i className="bi bi-person"></i>

                <div>
                  <h3>Personal Information</h3>

                  <p>Update your basic account details.</p>
                </div>
              </div>

              <div className="profile-form-grid">
                {/* Name */}

                <div className="profile-field">
                  <label htmlFor="profile-name">Full Name</label>

                  <div className="profile-input-wrapper">
                    <i className="bi bi-person"></i>

                    <input
                      id="profile-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email */}

                <div className="profile-field">
                  <label htmlFor="profile-email">Email Address</label>

                  <div className="profile-input-wrapper">
                    <i className="bi bi-envelope"></i>

                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}

            <div className="profile-section">
              <div className="profile-section-title">
                <i className="bi bi-shield-lock"></i>

                <div>
                  <h3>Security</h3>

                  <p>Change your password securely.</p>
                </div>
              </div>

              <div className="profile-security-note">
                <i className="bi bi-info-circle"></i>

                <span>
                  Your current password is required when changing your email or
                  password.
                </span>
              </div>

              <div className="profile-form-grid">
                {/* Current Password */}

                <div className="profile-field">
                  <label htmlFor="current-password">Current Password</label>

                  <div className="profile-input-wrapper">
                    <i className="bi bi-lock"></i>

                    <input
                      id="current-password"
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                {/* New Password */}

                <div className="profile-field">
                  <label htmlFor="new-password">New Password</label>

                  <div className="profile-input-wrapper">
                    <i className="bi bi-key"></i>

                    <input
                      id="new-password"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}

            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={() => navigate("/")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
