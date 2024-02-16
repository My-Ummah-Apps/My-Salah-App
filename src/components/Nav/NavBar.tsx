// import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { NavLink } from "react-router-dom";
// import { useState } from "react";
// import { IconContext } from "react-icons";
// import { FaHome } from "react-icons/fa";
// import { GrHomeRounded } from "react-icons/gr";
import { BsFillHouseDoorFill, BsFillNutFill } from "react-icons/bs";
// import { MdCalendarMonth } from "react-icons/md";
import { FaCompass } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { IoIosStats } from "react-icons/io";

// import { MdSettings, MdHome, MdMenu } from "react-icons/md";

//   padding: 1rem 3rem 0.5rem 3rem;

const NavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 z-10 flex items-center justify-around w-full max-w-2xl  bg-[var(--secondary-color)] navbar-wrap pb-env-safe-area-inset-bottom rounded-t-2xl ">
      <NavLink
        onClick={() => {
          //   setActivePage("settings");
        }}
        className="nav-link px-3 py-1.5 pt-0.5"
        to="/SettingsPage"
      >
        <BsFillNutFill
          className="text-2xl nav-icon"
          //   color={activePage == "settings" ? activeBackgroundColor : "grey"}
        />
      </NavLink>
      <NavLink
        onClick={() => {
          //   setActivePage("home");
        }}
        className="nav-link px-3 py-1.5 pt-0.5"
        to="/StatsPage"
      >
        <div>
          <IoIosStats
            className="text-2xl nav-icon"
            // color={activePage == "home" ? activeBackgroundColor : "grey"}
          />
        </div>
      </NavLink>
      <NavLink
        onClick={() => {
          //   setActivePage("home");
        }}
        className="nav-link px-3 py-1.5 pt-0.5"
        to="/"
      >
        <div>
          <BsFillHouseDoorFill
            className="text-2xl nav-icon"
            // color={activePage == "home" ? activeBackgroundColor : "grey"}
          />
        </div>
      </NavLink>
      <NavLink
        onClick={() => {
          //   setActivePage("counters");
        }}
        className="nav-link px-3 py-1.5 pt-0.5"
        to="/ResourcesPage"
      >
        <GrResources
          className="text-2xl nav-icon"
          //   color={activePage == "counters" ? activeBackgroundColor : "grey"}
        />
      </NavLink>
      <NavLink
        onClick={() => {
          //   setActivePage("counters");
        }}
        className="nav-link px-3 py-1.5 pt-0.5"
        to="/QiblahDirection"
      >
        <FaCompass
          className="text-2xl nav-icon"
          //   color={activePage == "counters" ? activeBackgroundColor : "grey"}
        />
      </NavLink>
    </div>
  );
};

export default NavBar;
