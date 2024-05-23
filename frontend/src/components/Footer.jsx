import React from "react";
import Social from "./Social";
import menu from "../config/menu.json";
import social from "../config/social.json";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="section bg-theme-dark">
      <div className="container text-center mt-10">
        {/* footer menu */}
        <ul className="mb-8 space-x-4">
          {menu.footer.map((menu) => (
            <li className="inline-block" key={menu.name}>
              <Link
                href={menu.url}
                className="p-4 text-gray-500 hover:text-white"
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* social icons */}
        <Social source={social} className="social-icons mb-8" />
        {/* copyright */}
        <h6 className="text-gray-500">
          Copyright © 2024 ByteLogs. All rights reserved.
        </h6>
      </div>
    </footer>
  );
};

export default Footer;
