import React, { useState } from "react";

import "./css/Login.css";
import Cookies from "js-cookie";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username === "admin" && formData.password === "password") {
      setErrors("");

      Cookies.set("username", "admin", { expires: 7 });

      localStorage.setItem("username", "admin");
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      setErrors("Invalid username or password");
    }
  };

  //check and remove the username
  if (localStorage.getItem("username")) {
    localStorage.removeItem("username");
  }

  return (
    <div className="login-container">
      <h2 className="login-h2">Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="login-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="login-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="login-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="login-input"
          />
        </div>
        {errors && <div style={{ color: "red" }}>{errors}</div>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

/*

import React from 'react'


function LoginPage() {
  return (
    <div>
        <form className='login-form'>

            <h1>Login</h1>
            <div>
                <label className='login-label'>Username</label>
                <input type="text" placeholder='Enter your username' className='login-input'  />
            </div>

            <div>
                <label className='login-label'>Password</label>
                <input type="password" placeholder='Enter your password' className='login-input' />
            </div>

            <button type="submit" className='login-btn'>Login</button>
            <button type ="reset" className='login-btn'>Reset</button>
            

            

        </form>
    

    </div>
  )
}

export default LoginPage
*/
