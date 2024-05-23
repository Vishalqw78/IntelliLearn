import React from "react";
import { Link } from "react-router-dom";
import config from "../config/config.json";
import "../styles/ab.css"; // Import configData.js
import "../styles/abc.css"; // Import configData.js

const Logo = () => {
  const { logo, logo_height, logo_width, logoText, title } = config.site;

  return (
    <Link to="/" className="navbar-brand block">
      {logo ? (
        <img
          src={logo}
          alt={title}
          style={{
            height: logo_height.replace("px", "") + "px",
            width: logo_width.replace("px", "") + "px",
          }}
        />
      ) : (
        logoText || title
      )}
    </Link>
  );
};

export default Logo;
