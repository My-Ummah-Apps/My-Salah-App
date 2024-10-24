// import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useState } from "react";
// import { IconContext } from "react-icons";
import { BsFillHouseDoorFill, BsFillNutFill } from "react-icons/bs";
// import { MdCalendarMonth } from "react-icons/md";
// import { FaCompass } from "react-icons/fa";
// import { GrResources } from "react-icons/gr";
import { RiBarChart2Fill } from "react-icons/ri";
import { RiBarChart2Line } from "react-icons/ri";
import { BsHouseDoor } from "react-icons/bs";
import { BsNut } from "react-icons/bs";

// import { BiSolidBarChartAlt2 } from "react-icons/bi";
// import { MdSettings, MdHome, MdMenu } from "react-icons/md";

const NavBar = () => {
  const [activePage, setActivePage] = useState("home");

  // const activeBackgroundColor = "#0c72ff";
  const activeBackgroundColor = "grey";

  return (
    <div className="fixed bottom-0 left-0 z-10 flex items-center justify-around w-full bg-[var(--secondary-color)] navbar-wrap pb-env-safe-area-inset-bottom">
      <NavLink
        onClick={() => {
          setActivePage("settings");
        }}
        className="nav-link px-3  pt-0.5"
        to="/SettingsPage"
      >
        {activePage === "settings" ? (
          <BsFillNutFill
            className="m-4 text-2xl nav-icon"
            color={activePage === "settings" ? activeBackgroundColor : "grey"}
          />
        ) : (
          <BsNut
            className="m-4 text-2xl nav-icon"
            color={activePage === "settings" ? activeBackgroundColor : "grey"}
          />
        )}
      </NavLink>
      <NavLink
        onClick={() => {
          setActivePage("home");
        }}
        className="nav-link px-3  pt-0.5"
        to="/"
      >
        <div>
          {activePage === "home" ? (
            <BsFillHouseDoorFill
              className="m-4 text-2xl nav-icon"
              color={activePage === "home" ? activeBackgroundColor : "grey"}
            />
          ) : (
            <BsHouseDoor
              className="m-4 text-2xl nav-icon"
              color={activePage === "home" ? activeBackgroundColor : "grey"}
            />
          )}
        </div>
      </NavLink>
      <NavLink
        onClick={() => {
          setActivePage("stats");
        }}
        className="nav-link px-3  pt-0.5"
        to="/StatsPage"
      >
        <div>
          {activePage === "stats" ? (
            <RiBarChart2Fill
              className="m-4 text-2xl nav-icon"
              color={activePage === "stats" ? activeBackgroundColor : "grey"}
            />
          ) : (
            <RiBarChart2Line
              className="m-4 text-2xl nav-icon"
              color={activePage === "stats" ? activeBackgroundColor : "grey"}
            />
          )}
        </div>
      </NavLink>

      {/* <NavLink
        onClick={() => {
          setActivePage("resources");
        }}
        className="nav-link px-3 pt-0.5"
        to="/ResourcesPage"
      >
        <GrResources
          className="m-4 text-2xl nav-icon"
          color={activePage === "resources" ? activeBackgroundColor : "grey"}
        />
      </NavLink> */}
      {/* <NavLink
        onClick={() => {
          //   setActivePage("counters");
        }}
        className="nav-link px-3 pt-0.5"
        to="/QiblahDirection"
      >
        <FaCompass
          className="text-2xl nav-icon"
          //   color={activePage == "counters" ? activeBackgroundColor : "grey"}
        />
      </NavLink> */}
    </div>
  );
};

export default NavBar;
