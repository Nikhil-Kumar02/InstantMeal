import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminLogin.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function AdminLogin() {
    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/login`, data);
            const { token, email } = response.data;

            // Verify the user has ADMIN role
            const profileRes = await axios.get(`${API_BASE}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const roles = profileRes.data.roles || [];
            if (!roles.includes("ROLE_ADMIN")) {
                toast.error("Access denied. This account does not have admin privileges.");
                return;
            }

            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminUser", JSON.stringify(profileRes.data));
            toast.success(`Welcome, ${profileRes.data.name}!`);
            navigate("/");
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Invalid credentials. Please try again.");
            } else {
                toast.error("Login failed. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-bg">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-login-icon">
                        <i className="bi bi-shield-lock-fill"></i>
                    </div>
                    <h1 className="admin-login-title">Admin Portal</h1>
                    <p className="admin-login-subtitle">InstantMeal Control Panel</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="mb-3">
                        <label htmlFor="adminEmail" className="admin-form-label">Email Address</label>
                        <div className="admin-input-wrapper">
                            <i className="bi bi-envelope admin-input-icon"></i>
                            <input
                                id="adminEmail"
                                type="email"
                                name="email"
                                className="admin-form-control"
                                placeholder="admin@instantmeal.com"
                                value={data.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="adminPassword" className="admin-form-label">Password</label>
                        <div className="admin-input-wrapper">
                            <i className="bi bi-lock admin-input-icon"></i>
                            <input
                                id="adminPassword"
                                type="password"
                                name="password"
                                className="admin-form-control"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <i className="bi bi-info-circle me-1"></i>
                    Only admin-registered accounts can access this portal.
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
