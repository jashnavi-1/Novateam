import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { getApiErrorMessage } from "../services/api";
import { registerLocalUser } from "../services/localAuth";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post("/users/register", user);
      alert("Registered Successfully!");
      console.log(res.data);
      localStorage.setItem(
        "bluedeskUser",
        JSON.stringify({
          id: res?.data?.id,
          name: res?.data?.name || user.name,
          email: res?.data?.email || user.email,
          loggedInAt: new Date().toISOString()
        })
      );
      navigate("/plans");
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Registration failed");
      const isBackendConnectionIssue =
        err?.code === "ERR_NETWORK" || err?.code === "ECONNABORTED";

      if (isBackendConnectionIssue) {
        try {
          const fallbackUser = registerLocalUser(user);

          localStorage.setItem(
            "bluedeskUser",
            JSON.stringify({
              name: fallbackUser.name,
              email: fallbackUser.email,
              loggedInAt: new Date().toISOString(),
              authMode: "local"
            })
          );

          alert("Backend is offline. Registered in local mode successfully.");
          navigate("/plans");
          return;
        } catch (localError) {
          alert(localError.message || "Local registration failed.");
          return;
        }
      }

      const normalizedMessage = errorMessage.toLowerCase();

      if (
        normalizedMessage.includes("duplicate entry") ||
        normalizedMessage.includes("users.email") ||
        normalizedMessage.includes("email")
      ) {
        alert("This email is already registered. Please log in instead.");
        return;
      }

      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <aside className="register-card__promo">
          <div className="register-promo-orb register-promo-orb--large" />
          <div className="register-promo-orb register-promo-orb--small" />
          <div className="register-promo-content">
            <p className="register-eyebrow">Create Account</p>
            <h1>
              Start Your
              <span>SubSync Journey</span>
            </h1>
            <p className="register-promo-text">
              Build your account in a few seconds and keep your subscriptions,
              billing, and plan choices in one calm dashboard.
            </p>

          </div>
        </aside>

        <section className="register-card__form">
          <div className="login-brand">SubSync</div>

          <p className="login-eyebrow">Join Now</p>
          <h2 className="register-title">Create Your Account</h2>
          <p className="register-subtitle">
            Fill in your details to get started with a cleaner subscription
            workflow.
          </p>

          <div className="login-form">
            <div className="login-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                onChange={handleChange}
              />
            </div>

            <div className="login-actions">
              <button className="login-primary-btn" onClick={handleSubmit}>
                Register
              </button>

              <div className="login-footer">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
