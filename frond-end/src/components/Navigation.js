// Navigation.js
import React from "react";
import { Link } from "react-router-dom";
import "./css/Navigation.css";
import Cookies from "js-cookie";

function Navigation() {
  if (Cookies.get("username") === undefined) {
    // redeirect("/login");
    window.location.href = "/login";
  } else {
  }

  return (
    <nav className="nav">
      <Link to="/items" className="nav-link">
        Items
      </Link>

      <Link to="/stock-management" className="nav-link">
        Stock
      </Link>

      <Link to="/point-of-sale" className="nav-link">
        Point of Sale
      </Link>

      {/* logout */}
      <Link to="/login" className="nav-link">
        Logout
      </Link>
    </nav>
  );
}

export default Navigation;
