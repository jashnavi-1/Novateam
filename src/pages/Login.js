import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { getApiErrorMessage } from "../services/api";
import { loginLocalUser } from "../services/localAuth";

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post(
        `/users/login?email=${loginData.email}&password=${loginData.password}`
      );

      localStorage.setItem(
        "bluedeskUser",
        JSON.stringify({
          id: res?.data?.id,
          name: res?.data?.name || loginData.email?.split("@")[0],
          email: res?.data?.email || loginData.email,
          loggedInAt: new Date().toISOString()
        })
      );

      console.log(res.data);
      navigate("/plans");
    } catch (err) {
      const message = getApiErrorMessage(err, "Please try again.");
      const isBackendConnectionIssue =
        err?.code === "ERR_NETWORK" || err?.code === "ECONNABORTED";

      if (isBackendConnectionIssue) {
        const localUser = loginLocalUser(loginData);

        if (!localUser) {
          alert("Backend is offline and local user was not found. Please register first.");
          return;
        }

        localStorage.setItem(
          "bluedeskUser",
          JSON.stringify({
            name: localUser.name,
            email: localUser.email,
            loggedInAt: new Date().toISOString(),
            authMode: "local"
          })
        );

        alert("Backend is offline. Logged in with local mode.");
        navigate("/plans");
        return;
      }

      alert(`Login Failed: ${message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-card__form">
          <div className="login-brand">SubSync</div>

          <p className="login-eyebrow">Welcome Back</p>
          <h1 className="login-title">
            <span>Login to Your</span>
            <span>Account</span>
          </h1>
          <p className="login-subtitle">
            Access your workspace with your existing details and keep everything
            simple, clean, and fast.
          </p>

          <div className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
              />
            </div>

            <div className="login-actions">
              <button className="login-primary-btn" onClick={handleLogin}>
                Sign In
              </button>

              <div className="login-footer">
                Don&apos;t have an account? <Link to="/">Register</Link>
              </div>
            </div>
          </div>
        </section>

        <aside className="login-card__promo">
          <div className="login-promo-shape" />
          <div className="login-promo-content">
            <h2>New Here?</h2>
            <p>
              Create your account and start managing subscriptions with a fresh
              blue-and-white experience.
            </p>
            <Link to="/" className="login-secondary-btn">
              Sign Up
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Login;
