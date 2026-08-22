import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Menubar.css";

function Menubar({ toggleSidebar }) {
  const navigate = useNavigate();

  let adminUser = null;

  try {
    const storedUser = localStorage.getItem("adminUser");

    if (storedUser) {
      adminUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unable to read admin user:", error);
    adminUser = null;
  }

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  const getInitials = (name = "") => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return "A";
    }

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const adminName = adminUser?.name || "Admin User";
  const adminEmail = adminUser?.email || "admin@instantmeal.com";

  return (
    <nav className="navbar admin-navbar">
      <div className="container-fluid admin-navbar-container">

        {/* LEFT SIDE */}
        <div className="admin-navbar-left">

          {/* Sidebar Toggle */}
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Brand */}
          <div
            className="admin-navbar-brand"
            onClick={() => navigate("/")}
          >
            <div className="admin-brand-icon">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>

            <div className="admin-brand-content">
              <span className="admin-brand-name">
                InstantMeal
              </span>

              <span className="admin-brand-label">
                ADMIN PANEL
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="admin-navbar-right">

          <div className="dropdown">

            <button
              type="button"
              className="admin-avatar-button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="admin-avatar-circle">
                {getInitials(adminName)}
              </span>

              <div className="admin-profile-info">
                <span className="admin-profile-name">
                  {adminName}
                </span>

                <span className="admin-profile-role">
                  Administrator
                </span>
              </div>

              <i className="bi bi-chevron-down admin-dropdown-arrow"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end admin-dropdown">

              {/* PROFILE HEADER */}
              <li className="admin-dropdown-header">

                <div className="admin-dropdown-profile">

                  <div className="admin-dropdown-avatar">
                    {getInitials(adminName)}
                  </div>

                  <div className="admin-dropdown-user-info">
                    <div className="admin-name">
                      {adminName}
                    </div>

                    <div className="admin-email">
                      {adminEmail}
                    </div>
                  </div>

                </div>

                <div className="admin-role-badge">
                  <i className="bi bi-shield-check"></i>
                  Administrator
                </div>

              </li>

              {/* PROFILE */}
              <li>
                <button
                  type="button"
                  className="dropdown-item admin-dropdown-item"
                >
                  <span className="admin-dropdown-icon">
                    <i className="bi bi-person"></i>
                  </span>

                  <span>
                    <span className="admin-item-title">
                      Profile
                    </span>

                    <span className="admin-item-description">
                      Manage your account
                    </span>
                  </span>
                </button>
              </li>

              {/* SETTINGS */}
              <li>
                <button
                  type="button"
                  className="dropdown-item admin-dropdown-item"
                >
                  <span className="admin-dropdown-icon">
                    <i className="bi bi-gear"></i>
                  </span>

                  <span>
                    <span className="admin-item-title">
                      Settings
                    </span>

                    <span className="admin-item-description">
                      Application settings
                    </span>
                  </span>
                </button>
              </li>

              <li>
                <hr className="admin-dropdown-divider" />
              </li>

              {/* LOGOUT */}
              <li>
                <button
                  type="button"
                  className="dropdown-item admin-dropdown-item admin-logout-item"
                  onClick={logout}
                >
                  <span className="admin-dropdown-icon admin-logout-icon">
                    <i className="bi bi-box-arrow-right"></i>
                  </span>

                  <span>
                    <span className="admin-item-title">
                      Logout
                    </span>

                    <span className="admin-item-description">
                      Sign out of admin panel
                    </span>
                  </span>
                </button>
              </li>

            </ul>

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Menubar;