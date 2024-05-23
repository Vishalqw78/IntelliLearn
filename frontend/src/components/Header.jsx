import menu from "../config/menu.json";
import React, { useContext, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import "../styles/ab.css";
import "../styles/abc.css";
import SearchModal from "./SearchModal";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  // distructuring the main menu from menu object
  const { main } = menu;
  const {currentUser} =useContext(AuthContext);

  const username = currentUser?.Name;

  // states declaration
  const [navFixed, setNavFixed] = useState(false);
  const [searchModal, setSearchModal] = useState(false);

  useEffect(() => {
    const changeNavbarBackground = () => {
      if (window.scrollY >= 1) {
        setNavFixed(true);
      } else {
        setNavFixed(false);
      }
    };
    window.addEventListener("scroll", changeNavbarBackground);
  });

  return (
    <>
      <header
        className={`sticky top-0 z-20 bg-white py-2 transition-all ${
          navFixed ? "shadow" : "pt-2 md:pt-4"
        }`}
      >
        <nav className="navbar container">
          {/* logo */}
          <div className="order-0">
            <Logo />
          </div>
          {/* navbar toggler */}
          <input id="nav-toggle" type="checkbox" className="hidden" />
          <label
            id="show-button"
            htmlFor="nav-toggle"
            className="order-2 flex cursor-pointer items-center md:order-1 md:hidden"
          >
            <svg className="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Open</title>
              <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z" />
            </svg>
          </label>
          <label
            id="hide-button"
            htmlFor="nav-toggle"
            className="order-2 hidden cursor-pointer items-center md:order-1"
          >
            <svg className="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Close</title>
              <polygon
                points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
                transform="rotate(45 10 10)"
              />
            </svg>
          </label>
          {/* /navbar toggler */}

          <ul
            id="nav-menu"
            className="navbar-nav order-3 hidden w-full md:order-1 md:flex md:w-auto md:space-x-2"
          >
            {main.map((menu, i) => (
              <React.Fragment key={`menu-${i}`}>
                {menu.hasChildren ? (
                  <li className="nav-item nav-dropdown group relative ">
                    <span className="nav-link inline-flex items-center ">
                      {menu.name}
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </span>
                    <ul className="nav-dropdown-list hidden group-hover:block  md:absolute md:block">
                      {menu.children.map((child, i) => (
                        <li className="nav-dropdown-item" key={`children-${i}`}>
                          <Link
                            to={child.url}
                            className="nav-dropdown-link block"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    {/* 
                    {child.name === "Login" && username ? ( // Check if user is authenticated and child name is "Login"
                            <Link to="/write" className="nav-dropdown-link block">Write</Link>
                          ) : (
                            <Link to={child.url} className="nav-dropdown-link block">{child.name}</Link>
                          )}
                    */}
                    {menu.name === "Login" && username ? (
                      <Link to="/Write" className="nav-link block">
                        {"Write"}
                      </Link>
                    ) : (
                      <Link to={menu.url} className="nav-link block">
                        {menu.name}
                      </Link>
                    )}
                    
                  </li>
                )}
              </React.Fragment>
            ))}
            <li className="nav-item">
            {username && <Link to="/Profile" className="nav-link block">
                        {"Profile"}
                      </Link>}
            </li>
          </ul>
          <div className="order-1 ml-auto md:order-2 md:ml-0">
            <div
              className="cursor-pointer p-2 text-xl text-dark hover:text-primary"
              onClick={() => {
                setSearchModal(true);
              }}
            >
              <IoSearch />
            </div>
          </div>

          <SearchModal
            searchModal={searchModal}
            setSearchModal={setSearchModal}
          />
        </nav>
      </header>
    </>
  );
};

export default Header;
